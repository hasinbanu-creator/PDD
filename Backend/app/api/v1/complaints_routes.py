from fastapi import APIRouter, Depends, status, HTTPException, Query, Form, UploadFile, File
from bson import ObjectId
import logging
from typing import Optional, List
import os
import uuid
import aiofiles
from datetime import datetime

from app.core.response import SuccessResponse
from app.dependencies.auth_dependency import get_current_user
from app.core.exceptions import CivifixException
from app.core.enums import Roles, ComplaintType, Priority
from app.schemas.complaint_schema import (
    ComplaintCreateSchema, ComplaintAssignWorkerSchema,
    ComplaintSubmitResolutionSchema, ComplaintApproveSchema,
    ComplaintRejectSchema
)
from app.services.complaint_service import ComplaintService
from app.repositories.complaint_repository import ComplaintRepository
from app.repositories.ward_repository import WardRepository
from app.repositories.user_repository import UserRepository
from app.db.mongodb import get_database
from app.dependencies.role_dependency import require_role

logger = logging.getLogger(__name__)

router = APIRouter()


def get_complaint_service(db=Depends(get_database)):
    """Dependency for complaint service"""
    complaint_repo = ComplaintRepository(db)
    ward_repo = WardRepository(db)
    user_repo = UserRepository
    return ComplaintService(complaint_repo, ward_repo, user_repo)


@router.post(
    "/verify-image",
    response_model=dict,
    summary="Verify Complaint Image via AI",
    tags=["Complaints"]
)
async def verify_complaint_image_endpoint(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """Verify uploaded image contains a valid civic issue and is not blurry"""
    import traceback
    from fastapi.responses import JSONResponse
    
    try:
        content = await file.read()
        content_length = len(content)
        logger.info(f"[AI Image Verification Endpoint] Received file: '{file.filename}', Content Type: '{file.content_type}', Size: {content_length} bytes")
        
        from app.ai.image_verification import verify_complaint_image
        result = await verify_complaint_image(content, file.content_type)
        
        if result.get("api_status") in ["TIMEOUT", "API_ERROR", "FAILED"]:
            error_msg = result.get("error_details") or result.get("api_error_details") or "AI Verification Unavailable"
            logger.error(f"[AI Image Verification Endpoint] Gemini verification failed. Status: {result.get('api_status')}, Error: {error_msg}")
            
            # Map appropriate status code. e.g. 503 if API error/timeout, 500 otherwise.
            status_code = status.HTTP_503_SERVICE_UNAVAILABLE if result.get("api_status") in ["TIMEOUT", "API_ERROR"] else status.HTTP_500_INTERNAL_SERVER_ERROR
            return JSONResponse(
                status_code=status_code,
                content={
                    "success": False,
                    "error": f"Gemini returned: {error_msg}"
                }
            )
            
        is_verified = result.get("contains_civic_issue", False) and not result.get("is_low_quality", False)
        
        # Convert confidence to percentage if float
        raw_conf = result.get("confidence", 1.0)
        if isinstance(raw_conf, (int, float)):
            if raw_conf <= 1.0:
                confidence_val = int(raw_conf * 100)
            else:
                confidence_val = int(raw_conf)
        else:
            confidence_val = 100

        logger.info(f"[AI Image Verification Endpoint] Image verified successfully. contains_civic_issue: {result.get('contains_civic_issue')}, is_low_quality: {result.get('is_low_quality')}")
        
        return {
            "success": True,
            "verified": is_verified,
            "category_match": True,
            "confidence": confidence_val,
            "message": "Image verified successfully.",
            "data": result
        }
    except Exception as e:
        tb = traceback.format_exc()
        logger.error(f"[AI Image Verification Endpoint] Unexpected crash in endpoint:\n{tb}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "success": False,
                "error": f"Internal server error: {str(e)}"
            }
        )


@router.post(
    "",
    response_model=dict,
    status_code=status.HTTP_201_CREATED,
    summary="Create Complaint",
    tags=["Complaints"]
)
async def create_complaint(
    ward_id: str = Form(...),
    complaint_type: str = Form(...),
    description: str = Form(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    address: Optional[str] = Form(None),
    landmark: str = Form(...),
    citizen_note: Optional[str] = Form(None),
    priority: Optional[str] = Form(Priority.MEDIUM),
    images: List[UploadFile] = File(default=[]),
    districtId: Optional[str] = Form(None),
    districtName: Optional[str] = Form(None),
    wardId: Optional[str] = Form(None),
    wardName: Optional[str] = Form(None),
    ai_verification: Optional[str] = Form(None),
    force_create: Optional[bool] = Form(False),
    duplicate_detection: Optional[str] = Form(None),
    current_user: dict = Depends(get_current_user),
    service: ComplaintService = Depends(get_complaint_service)
):
    """Create a new complaint (CITIZEN only)"""
    try:
        logger.info("Complaint endpoint reached")
        
        user_id = current_user["user_id"]
        logger.info(f"Complaint creation requested by user: {user_id}")
        
        image_urls = []
        ai_verification_result = None
        parsed_duplicate_detection = None
        
        if ai_verification:
            try:
                import json
                ai_verification_result = json.loads(ai_verification)
                logger.info(f"Loaded client-side ai_verification payload: {ai_verification_result}")
            except Exception as parse_err:
                logger.error(f"Failed to parse client ai_verification: {str(parse_err)}")
                
        if duplicate_detection:
            try:
                import json
                parsed_duplicate_detection = json.loads(duplicate_detection)
                logger.info(f"Loaded client-side duplicate_detection payload: {parsed_duplicate_detection}")
            except Exception as parse_err:
                logger.error(f"Failed to parse client duplicate_detection: {str(parse_err)}")
        if images:
            upload_dir = os.path.join("uploads", user_id, "images")
            os.makedirs(upload_dir, exist_ok=True)
            for idx, file in enumerate(images):
                if not file.filename:
                    continue
                file_uuid = uuid.uuid4().hex[:8]
                new_filename = f"complaint_{file_uuid}.jpg"
                file_path = os.path.join(upload_dir, new_filename)
                
                content = await file.read()
                
                # Perform AI verification on the first valid image
                if idx == 0 and not ai_verification_result:
                    try:
                        from app.ai.image_verification import verify_complaint_image
                        from app.core.exceptions import ImageVerificationException
                        
                        ai_verification_result = await verify_complaint_image(content, file.content_type)
                        
                        if ai_verification_result and not ai_verification_result.get("should_allow_submission", True):
                            raise ImageVerificationException(
                                message="Image verification failed: image does not contain a civic issue.",
                                errors=ai_verification_result
                            )
                    except ImageVerificationException:
                        raise
                    except Exception as ai_err:
                        logger.error(f"Error calling AI image verification: {str(ai_err)}")
                
                async with aiofiles.open(file_path, 'wb') as out_file:
                    await out_file.write(content)
                # Store exactly as requested: <user_id>/images/complaint_<uuid>.jpg
                image_urls.append(f"{user_id}/images/{new_filename}")

        # Resolve district and ward names to pass to Gemini
        district_name_resolved = districtName or "Not Available"
        ward_name_resolved = wardName or "Not Available"
        
        target_ward_id = wardId or ward_id
        if (not districtName or not wardName) and target_ward_id:
            try:
                from app.repositories.ward_repository import WardRepository
                from app.db.mongodb import get_database
                db_conn = get_database()
                w_repo = WardRepository(db_conn)
                ward_doc = await w_repo.get_by_id(target_ward_id)
                if ward_doc:
                    if not wardName:
                        ward_name_resolved = ward_doc.get("ward_name") or "Not Available"
                    dist_id = ward_doc.get("district_id")
                    if dist_id and not districtName:
                        dist_doc = await db_conn["districts"].find_one({"_id": dist_id})
                        if dist_doc:
                            district_name_resolved = dist_doc.get("name") or "Not Available"
            except Exception as lookup_err:
                logger.error(f"Failed to lookup names for priority prediction: {lookup_err}")

        # Run Priority Prediction
        ai_priority_result = None
        try:
            from app.ai.priority_prediction import predict_complaint_priority
            ai_priority_result = await predict_complaint_priority(
                category=complaint_type,
                description=description,
                district=district_name_resolved,
                ward=ward_name_resolved
            )
        except Exception as pred_err:
            logger.error(f"Error invoking priority prediction: {pred_err}")
            ai_priority_result = {
                "priority": "Medium",
                "confidence": 0,
                "reason": "AI prediction unavailable.",
                "api_status": "FAILED"
            }

        # Override complaint priority with predicted priority
        pred_p = ai_priority_result.get("priority", "Medium") if ai_priority_result else "Medium"
        compat_priority = pred_p.upper()
        if compat_priority not in ["LOW", "MEDIUM", "HIGH", "CRITICAL"]:
            compat_priority = "MEDIUM"

        ai_block = {}
        if ai_priority_result:
            ai_block["priority_prediction"] = {
                "priority": ai_priority_result.get("priority", "Medium"),
                "confidence": ai_priority_result.get("confidence", 0),
                "reason": ai_priority_result.get("reason", "AI prediction unavailable.")
            }
        if ai_verification_result:
            conf = ai_verification_result.get("confidence", 100)
            if isinstance(conf, (int, float)):
                if conf <= 1.0:
                    conf = int(conf * 100)
                else:
                    conf = int(conf)
            ai_block["image_verification"] = {
                "contains_civic_issue": ai_verification_result.get("contains_civic_issue", True),
                "predicted_category": ai_verification_result.get("predicted_category", "OTHER"),
                "confidence": conf,
                "reason": ai_verification_result.get("reason", ""),
                "verified_at": ai_verification_result.get("verified_at") or datetime.utcnow().isoformat()
            }

        # Resolve target district id and ward id
        target_ward_id = wardId or ward_id
        target_district_id = districtId
        if not target_district_id and target_ward_id:
            try:
                from app.repositories.ward_repository import WardRepository
                w_repo = WardRepository(service.complaint_repo.db)
                ward_doc = await w_repo.get_by_id(target_ward_id)
                if ward_doc:
                    target_district_id = str(ward_doc.get("district_id"))
            except Exception:
                pass
        if not target_district_id:
            target_district_id = current_user.get("district_id")

        # Run duplicate detection if not forced and target parameters are resolved
        existing_complaints = []
        if not force_create and target_ward_id and target_district_id:
            try:
                from bson import ObjectId
                def make_id(val):
                    try:
                        return ObjectId(val)
                    except:
                        return val
                
                query = {
                    "district_id": {"$in": [target_district_id, make_id(target_district_id)]},
                    "ward_id": {"$in": [target_ward_id, make_id(target_ward_id)]},
                    "status": {"$nin": ["RESOLVED", "CLOSED", "REJECTED"]}
                }
                
                existing_docs = await service.complaint_repo.db.complaints.find(query).to_list(length=100)
                for doc in existing_docs:
                    existing_complaints.append(doc)
            except Exception as query_err:
                logger.error(f"Failed to query existing complaints for duplicate checking: {query_err}")

        if not force_create and existing_complaints:
            try:
                from app.ai.duplicate_detection import detect_duplicate_complaint
                new_comp_payload = {
                    "category": complaint_type,
                    "description": description,
                    "district": district_name_resolved,
                    "ward": ward_name_resolved
                }
                duplicate_result = await detect_duplicate_complaint(new_comp_payload, existing_complaints)
                
                if duplicate_result and duplicate_result.get("duplicate") is True:
                    # Find matching complaint in database
                    matched_id = duplicate_result.get("matched_complaint_id")
                    matched_doc = None
                    for c in existing_complaints:
                        if str(c.get("_id")) == str(matched_id) or c.get("complaint_id") == str(matched_id):
                            matched_doc = c
                            break
                    
                    if not matched_doc and matched_id:
                        from bson import ObjectId
                        try:
                            matched_doc = await service.complaint_repo.db.complaints.find_one({
                                "$or": [
                                    {"_id": ObjectId(matched_id) if len(str(matched_id)) == 24 else matched_id},
                                    {"complaint_id": matched_id}
                                ]
                            })
                        except Exception:
                            pass
                    
                    if matched_doc:
                        formatted_existing = {
                            "id": str(matched_doc["_id"]),
                            "complaint_id": matched_doc.get("complaint_id"),
                            "complaint_type": matched_doc.get("complaint_type"),
                            "status": matched_doc.get("status"),
                            "support_count": matched_doc.get("support_count", 0),
                            "description": matched_doc.get("description")
                        }
                        
                        return {
                            "status": "duplicate_check",
                            "message": "Similar complaint found",
                            "data": {
                                "duplicate": True,
                                "matched_complaint_id": matched_doc.get("complaint_id") or str(matched_doc["_id"]),
                                "similarity": duplicate_result.get("similarity", 95),
                                "reason": duplicate_result.get("reason", "Possible duplicate complaint."),
                                "existing_complaint": formatted_existing
                            }
                        }
            except Exception as ai_dup_err:
                logger.error(f"Error in duplicate checking flow: {str(ai_dup_err)}")

        if parsed_duplicate_detection:
            ai_block["duplicate_detection"] = {
                "duplicate": parsed_duplicate_detection.get("duplicate", True),
                "matched_complaint_id": parsed_duplicate_detection.get("matched_complaint_id"),
                "similarity": parsed_duplicate_detection.get("similarity", 90),
                "reason": parsed_duplicate_detection.get("reason", "Possible duplicate complaint.")
            }

        complaint_data = ComplaintCreateSchema(
            ward_id=wardId or ward_id,
            complaint_type=ComplaintType(complaint_type),
            description=description,
            latitude=latitude,
            longitude=longitude,
            address=address,
            landmark=landmark,
            citizen_note=citizen_note,
            priority=Priority(compat_priority),
            image_urls=image_urls,
            districtId=districtId,
            districtName=districtName,
            wardId=wardId or ward_id,
            wardName=wardName,
            ai_verification=ai_verification_result,
            ai_priority=ai_priority_result,
            ai=ai_block,
            final_priority=pred_p
        )
        logger.info(f"Complaint payload: {complaint_data.dict()}")
        
        result = await service.create_complaint(
            complaint_data,
            user_id,
            current_user.get("role", "CITIZEN")
        )
        logger.info(f"Complaint successfully created and inserted into MongoDB: {result.get('_id')}")
        return SuccessResponse.create(
            data=result,
            message="Complaint created successfully",
            status_code=status.HTTP_201_CREATED
        )
    except CivifixException as e:
        logger.error(f"Complaint creation error: {str(e)}")
        raise HTTPException(status_code=e.status_code, detail=str(e))
    except Exception as e:
        import traceback
        logger.error(f"Unexpected error: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


@router.post(
    "/draft",
    response_model=dict,
    status_code=status.HTTP_201_CREATED,
    summary="Save Complaint Draft",
    tags=["Complaints"]
)
async def save_complaint_draft(
    complaint_data: ComplaintCreateSchema,
    current_user: dict = Depends(get_current_user),
    service: ComplaintService = Depends(get_complaint_service)
):
    """Save a draft complaint (CITIZEN only)"""
    try:
        # Save a draft complaint directly with DRAFT status
        result = await service.create_complaint(
            complaint_data,
            current_user["user_id"],
            current_user.get("role", "CITIZEN")
        )
        # Override status to DRAFT after creation
        if result and result.get("_id"):
            from app.db.mongodb import db
            from bson import ObjectId
            await db.complaints.update_one(
                {"complaint_id": result.get("complaint_id")},
                {"$set": {"status": "DRAFT"}}
            )
            result["status"] = "DRAFT"
        return SuccessResponse.create(
            data=result,
            message="Draft saved successfully",
            status_code=status.HTTP_201_CREATED
        )
    except CivifixException as e:
        logger.error(f"Draft save error: {str(e)}")
        raise HTTPException(status_code=e.status_code, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get(
    "/my/dashboard",
    response_model=dict,
    summary="My Complaints",
    tags=["Complaints"]
)
async def my_complaints(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    status: Optional[str] = Query(None),
    current_user: dict = Depends(get_current_user),
    service: ComplaintService = Depends(get_complaint_service)
):
    """Get current user's complaints"""
    try:
        result = await service.get_user_complaints(
            current_user["user_id"],
            page=page,
            limit=limit,
            status=status
        )
        return SuccessResponse.create(
            data=result,
            message="Complaints fetched successfully"
        )
    except CivifixException as e:
        logger.error(f"Error fetching complaints: {str(e)}")
        raise HTTPException(status_code=e.status_code, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get(
    "/{complaint_id}",
    response_model=dict,
    summary="Get Complaint Details",
    tags=["Complaints"]
)
async def get_complaint(
    complaint_id: str,
    current_user: dict = Depends(get_current_user),
    service: ComplaintService = Depends(get_complaint_service)
):
    """Get complaint details with history"""
    try:
        result = await service.get_complaint(complaint_id)
        return SuccessResponse.create(
            data=result,
            message="Complaint fetched successfully"
        )
    except CivifixException as e:
        logger.error(f"Complaint fetch error: {str(e)}")
        raise HTTPException(status_code=e.status_code, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.put(
    "/{complaint_id}/assign-worker",
    response_model=dict,
    summary="Assign Worker",
    tags=["Complaints"]
)
async def assign_worker(
    complaint_id: str,
    assignment_data: ComplaintAssignWorkerSchema,
    current_user: dict = Depends(get_current_user),
    role_validated: bool = Depends(require_role(["INSPECTOR"])),
    service: ComplaintService = Depends(get_complaint_service)
):
    """Assign worker to complaint (INSPECTOR only)"""
    try:
        result = await service.assign_worker(
            complaint_id,
            assignment_data,
            current_user["user_id"],
            current_user.get("role", "INSPECTOR")
        )
        return SuccessResponse.create(
            data=result,
            message="Worker assigned successfully"
        )
    except CivifixException as e:
        logger.error(f"Worker assignment error: {str(e)}")
        raise HTTPException(status_code=e.status_code, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.put(
    "/{complaint_id}/submit-work",
    response_model=dict,
    summary="Submit Work",
    tags=["Complaints"]
)
async def submit_work(
    complaint_id: str,
    work_data: ComplaintSubmitResolutionSchema,
    current_user: dict = Depends(get_current_user),
    role_validated: bool = Depends(require_role(["WORKER"])),
    service: ComplaintService = Depends(get_complaint_service)
):
    """Submit work completion (WORKER only)"""
    try:
        result = await service.submit_work(
            complaint_id,
            work_data,
            current_user["user_id"],
            current_user.get("role", "WORKER")
        )
        return SuccessResponse.create(
            data=result,
            message="Work submitted successfully"
        )
    except CivifixException as e:
        logger.error(f"Work submission error: {str(e)}")
        raise HTTPException(status_code=e.status_code, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.put(
    "/{complaint_id}/approve",
    response_model=dict,
    summary="Approve Complaint",
    tags=["Complaints"]
)
async def approve_complaint(
    complaint_id: str,
    approve_data: ComplaintApproveSchema,
    current_user: dict = Depends(get_current_user),
    role_validated: bool = Depends(require_role(["INSPECTOR"])),
    service: ComplaintService = Depends(get_complaint_service)
):
    """Approve complaint (INSPECTOR only)"""
    try:
        result = await service.approve_complaint(
            complaint_id,
            approve_data,
            current_user["user_id"],
            current_user.get("role", "INSPECTOR")
        )
        return SuccessResponse.create(
            data=result,
            message="Complaint approved successfully"
        )
    except CivifixException as e:
        logger.error(f"Approval error: {str(e)}")
        raise HTTPException(status_code=e.status_code, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.put(
    "/{complaint_id}/reject",
    response_model=dict,
    summary="Reject Complaint",
    tags=["Complaints"]
)
async def reject_complaint(
    complaint_id: str,
    reject_data: ComplaintRejectSchema,
    current_user: dict = Depends(get_current_user),
    role_validated: bool = Depends(require_role(["INSPECTOR"])),
    service: ComplaintService = Depends(get_complaint_service)
):
    """Reject complaint and return to worker (INSPECTOR only)"""
    try:
        result = await service.reject_complaint(
            complaint_id,
            reject_data,
            current_user["user_id"],
            current_user.get("role", "INSPECTOR")
        )
        return SuccessResponse.create(
            data=result,
            message="Complaint rejected successfully"
        )
    except CivifixException as e:
        logger.error(f"Rejection error: {str(e)}")
        raise HTTPException(status_code=e.status_code, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get(
    "/ward/{ward_id}",
    response_model=dict,
    summary="Ward Complaints",
    tags=["Complaints"]
)
async def get_ward_complaints(
    ward_id: str,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    status: Optional[str] = Query(None),
    current_user: dict = Depends(get_current_user),
    service: ComplaintService = Depends(get_complaint_service)
):
    """Get all complaints in a ward"""
    try:
        result = await service.get_ward_complaints(
            ward_id,
            page=page,
            limit=limit,
            status=status
        )
        return SuccessResponse.create(
            data=result,
            message="Ward complaints fetched successfully"
        )
    except CivifixException as e:
        logger.error(f"Error fetching ward complaints: {str(e)}")
        raise HTTPException(status_code=e.status_code, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get(
    "/inspector/dashboard",
    response_model=dict,
    summary="Inspector Dashboard",
    tags=["Complaints"]
)
async def inspector_dashboard(
    current_user: dict = Depends(get_current_user),
    role_validated: bool = Depends(require_role(["INSPECTOR"])),
    service: ComplaintService = Depends(get_complaint_service)
):
    """Get inspector dashboard stats"""
    try:
        result = await service.get_inspector_dashboard(current_user["user_id"])
        return SuccessResponse.create(
            data=result,
            message="Dashboard stats fetched successfully"
        )
    except CivifixException as e:
        logger.error(f"Dashboard error: {str(e)}")
        raise HTTPException(status_code=e.status_code, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.put(
    "/{complaint_id}/feedback",
    response_model=dict,
    summary="Submit Complaint Feedback",
    tags=["Complaints"]
)
async def submit_feedback(
    complaint_id: str,
    rating: int = Query(..., ge=1, le=5),
    feedback: Optional[str] = None,
    current_user: dict = Depends(get_current_user),
    service: ComplaintService = Depends(get_complaint_service)
):
    """Submit feedback and rating (CITIZEN only)"""
    try:
        update_data = {"rating": rating, "feedback": feedback, "status": "CLOSED"}
        complaint = await service.complaint_repo.get_by_id(complaint_id)
        old_status = complaint.get("status") if complaint else None
        new_status = "CLOSED"
        logger.info(f"STATUS CHANGE BEFORE - Complaint ID: {complaint_id}, Old Status: {old_status}, New Status: {new_status}")
        success = await service.complaint_repo.update(complaint_id, update_data)
        logger.info(f"STATUS CHANGE AFTER - Complaint ID: {complaint_id}, Old Status: {old_status}, New Status: {new_status}")
        if not success:
            raise HTTPException(status_code=404, detail="Complaint not found")
            
        return SuccessResponse.create(
            message="Feedback submitted successfully"
        )
    except CivifixException as e:
        raise HTTPException(status_code=e.status_code, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")

@router.put(
    "/{complaint_id}/reopen",
    response_model=dict,
    summary="Reopen Complaint",
    tags=["Complaints"]
)
async def reopen_complaint(
    complaint_id: str,
    reason: str = Query(...),
    current_user: dict = Depends(get_current_user),
    service: ComplaintService = Depends(get_complaint_service)
):
    """Reopen a closed complaint (CITIZEN only)"""
    try:
        update_data = {"status": "REOPENED", "reopen_reason": reason}
        complaint = await service.complaint_repo.get_by_id(complaint_id)
        old_status = complaint.get("status") if complaint else None
        new_status = "REOPENED"
        logger.info(f"STATUS CHANGE BEFORE - Complaint ID: {complaint_id}, Old Status: {old_status}, New Status: {new_status}")
        success = await service.complaint_repo.update(complaint_id, update_data)
        logger.info(f"STATUS CHANGE AFTER - Complaint ID: {complaint_id}, Old Status: {old_status}, New Status: {new_status}")
        if not success:
            raise HTTPException(status_code=404, detail="Complaint not found")
            
        return SuccessResponse.create(
            message="Complaint reopened successfully"
        )
    except CivifixException as e:
        raise HTTPException(status_code=e.status_code, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post(
    "/{complaint_id}/support",
    response_model=dict,
    summary="Support an existing complaint",
    tags=["Complaints"]
)
async def support_complaint(
    complaint_id: str,
    current_user: dict = Depends(get_current_user),
    service: ComplaintService = Depends(get_complaint_service)
):
    """Register citizen support for an existing complaint"""
    try:
        citizen_id = current_user["user_id"]
        result = await service.support_complaint(complaint_id, citizen_id)
        return {
            "status": "success",
            "message": "Support registered successfully",
            "data": result
        }
    except CivifixException as ce:
        raise HTTPException(status_code=ce.status_code, detail=ce.message)
    except Exception as e:
        logger.error(f"Error supporting complaint: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to register support")


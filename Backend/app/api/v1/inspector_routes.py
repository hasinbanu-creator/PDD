"""Inspector API routes"""
from fastapi import APIRouter, Depends, status, HTTPException, Query, Form, UploadFile, File
from typing import Dict, Any
from bson import ObjectId
from datetime import datetime
import logging
import os
import uuid
import aiofiles
import random

from app.core.response import ResponseHandler
from app.dependencies.auth_dependency import get_current_user
from app.dependencies.role_dependency import require_role
from app.db.mongodb import db

logger = logging.getLogger(__name__)
router = APIRouter()


def _normalize_id(value):
    """Convert a value to ObjectId when possible; otherwise keep it as-is."""
    if value is None:
        return None
    if isinstance(value, ObjectId):
        return value
    try:
        return ObjectId(value)
    except Exception:
        return value


async def _get_inspector_ward_ids(current_user: Dict[str, Any]):
    """Return all active wards assigned to the inspector."""
    inspector_id = _normalize_id(current_user.get("user_id"))
    if not inspector_id:
        return []

    wards = await db.wards.find({
        "inspector_id": inspector_id,
        "is_active": True
    }).to_list(length=1000)
    return [ward.get("_id") for ward in wards if ward.get("_id")]


async def _find_complaint_by_identifier(complaint_id: str):
    """Find a complaint using either the internal Mongo ID or the public complaint_id string."""
    normalized_id = _normalize_id(complaint_id)
    query = {"$or": [{"_id": normalized_id}, {"complaint_id": complaint_id}]}
    if not isinstance(normalized_id, ObjectId):
        query = {"complaint_id": complaint_id}
    return await db.complaints.find_one(query)


@router.get(
    "/dashboard",
    summary="Get inspector dashboard stats",
    dependencies=[Depends(require_role("INSPECTOR"))]
)
async def get_inspector_dashboard(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Get dashboard statistics for an inspector"""
    try:
        inspector_id = ObjectId(current_user["user_id"])
        
        # Determine the ward
        ward = await db.wards.find_one({"inspector_id": inspector_id, "is_active": True})
        if not ward:
            return ResponseHandler.success(
                message="No ward assigned",
                data={
                    "assigned_count": 0, "pending_inspections": 0, "in_progress_count": 0,
                    "completed_today": 0, "high_priority_count": 0, "recent_complaints": []
                }
            )
            
        ward_id = ward["_id"]
        
        # Calculate stats
        today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
        
        assigned_count = await db.complaints.count_documents({"ward_id": ward_id, "status": "ASSIGNED"})
        pending_inspections = await db.complaints.count_documents({"ward_id": ward_id, "status": {"$in": ["PENDING", "OPEN"]}})
        in_progress = await db.complaints.count_documents({"ward_id": ward_id, "status": {"$in": ["ACCEPTED", "IN_PROGRESS", "FIELD_VISIT"]}})
        completed_today = await db.complaints.count_documents({"ward_id": ward_id, "status": {"$in": ["RESOLVED", "CLOSED"]}, "updated_at": {"$gte": today}})
        high_priority = await db.complaints.count_documents({"ward_id": ward_id, "priority": {"$in": ["HIGH", "CRITICAL"]}, "status": {"$nin": ["RESOLVED", "CLOSED", "REJECTED"]}})
        
        # Get a few recent complaints needing action
        recent = await db.complaints.find(
            {"ward_id": ward_id, "status": {"$nin": ["RESOLVED", "CLOSED", "REJECTED"]}}
        ).sort("created_at", -1).limit(5).to_list(length=5)
        
        recent_formatted = []
        for c in recent:
            recent_formatted.append({
                "_id": str(c["_id"]),
                "complaint_id": c.get("complaint_id"),
                "title": c.get("title", c.get("complaint_type", "")),
                "status": c.get("status"),
                "priority": c.get("priority", "MEDIUM"),
                "created_at": c.get("created_at").isoformat() if c.get("created_at") else None
            })
            
        return ResponseHandler.success(
            message="Dashboard stats retrieved",
            data={
                "assigned_count": assigned_count,
                "pending_inspections": pending_inspections,
                "in_progress_count": in_progress,
                "completed_today": completed_today,
                "high_priority_count": high_priority,
                "recent_complaints": recent_formatted
            }
        )
    except Exception as e:
        logger.error(f"Error fetching inspector dashboard: {str(e)}")
        return ResponseHandler.error(
            message="Failed to retrieve dashboard stats",
            errors=str(e),
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )



@router.get(
    "/complaints",
    summary="Get ward complaints",
    dependencies=[Depends(require_role("INSPECTOR", "SUPER_ADMIN", "DISTRICT_ADMIN"))]
)
async def get_ward_complaints(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    status_filter: str = Query(None, alias="status", description="Comma-separated statuses"),
    priority: str = Query(None),
    search_query: str = Query(None),
    district_id: str = Query(None),
    ward_id: str = Query(None),
    district: str = Query(None),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Get complaints with optional district filter"""
    try:
        query = {}
        
        # Apply district filter
        if district and district.strip() and district != "all" and district != "All Districts":
            if "$and" not in query:
                query["$and"] = []
            query["$and"].append({
                "$or": [
                    {"district": district},
                    {"district_name": district},
                    {"districtName": district}
                ]
            })
        elif district_id:
            # For backward compatibility / other callers
            try:
                query["district_id"] = ObjectId(district_id)
            except Exception:
                district_doc = await db.districts.find_one({"name": district_id})
                if district_doc:
                    query["district_id"] = district_doc["_id"]

        if status_filter:
            statuses = [s.strip() for s in status_filter.split(',')]
            query["status"] = {"$in": statuses}
            
        if priority:
            query["priority"] = priority
            
        if search_query:
            if "$and" not in query:
                query["$and"] = []
            query["$and"].append({
                "$or": [
                    {"complaint_id": {"$regex": search_query, "$options": "i"}},
                    {"complaintId": {"$regex": search_query, "$options": "i"}},
                    {"title": {"$regex": search_query, "$options": "i"}},
                    {"complaint_type": {"$regex": search_query, "$options": "i"}},
                    {"complaintType": {"$regex": search_query, "$options": "i"}},
                    {"citizenName": {"$regex": search_query, "$options": "i"}},
                    {"citizen_name": {"$regex": search_query, "$options": "i"}},
                    {"district": {"$regex": search_query, "$options": "i"}},
                    {"district_name": {"$regex": search_query, "$options": "i"}},
                    {"ward": {"$regex": search_query, "$options": "i"}},
                    {"ward_name": {"$regex": search_query, "$options": "i"}},
                    {"address": {"$regex": search_query, "$options": "i"}},
                ]
            })

        skip = (page - 1) * limit
        logger.info(f"[complaints] MongoDB query: {query}, skip={skip}, limit={limit}")
        complaints = await db.complaints.find(query)\
            .sort("created_at", -1)\
            .skip(skip)\
            .limit(limit)\
            .to_list(length=limit)

        total = await db.complaints.count_documents(query)
        logger.info(f"[complaints] Returned {len(complaints)} complaints, total matching: {total}")

        # Collect unique user_ids and ward_ids to batch query them
        user_ids = list(set(c.get("user_id") for c in complaints if c.get("user_id")))
        ward_ids = list(set(c.get("ward_id") for c in complaints if c.get("ward_id")))
        
        users_map = {}
        if user_ids:
            users = await db.users.find({"_id": {"$in": user_ids}}).to_list(length=len(user_ids))
            users_map = {str(u["_id"]): u for u in users}
            
        wards_map = {}
        if ward_ids:
            wards = await db.wards.find({"_id": {"$in": ward_ids}}).to_list(length=len(ward_ids))
            wards_map = {str(w["_id"]): w for w in wards}

        result = []
        for complaint in complaints:
            citizen_id_str = str(complaint.get("user_id")) if complaint.get("user_id") else None
            ward_id_str = str(complaint.get("ward_id")) if complaint.get("ward_id") else None
            district_id_str = str(complaint.get("district_id")) if complaint.get("district_id") else None
            
            citizen_data = users_map.get(citizen_id_str) if citizen_id_str else None
            ward_data = wards_map.get(ward_id_str) if ward_id_str else None
            
            # Resolve district and ward names if not stored
            d_name = complaint.get("district") or complaint.get("district_name") or complaint.get("districtName")
            w_name = complaint.get("ward") or complaint.get("ward_name") or complaint.get("wardName")
            
            if not w_name and ward_id_str and ward_id_str in wards_map:
                w_name = wards_map[ward_id_str].get("ward_name")
                if not district_id_str:
                    district_id_str = str(wards_map[ward_id_str].get("district_id"))
                    
            if not d_name and district_id_str:
                dist_doc = await db.districts.find_one({"_id": ObjectId(district_id_str) if len(district_id_str) == 24 else district_id_str})
                if dist_doc:
                    d_name = dist_doc.get("name")
                    
            d_name = d_name or "Not Available"
            w_name = w_name or "Not Available"
            
            # Resolve citizen fields
            citizen_name = complaint.get("citizenName") or complaint.get("citizen_name")
            if not citizen_name and citizen_data:
                citizen_name = citizen_data.get("name")
            citizen_name = citizen_name or "Not Available"
            
            citizen_email = complaint.get("citizenEmail") or complaint.get("citizen_email")
            if not citizen_email and citizen_data:
                citizen_email = citizen_data.get("email")
            citizen_email = citizen_email or "Not Available"
            
            citizen_phone = complaint.get("citizenPhone") or complaint.get("citizen_phone")
            if not citizen_phone and citizen_data:
                citizen_phone = citizen_data.get("mobile_number")
            citizen_phone = citizen_phone or "Not Available"
            
            result.append({
                "_id": str(complaint["_id"]),
                "complaint_id": complaint.get("complaint_id"),
                "complaintId": complaint.get("complaint_id") or "Not Available",
                "title": complaint.get("title", complaint.get("complaint_type", "")),
                "complaint_type": complaint.get("complaint_type") or "Not Available",
                "complaintType": complaint.get("complaint_type") or "Not Available",
                "issueType": complaint.get("complaint_type") or "Not Available",
                "description": complaint.get("description") or "Not Available",
                "complaintDescription": complaint.get("description") or "Not Available",
                "status": complaint.get("status") or "Not Available",
                "priority": complaint.get("priority", "MEDIUM") or "Not Available",
                "address": complaint.get("address") or "Not Available",
                "landmark": complaint.get("landmark") or "Not Available",
                "latitude": complaint.get("latitude"),
                "longitude": complaint.get("longitude"),
                "created_at": complaint.get("created_at").isoformat() if complaint.get("created_at") else None,
                "createdAt": complaint.get("created_at").isoformat() if complaint.get("created_at") else None,
                "updated_at": complaint.get("updated_at").isoformat() if complaint.get("updated_at") else None,
                "updatedAt": complaint.get("updated_at").isoformat() if complaint.get("updated_at") else None,
                "districtId": district_id_str or "Not Available",
                "district_id": district_id_str or "Not Available",
                "districtName": d_name,
                "district_name": d_name,
                "district": d_name,
                "wardId": ward_id_str or "Not Available",
                "ward_id": ward_id_str or "Not Available",
                "wardName": w_name,
                "ward_name": w_name,
                "ward": w_name,
                "citizenId": citizen_id_str or "Not Available",
                "citizenName": citizen_name,
                "citizenEmail": citizen_email,
                "citizenPhone": citizen_phone,
                "images": complaint.get("images") or complaint.get("image_urls") or [],
                "citizen": {
                    "name": citizen_name
                },
                "ward_info": {
                    "ward_name": w_name,
                    "ward_number": ward_data.get("ward_number") if ward_data else None
                } if ward_data else None
            })

        # Calculate statistics based on filtered ward/district
        stats_query = {}
        if district and district.strip() and district != "all" and district != "All Districts":
            stats_query["$or"] = [
                {"district": district},
                {"district_name": district},
                {"districtName": district}
            ]
        elif district_id:
            stats_query["district_id"] = query.get("district_id")

        total_count = await db.complaints.count_documents(stats_query)
        pending_count = await db.complaints.count_documents({**stats_query, "status": {"$in": ["PENDING", "OPEN"]}})
        in_progress_count = await db.complaints.count_documents({**stats_query, "status": {"$in": ["IN_PROGRESS", "WORKING", "ACCEPTED", "FIELD_VISIT", "APPROVAL"]}})
        resolved_count = await db.complaints.count_documents({**stats_query, "status": {"$in": ["RESOLVED", "CLOSED"]}})
        rejected_count = await db.complaints.count_documents({**stats_query, "status": "REJECTED"})

        stats_data = {
            "total": total_count,
            "pending": pending_count,
            "in_progress": in_progress_count,
            "resolved": resolved_count,
            "rejected": rejected_count
        }

        return ResponseHandler.success(
            message="Complaints retrieved",
            data={
                "complaints": result,
                "page": page,
                "limit": limit,
                "total": total,
                "pages": (total + limit - 1) // limit,
                "stats": stats_data
            }
        )
    except Exception as e:
        logger.error(f"Error fetching ward complaints: {str(e)}")
        return ResponseHandler.error(
            message="Failed to retrieve complaints",
            errors=str(e),
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@router.get(
    "/workers",
    summary="Get ward workers",
    dependencies=[Depends(require_role("INSPECTOR"))]
)
async def get_ward_workers(
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Get workers assigned to inspector's ward"""
    try:
        # Get inspector's ward
        inspector = await db.users.find_one({"_id": ObjectId(current_user["user_id"])})

        if not inspector or not inspector.get("ward_id"):
            return ResponseHandler.error(
                message="Inspector not assigned to any ward",
                status_code=status.HTTP_400_BAD_REQUEST
            )

        workers = await db.users.find({
            "ward_id": ObjectId(inspector["ward_id"]),
            "role": "WORKER"
        }).to_list(length=1000)

        result = []
        for worker in workers:
            # Count active complaints for this worker
            active_tasks = await db.complaints.count_documents({
                "assigned_to": ObjectId(worker["_id"]),
                "status": {"$in": ["PENDING", "IN_PROGRESS"]}
            })

            result.append({
                "_id": str(worker["_id"]),
                "name": worker.get("name"),
                "email": worker.get("email"),
                "active_tasks": active_tasks,
                "status": worker.get("status", "ACTIVE")
            })

        return ResponseHandler.success(
            message="Workers retrieved",
            data=result
        )
    except Exception as e:
        logger.error(f"Error fetching ward workers: {str(e)}")
        return ResponseHandler.error(
            message="Failed to retrieve workers",
            errors=str(e),
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@router.put(
    "/complaints/{complaint_id}/start-work",
    summary="Start work on a complaint",
    dependencies=[Depends(require_role("INSPECTOR"))]
)
async def start_work(
    complaint_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Move complaint from OPEN to IN_PROGRESS and auto-assign a random worker"""
    try:
        complaint = await _find_complaint_by_identifier(complaint_id)
        if not complaint:
            return ResponseHandler.error(
                message="Complaint not found",
                status_code=status.HTTP_404_NOT_FOUND
            )

        if complaint.get("status") != "OPEN":
            return ResponseHandler.error(
                message="Only OPEN complaints can be started",
                status_code=status.HTTP_400_BAD_REQUEST
            )

        # Find the inspector's ward
        ward = await db.wards.find_one({
            "inspector_id": ObjectId(current_user["user_id"]),
            "is_active": True
        })

        # Randomly assign a worker from the ward if any exist
        assigned_worker_id = None
        if ward:
            workers = await db.users.find({
                "ward_id": ward["_id"],
                "role": "WORKER"
            }).to_list(length=1000)
            if workers:
                selected = random.choice(workers)
                assigned_worker_id = selected["_id"]

        old_status = complaint.get("status")
        new_status = "IN_PROGRESS"
        update_fields: Dict[str, Any] = {
            "status": new_status,
            "updated_at": datetime.utcnow()
        }
        if assigned_worker_id:
            update_fields["worker_id"] = assigned_worker_id

        logger.info(f"STATUS CHANGE BEFORE - Complaint ID: {complaint_id}, Old Status: {old_status}, New Status: {new_status}")
        await db.complaints.update_one(
            {"_id": complaint.get("_id")},
            {"$set": update_fields}
        )
        logger.info(f"STATUS CHANGE AFTER - Complaint ID: {complaint_id}, Old Status: {old_status}, New Status: {new_status}")

        await db.complaint_history.insert_one({
            "complaint_id": complaint.get("_id"),
            "action": "STATUS_CHANGED",
            "old_status": "OPEN",
            "new_status": "IN_PROGRESS",
            "performed_by": ObjectId(current_user["user_id"]),
            "role": "INSPECTOR",
            "remarks": "Work started by inspector",
            "timestamp": datetime.utcnow()
        })
        
        # Trigger email notification asynchronously
        try:
            from app.services.email_service import EmailService
            logger.info("Calling the email service.")
            EmailService.send_complaint_notification_background(complaint.get("_id"), "WORK_STARTED")
        except Exception as email_err:
            logger.error(f"Failed to trigger WORK_STARTED email notification: {str(email_err)}")

        return ResponseHandler.success(
            message="Complaint moved to IN_PROGRESS",
            data={"complaint_id": complaint_id, "status": "IN_PROGRESS"}
        )
    except Exception as e:
        logger.error(f"Error starting work on complaint: {str(e)}")
        return ResponseHandler.error(
            message="Failed to start work",
            errors=str(e),
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@router.put(
    "/complaints/{complaint_id}/reject",
    summary="Reject a complaint",
    dependencies=[Depends(require_role("INSPECTOR"))]
)
async def reject_complaint_simplified(
    complaint_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Move complaint from OPEN to REJECTED"""
    try:
        complaint = await _find_complaint_by_identifier(complaint_id)
        if not complaint:
            return ResponseHandler.error(
                message="Complaint not found",
                status_code=status.HTTP_404_NOT_FOUND
            )

        if complaint.get("status") != "OPEN":
            return ResponseHandler.error(
                message="Only OPEN complaints can be rejected here",
                status_code=status.HTTP_400_BAD_REQUEST
            )

        old_status = complaint.get("status")
        new_status = "REJECTED"
        logger.info(f"STATUS CHANGE BEFORE - Complaint ID: {complaint_id}, Old Status: {old_status}, New Status: {new_status}")
        await db.complaints.update_one(
            {"_id": complaint.get("_id")},
            {"$set": {"status": new_status, "updated_at": datetime.utcnow()}}
        )
        logger.info(f"STATUS CHANGE AFTER - Complaint ID: {complaint_id}, Old Status: {old_status}, New Status: {new_status}")

        await db.complaint_history.insert_one({
            "complaint_id": complaint.get("_id"),
            "action": "REJECTED",
            "old_status": "OPEN",
            "new_status": "REJECTED",
            "performed_by": ObjectId(current_user["user_id"]),
            "role": "INSPECTOR",
            "remarks": "Complaint rejected by inspector after physical inspection",
            "timestamp": datetime.utcnow()
        })
        
        # Trigger email notification asynchronously
        try:
            from app.services.email_service import EmailService
            logger.info("Calling the email service.")
            EmailService.send_complaint_notification_background(
                complaint.get("_id"),
                "REJECTED",
                reject_reason="Complaint rejected by inspector after physical inspection"
            )
        except Exception as email_err:
            logger.error(f"Failed to trigger REJECTED email notification: {str(email_err)}")

        return ResponseHandler.success(
            message="Complaint rejected successfully",
            data={"complaint_id": complaint_id, "status": "REJECTED"}
        )
    except Exception as e:
        logger.error(f"Error rejecting complaint: {str(e)}")
        return ResponseHandler.error(
            message="Failed to reject complaint",
            errors=str(e),
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


from pydantic import BaseModel
from typing import List, Optional

@router.put(
    "/complaints/{complaint_id}/resolve",
    summary="Resolve a complaint",
    dependencies=[Depends(require_role("INSPECTOR"))]
)
async def resolve_complaint(
    complaint_id: str,
    note: Optional[str] = Form(None),
    images: List[UploadFile] = File(default=[]),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Move complaint to RESOLVED with proof images"""
    try:
        complaint = await _find_complaint_by_identifier(complaint_id)
        if not complaint:
            return ResponseHandler.error(
                message="Complaint not found",
                status_code=status.HTTP_404_NOT_FOUND
            )

        if not images or len(images) == 0:
            return ResponseHandler.error(
                message="Resolution proof images are required",
                status_code=status.HTTP_400_BAD_REQUEST
            )

        user_id = str(current_user["user_id"])
        image_urls = []
        upload_dir = os.path.join("uploads", user_id, "images")
        os.makedirs(upload_dir, exist_ok=True)
        
        for file in images:
            if not file.filename:
                continue
            file_uuid = uuid.uuid4().hex[:8]
            new_filename = f"resolve_{file_uuid}.jpg"
            file_path = os.path.join(upload_dir, new_filename)
            
            content_bytes = await file.read()
            async with aiofiles.open(file_path, 'wb') as out_file:
                await out_file.write(content_bytes)
            image_urls.append(f"{user_id}/images/{new_filename}")

        if len(image_urls) == 0:
            return ResponseHandler.error(
                message="Valid resolution proof images are required",
                status_code=status.HTTP_400_BAD_REQUEST
            )

        old_status = complaint.get("status")
        new_status = "RESOLVED"
        logger.info(f"STATUS CHANGE BEFORE - Complaint ID: {complaint_id}, Old Status: {old_status}, New Status: {new_status}")
        await db.complaints.update_one(
            {"_id": complaint.get("_id")},
            {"$set": {
                "status": new_status,
                "proof_images": image_urls,
                "closed_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }}
        )
        logger.info(f"STATUS CHANGE AFTER - Complaint ID: {complaint_id}, Old Status: {old_status}, New Status: {new_status}")

        await db.complaint_history.insert_one({
            "complaint_id": complaint.get("_id"),
            "action": "STATUS_CHANGED",
            "old_status": complaint.get("status"),
            "new_status": "RESOLVED",
            "performed_by": ObjectId(current_user["user_id"]),
            "role": "INSPECTOR",
            "remarks": note or "Issue verified and resolved by inspector",
            "timestamp": datetime.utcnow()
        })
        
        # Trigger email notification asynchronously
        try:
            from app.services.email_service import EmailService
            logger.info("Calling the email service.")
            EmailService.send_complaint_notification_background(complaint.get("_id"), "RESOLVED")
        except Exception as email_err:
            logger.error(f"Failed to trigger RESOLVED email notification: {str(email_err)}")

        return ResponseHandler.success(
            message="Complaint resolved successfully",
            data={"complaint_id": complaint_id, "status": "RESOLVED"}
        )
    except Exception as e:
        logger.error(f"Error resolving complaint: {str(e)}")
        return ResponseHandler.error(
            message="Failed to resolve complaint",
            errors=str(e),
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

class StatusUpdateRequest(BaseModel):
    status: str
    note: Optional[str] = None

@router.put(
    "/complaints/{complaint_id}/status",
    summary="Update complaint status",
    dependencies=[Depends(require_role("INSPECTOR"))]
)
async def update_complaint_status(
    complaint_id: str,
    payload: StatusUpdateRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Unified endpoint to update complaint status"""
    try:
        complaint = await _find_complaint_by_identifier(complaint_id)
        if not complaint:
            return ResponseHandler.error(
                message="Complaint not found",
                status_code=status.HTTP_404_NOT_FOUND
            )

        new_status = payload.status
        old_status = complaint.get("status")

        if new_status not in ["ASSIGNED", "ACCEPTED", "IN_PROGRESS", "FIELD_VISIT", "RESOLVED", "REJECTED"]:
            return ResponseHandler.error(
                message=f"Invalid status transition to {new_status}",
                status_code=status.HTTP_400_BAD_REQUEST
            )

        logger.info(f"STATUS CHANGE BEFORE - Complaint ID: {complaint_id}, Old Status: {old_status}, New Status: {new_status}")
        await db.complaints.update_one(
            {"_id": complaint.get("_id")},
            {"$set": {
                "status": new_status,
                "updated_at": datetime.utcnow()
            }}
        )
        logger.info(f"STATUS CHANGE AFTER - Complaint ID: {complaint_id}, Old Status: {old_status}, New Status: {new_status}")

        await db.complaint_history.insert_one({
            "complaint_id": complaint.get("_id"),
            "action": "STATUS_CHANGED",
            "old_status": old_status,
            "new_status": new_status,
            "performed_by": ObjectId(current_user["user_id"]),
            "role": "INSPECTOR",
            "remarks": payload.note or f"Status updated to {new_status}",
            "timestamp": datetime.utcnow()
        })
        
        # Trigger email notification asynchronously based on new_status
        try:
            from app.services.email_service import EmailService
            if new_status == "ASSIGNED":
                logger.info("Calling the email service.")
                EmailService.send_complaint_notification_background(complaint.get("_id"), "ASSIGNED")
            elif new_status in ["IN_PROGRESS", "ACCEPTED"]:
                logger.info("Calling the email service.")
                EmailService.send_complaint_notification_background(complaint.get("_id"), "WORK_STARTED")
            elif new_status == "RESOLVED":
                logger.info("Calling the email service.")
                EmailService.send_complaint_notification_background(complaint.get("_id"), "RESOLVED")
            elif new_status == "REJECTED":
                logger.info("Calling the email service.")
                EmailService.send_complaint_notification_background(
                    complaint.get("_id"),
                    "REJECTED",
                    reject_reason=payload.note or "Complaint rejected by inspector"
                )
        except Exception as email_err:
            logger.error(f"Failed to trigger status update email notification: {str(email_err)}")

        return ResponseHandler.success(
            message=f"Complaint status updated to {new_status}",
            data={"complaint_id": complaint_id, "status": new_status}
        )
    except Exception as e:
        logger.error(f"Error updating complaint status: {str(e)}")
        return ResponseHandler.error(
            message="Failed to update complaint status",
            errors=str(e),
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

class NoteRequest(BaseModel):
    note: str

@router.post(
    "/complaints/{complaint_id}/notes",
    summary="Add an inspector note",
    dependencies=[Depends(require_role("INSPECTOR"))]
)
async def add_inspector_note(
    complaint_id: str,
    payload: NoteRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Add a note to a complaint"""
    try:
        complaint = await _find_complaint_by_identifier(complaint_id)
        if not complaint:
            return ResponseHandler.error(
                message="Complaint not found",
                status_code=status.HTTP_404_NOT_FOUND
            )

        new_note = {
            "id": str(ObjectId()),
            "text": payload.note,
            "inspector_id": str(current_user["user_id"]),
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }

        await db.complaints.update_one(
            {"_id": complaint.get("_id")},
            {"$push": {"inspector_notes": new_note}, "$set": {"updated_at": datetime.utcnow()}}
        )

        await db.complaint_history.insert_one({
            "complaint_id": complaint.get("_id"),
            "action": "NOTE_ADDED",
            "performed_by": ObjectId(current_user["user_id"]),
            "role": "INSPECTOR",
            "remarks": "Added inspection note",
            "timestamp": datetime.utcnow()
        })

        return ResponseHandler.success(
            message="Note added successfully",
            data={"note": new_note}
        )
    except Exception as e:
        logger.error(f"Error adding note: {str(e)}")
        return ResponseHandler.error(
            message="Failed to add note",
            errors=str(e),
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

class ChecklistRequest(BaseModel):
    checklist: Dict[str, bool]

@router.put(
    "/complaints/{complaint_id}/checklist",
    summary="Update field checklist",
    dependencies=[Depends(require_role("INSPECTOR"))]
)
async def update_checklist(
    complaint_id: str,
    payload: ChecklistRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Update field visit checklist"""
    try:
        complaint = await _find_complaint_by_identifier(complaint_id)
        if not complaint:
            return ResponseHandler.error(
                message="Complaint not found",
                status_code=status.HTTP_404_NOT_FOUND
            )

        await db.complaints.update_one(
            {"_id": complaint.get("_id")},
            {"$set": {"field_checklist": payload.checklist, "updated_at": datetime.utcnow()}}
        )

        return ResponseHandler.success(
            message="Checklist updated successfully",
            data={"checklist": payload.checklist}
        )
    except Exception as e:
        logger.error(f"Error updating checklist: {str(e)}")
        return ResponseHandler.error(
            message="Failed to update checklist",
            errors=str(e),
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

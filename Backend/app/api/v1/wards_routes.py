"""Ward management routes"""
from fastapi import APIRouter, Depends, status, HTTPException, Query
from bson import ObjectId
import logging
from typing import Dict, Any

from app.core.response import SuccessResponse, ErrorResponse, ResponseHandler
from app.dependencies.auth_dependency import get_current_user
from app.core.exceptions import CivifixException
from app.schemas.complaint_schema import (
    WardCreateSchema, WardUpdateSchema, WardResponseSchema
)
from app.services.ward_service import WardService
from app.repositories.ward_repository import WardRepository
from app.repositories.user_repository import UserRepository
from app.repositories.district_repository import DistrictRepository
from app.db.mongodb import get_database, db
from app.dependencies.role_dependency import require_role

logger = logging.getLogger(__name__)

router = APIRouter()


def get_ward_service(db=Depends(get_database)):
    """Dependency for ward service"""
    ward_repo = WardRepository(db)
    district_repo = DistrictRepository
    # UserRepository uses classmethods and does not require instantiation
    user_repo = UserRepository
    return WardService(ward_repo, user_repo, district_repo)


@router.get(
    "",
    response_model=dict,
    summary="List All Wards (Inspector)",
    tags=["Ward Management"]
)
async def list_all_wards(
    page: int = Query(1, ge=1),
    limit: int = Query(100, ge=1, le=200),
    is_active: bool = Query(None),
    district_id: str = Query(None, description="District name or ObjectId; defaults to inspector's district from token"),
    current_user: dict = Depends(get_current_user),
):
    """
    Return all wards.
    If district_id query param is provided, filter by that district.
    Otherwise use the district from the JWT token (user.district).
    No inspector_id filtering is applied.
    """
    try:
        # Determine district filter value
        district_filter = district_id or current_user.get("district")
        logger.info(f"[wards] Listing wards for district='{district_filter}', page={page}, limit={limit}")

        # Resolve district name -> ObjectId
        resolved_district_id = None
        if district_filter:
            try:
                resolved_district_id = ObjectId(district_filter)
                logger.info(f"[wards] District resolved as ObjectId: {resolved_district_id}")
            except Exception:
                from app.db.mongodb import db as motor_db
                district_doc = await motor_db.districts.find_one({"name": district_filter})
                if district_doc:
                    resolved_district_id = district_doc["_id"]
                    logger.info(f"[wards] District name '{district_filter}' resolved to ObjectId: {resolved_district_id}")
                else:
                    logger.warning(f"[wards] District '{district_filter}' not found in DB")

        query = {}
        if resolved_district_id:
            query["district_id"] = resolved_district_id
        if is_active is not None:
            query["is_active"] = is_active

        from app.db.mongodb import db as motor_db
        use_collation = False
        if resolved_district_id:
            district_doc = await motor_db.districts.find_one({"_id": resolved_district_id})
            if district_doc and district_doc.get("name") in ("Thiruvallur", "Chengalpattu", "Ranipet", "Vellore", "Thiruvannamalai", "Villupuram", "Tirupattur", "Krishnagiri", "Dharmapuri", "Kallakurichi", "Cuddalore", "Salem", "Namakkal", "Karur", "Erode", "Dindigul", "Tiruppur", "Coimbatore", "Madurai", "Sivagangai", "Virudhunagar", "Tenkasi", "Thoothukudi", "Tirunelveli", "Ramanathapuram", "Perambalur", "Ariyalur", "Mayiladuthurai", "Tiruchirappalli", "Thanjavur", "Thiruvarur", "Nagapattinam", "Pudukkottai", "Theni", "Chennai", "The Nilgiris"):
                use_collation = True

        skip = (page - 1) * limit
        total = await motor_db.wards.count_documents(query)
        cursor = motor_db.wards.find(query).sort("ward_number", 1).skip(skip).limit(limit)
        if use_collation:
            cursor = cursor.collation({"locale": "en", "numericOrdering": True})
        wards = await cursor.to_list(length=limit)

        logger.info(f"[wards] Query: {query} -> returned {len(wards)} wards (total: {total})")

        result = []
        for w in wards:
            result.append({
                "_id": str(w["_id"]),
                "ward_name": w.get("ward_name"),
                "ward_number": w.get("ward_number"),
                "district_id": str(w.get("district_id", "")),
                "label": w.get("label") or f"{w.get('ward_number', '')} - {w.get('ward_name', '')}",
                "is_active": w.get("is_active", True),
            })

        return {
            "success": True,
            "message": "Wards fetched successfully",
            "data": {
                "data": result,
                "total": total,
                "page": page,
                "limit": limit,
                "pages": (total + limit - 1) // limit,
            }
        }
    except Exception as e:
        logger.error(f"[wards] Error listing wards: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to list wards: {str(e)}")


@router.post(
    "",
    response_model=dict,
    status_code=status.HTTP_201_CREATED,
    summary="Create Ward",
    tags=["Ward Management"]
)
async def create_ward(
    ward_data: WardCreateSchema,
    current_user: dict = Depends(get_current_user),
    role_validated: bool = Depends(require_role(["DISTRICT_ADMIN"])), # pyright: ignore[reportArgumentType]
    service: WardService = Depends(get_ward_service)
):
    """Create a new ward (DISTRICT_ADMIN only)"""
    try:
        result = await service.create_ward(ward_data, current_user["user_id"])
        return SuccessResponse.create(
            data=result,
            message="Ward created successfully",
            status_code=status.HTTP_201_CREATED
        )
    except CivifixException as e:
        logger.error(f"Ward creation error: {str(e)}")
        raise HTTPException(status_code=e.status_code, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.put(
    "/{ward_id}",
    response_model=dict,
    summary="Update Ward",
    tags=["Ward Management"]
)
async def update_ward(
    ward_id: str,
    ward_data: WardUpdateSchema,
    current_user: dict = Depends(get_current_user),
    role_validated: bool = Depends(require_role(["DISTRICT_ADMIN"])),
    service: WardService = Depends(get_ward_service)
):
    """Update ward details (DISTRICT_ADMIN only)"""
    try:
        result = await service.update_ward(ward_id, ward_data)
        return SuccessResponse.create(
            data=result,
            message="Ward updated successfully"
        )
    except CivifixException as e:
        logger.error(f"Ward update error: {str(e)}")
        raise HTTPException(status_code=e.status_code, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get(
    "/{ward_id}",
    response_model=dict,
    summary="Get Ward Details",
    tags=["Ward Management"]
)
async def get_ward(
    ward_id: str,
    current_user: dict = Depends(get_current_user),
    service: WardService = Depends(get_ward_service)
):
    """Get ward details"""
    try:
        result = await service.get_ward(ward_id)
        return SuccessResponse.create(
            data=result,
            message="Ward fetched successfully"
        )
    except CivifixException as e:
        logger.error(f"Ward fetch error: {str(e)}")
        raise HTTPException(status_code=e.status_code, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get(
    "/district/{district_id}",
    response_model=dict,
    summary="List Wards by District",
    tags=["Ward Management"]
)
async def list_wards(
    district_id: str,
    page: int = 1,
    limit: int = 10,
    is_active: bool = None,
    service: WardService = Depends(get_ward_service)
):
    """List wards in a district with pagination"""
    try:
        result = await service.list_wards(
            district_id,
            page=page,
            limit=limit,
            is_active=is_active
        )
        return SuccessResponse.create(
            data=result,
            message="Wards fetched successfully"
        )
    except CivifixException as e:
        logger.error(f"Ward listing error: {str(e)}")
        raise HTTPException(status_code=e.status_code, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get(
    "/inspector/{inspector_id}",
    response_model=dict,
    summary="List Inspector Wards",
    tags=["Ward Management"]
)
async def list_inspector_wards(
    inspector_id: str,
    page: int = 1,
    limit: int = 10,
    current_user: dict = Depends(get_current_user),
    service: WardService = Depends(get_ward_service)
):
    """List wards assigned to an inspector"""
    try:
        result = await service.list_inspector_wards(
            inspector_id,
            page=page,
            limit=limit
        )
        return SuccessResponse.create(
            data=result,
            message="Inspector wards fetched successfully"
        )
    except CivifixException as e:
        logger.error(f"Ward listing error: {str(e)}")
        raise HTTPException(status_code=e.status_code, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get(
    "/search/{district_id}",
    response_model=dict,
    summary="Search Wards",
    tags=["Ward Management"]
)
async def search_wards(
    district_id: str,
    q: str,
    page: int = 1,
    limit: int = 10,
    current_user: dict = Depends(get_current_user),
    service: WardService = Depends(get_ward_service)
):
    """Search wards by name or number"""
    try:
        result = await service.search_wards(
            district_id,
            q,
            page=page,
            limit=limit
        )
        return SuccessResponse.create(
            data=result,
            message="Search results fetched successfully"
        )
    except CivifixException as e:
        logger.error(f"Ward search error: {str(e)}")
        raise HTTPException(status_code=e.status_code, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.put(
    "/{ward_id}/deactivate",
    response_model=dict,
    summary="Deactivate Ward",
    tags=["Ward Management"]
)
async def deactivate_ward(
    ward_id: str,
    current_user: dict = Depends(get_current_user),
    role_validated: bool = Depends(require_role(["DISTRICT_ADMIN"])),
    service: WardService = Depends(get_ward_service)
):
    """Deactivate a ward (DISTRICT_ADMIN only)"""
    try:
        result = await service.deactivate_ward(ward_id)
        return SuccessResponse.create(
            data=result,
            message="Ward deactivated successfully"
        )
    except CivifixException as e:
        logger.error(f"Ward deactivation error: {str(e)}")
        raise HTTPException(status_code=e.status_code, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get(
    "/inspector/assigned",
    response_model=dict,
    summary="Get Inspector's Assigned Ward",
    dependencies=[Depends(require_role("INSPECTOR"))]
)
async def get_inspector_assigned_ward(
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Get the ward assigned to the current inspector"""
    try:
        inspector_id = ObjectId(current_user["user_id"])

        ward = await db.wards.find_one({"inspector_id": inspector_id, "is_active": True})

        if not ward:
            return ResponseHandler.error(
                message="No ward assigned to this inspector",
                status_code=status.HTTP_404_NOT_FOUND
            )

        # Format ward response
        ward_response = {
            "_id": str(ward.get("_id")),
            "ward_id": str(ward.get("_id")),
            "district_id": str(ward.get("district_id")),
            "ward_name": ward.get("ward_name"),
            "ward_number": ward.get("ward_number"),
            "inspector_id": str(ward.get("inspector_id")),
            "description": ward.get("description"),
            "complaint_count": ward.get("complaint_count", 0),
            "active_complaints": ward.get("active_complaints", 0),
            "closed_complaints": ward.get("closed_complaints", 0),
            "is_active": ward.get("is_active"),
            "created_at": ward.get("created_at").isoformat() if ward.get("created_at") else None
        }

        return ResponseHandler.success(
            message="Inspector ward fetched successfully",
            data=ward_response
        )
    except Exception as e:
        logger.error(f"Error fetching inspector ward: {str(e)}")
        return ResponseHandler.error(
            message="Failed to fetch inspector ward",
            errors=str(e),
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@router.post(
    "/{ward_id}/assign-inspector",
    response_model=dict,
    summary="Assign Inspector to Ward",
    dependencies=[Depends(require_role("DISTRICT_ADMIN"))]
)
async def assign_inspector_to_ward(
    ward_id: str,
    body: Dict[str, Any],
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Assign an inspector to a ward (DISTRICT_ADMIN only)"""
    try:
        inspector_id = body.get("inspector_id")

        if not inspector_id:
            return ResponseHandler.error(
                message="inspector_id is required",
                status_code=status.HTTP_400_BAD_REQUEST
            )

        # Validate ward exists
        ward = await db.wards.find_one({"_id": ObjectId(ward_id)})

        if not ward:
            return ResponseHandler.error(
                message="Ward not found",
                status_code=status.HTTP_404_NOT_FOUND
            )

        # Validate inspector exists and is in the same district
        inspector = await db.users.find_one({"_id": ObjectId(inspector_id), "role": "INSPECTOR"})

        if not inspector:
            return ResponseHandler.error(
                message="Inspector not found",
                status_code=status.HTTP_404_NOT_FOUND
            )

        # Check if district matches
        if str(inspector.get("district")) != str(ward.get("district_id")):
            return ResponseHandler.error(
                message="Inspector must belong to the same district",
                status_code=status.HTTP_400_BAD_REQUEST
            )

        # Update ward with inspector assignment
        result = await db.wards.update_one(
            {"_id": ObjectId(ward_id)},
            {"$set": {"inspector_id": ObjectId(inspector_id)}}
        )

        if result.modified_count == 0:
            return ResponseHandler.error(
                message="Failed to assign inspector to ward",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return ResponseHandler.success(
            message="Inspector assigned to ward successfully",
            data={
                "ward_id": ward_id,
                "inspector_id": inspector_id,
                "inspector_name": inspector.get("name")
            }
        )
    except Exception as e:
        logger.error(f"Error assigning inspector to ward: {str(e)}")
        return ResponseHandler.error(
            message="Failed to assign inspector to ward",
            errors=str(e),
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

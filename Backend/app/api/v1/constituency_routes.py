"""Assembly Constituency API routes"""
import re
from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Dict, Any
from bson import ObjectId

from app.db.mongodb import db

router = APIRouter()

@router.get(
    "/districts/{district_id}/constituencies",
    response_model=List[Dict[str, Any]],
    summary="Get constituencies for a district"
)
async def get_district_constituencies(district_id: str):
    """Retrieve all active constituencies for a district"""
    try:
        # Support both ObjectId and string matching
        query = {}
        if len(district_id) == 24:
            query["district_id"] = ObjectId(district_id)
        else:
            query["district_id"] = district_id

        cursor = db.constituencies.find(query)
        constituencies = await cursor.to_list(length=1000)
        
        result = []
        for c in constituencies:
            result.append({
                "id": str(c["_id"]),
                "name": c.get("name")
            })
            
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch constituencies: {str(e)}"
        )

@router.get(
    "/constituencies/{constituency_id}/wards",
    response_model=List[Dict[str, Any]],
    summary="Get wards for a constituency"
)
async def get_constituency_wards(constituency_id: str):
    """Retrieve all active wards for a constituency sorted by ward number"""
    try:
        query = {}
        if len(constituency_id) == 24:
            # We support both string and ObjectId match
            query["$or"] = [
                {"constituency_id": ObjectId(constituency_id)},
                {"constituency_id": constituency_id},
                {"assembly_constituency_id": ObjectId(constituency_id)},
                {"assembly_constituency_id": constituency_id}
            ]
        else:
            query["$or"] = [
                {"constituency_id": constituency_id},
                {"assembly_constituency_id": constituency_id}
            ]

        cursor = db.wards.find(query)
        wards = await cursor.to_list(length=1000)
        
        if not wards:
            # According to validation: "No wards found for this constituency."
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No wards found for this constituency."
            )

        # Sort wards naturally by ward_number
        def sort_key(w):
            wn = w.get("ward_number", 0)
            try:
                if isinstance(wn, int):
                    return wn
                digits = re.findall(r'\d+', str(wn))
                return int(digits[0]) if digits else 9999
            except Exception:
                return 9999

        wards.sort(key=sort_key)

        result = []
        for w in wards:
            # Format ward_name as: label or display_name or constructed display name
            ward_display_name = w.get("label") or w.get("display_name") or w.get("ward_name")
            
            # Support converting numeric ward_number to integer
            wn = w.get("ward_number")
            try:
                digits = re.findall(r'\d+', str(wn))
                ward_num = int(digits[0]) if digits else 0
            except Exception:
                ward_num = 0

            result.append({
                "id": str(w["_id"]),
                "ward_number": ward_num,
                "ward_name": ward_display_name
            })
            
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch constituency wards: {str(e)}"
        )

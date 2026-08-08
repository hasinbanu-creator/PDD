"""Ward repository for data access"""
from typing import Optional, List, Dict
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)


class WardRepository:
    """Repository for ward operations"""

    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.collection = db["wards"]

    async def create(self, ward_data: dict) -> str:
        """Create a new ward"""
        try:
            result = await self.collection.insert_one(ward_data)
            logger.info(f"Ward created: {result.inserted_id}")
            return str(result.inserted_id)
        except Exception as e:
            logger.error(f"Error creating ward: {str(e)}")
            raise

    async def get_by_id(self, ward_id: str) -> Optional[dict]:
        """Get ward by ID"""
        try:
            try:
                resolved_id = ObjectId(ward_id)
            except Exception:
                resolved_id = ward_id
            ward = await self.collection.find_one({"_id": resolved_id})
            return ward
        except Exception as e:
            logger.error(f"Error fetching ward: {str(e)}")
            return None

    async def get_by_ward_number(self, ward_number: str, district_id: str, local_body: Optional[str] = None) -> Optional[dict]:
        """Get ward by ward number in district and optional local body"""
        try:
            query = {
                "ward_number": ward_number,
                "district_id": ObjectId(district_id) if district_id and len(str(district_id)) == 24 else district_id
            }
            if local_body:
                query["local_body"] = local_body
            ward = await self.collection.find_one(query)
            return ward
        except Exception as e:
            logger.error(f"Error fetching ward by number: {str(e)}")
            return None

    async def update(self, ward_id: str, update_data: dict) -> bool:
        """Update ward"""
        try:
            update_data["updated_at"] = datetime.utcnow()
            result = await self.collection.update_one(
                {"_id": ObjectId(ward_id)},
                {"$set": update_data}
            )
            logger.info(f"Ward updated: {ward_id}, matched: {result.matched_count}")
            return result.matched_count > 0
        except Exception as e:
            logger.error(f"Error updating ward: {str(e)}")
            raise

    async def list_by_district(
        self,
        district_id: str,
        skip: int = 0,
        limit: int = 10,
        is_active: Optional[bool] = None
    ) -> tuple[List[dict], int]:
        """List wards by district with pagination"""
        try:
            try:
                resolved_id = ObjectId(district_id)
            except Exception:
                # Resolve by name
                district_doc = await self.db["districts"].find_one({"name": district_id})
                if district_doc:
                    resolved_id = district_doc["_id"]
                else:
                    resolved_id = None
            
            if not resolved_id:
                return [], 0

            query = {"district_id": resolved_id}
            
            if is_active is not None:
                query["is_active"] = is_active
            
            total = await self.collection.count_documents(query)
            
            # Sort by ward_number ascending if the district is Thiruvallur, Chengalpattu, Ranipet, Vellore, Thiruvannamalai, Villupuram, Tirupattur, Krishnagiri, Dharmapuri, Kallakurichi, Cuddalore, Salem, Namakkal, Karur, Erode, Dindigul, Tiruppur, Coimbatore, Madurai, Sivagangai, Virudhunagar, Tenkasi, Thoothukudi, Tirunelveli, Ramanathapuram, Perambalur, Ariyalur, Mayiladuthurai, Tiruchirappalli, Thanjavur, Thiruvarur, Nagapattinam, Pudukkottai, or Theni, otherwise by created_at descending
            sort_field = "created_at"
            sort_order = -1
            use_collation = False
            if resolved_id:
                district_doc = await self.db["districts"].find_one({"_id": resolved_id})
                if district_doc and district_doc.get("name") in ("Thiruvallur", "Chengalpattu", "Ranipet", "Vellore", "Thiruvannamalai", "Villupuram", "Tirupattur", "Krishnagiri", "Dharmapuri", "Kallakurichi", "Cuddalore", "Salem", "Namakkal", "Karur", "Erode", "Dindigul", "Tiruppur", "Coimbatore", "Madurai", "Sivagangai", "Virudhunagar", "Tenkasi", "Thoothukudi", "Tirunelveli", "Ramanathapuram", "Perambalur", "Ariyalur", "Mayiladuthurai", "Tiruchirappalli", "Thanjavur", "Thiruvarur", "Nagapattinam", "Pudukkottai", "Theni", "Chennai", "The Nilgiris"):
                    sort_field = "ward_number"
                    sort_order = 1
                    use_collation = True

            cursor = self.collection.find(query)\
                .skip(skip)\
                .limit(limit)\
                .sort(sort_field, sort_order)

            if use_collation:
                cursor = cursor.collation({"locale": "en", "numericOrdering": True})

            wards = await cursor.to_list(length=limit)
            
            return wards, total
        except Exception as e:
            logger.error(f"Error listing wards: {str(e)}")
            raise

    async def list_by_inspector(
        self,
        inspector_id: str,
        skip: int = 0,
        limit: int = 10
    ) -> tuple[List[dict], int]:
        """List wards assigned to inspector"""
        try:
            query = {"inspector_id": ObjectId(inspector_id) if inspector_id and len(str(inspector_id)) == 24 else inspector_id}
            total = await self.collection.count_documents(query)
            
            wards = await self.collection.find(query)\
                .skip(skip)\
                .limit(limit)\
                .sort("created_at", -1)\
                .to_list(length=limit)
            
            return wards, total
        except Exception as e:
            logger.error(f"Error listing inspector wards: {str(e)}")
            raise

    async def search(
        self,
        district_id: str,
        search_query: str,
        skip: int = 0,
        limit: int = 10
    ) -> tuple[List[dict], int]:
        """Search wards by name"""
        try:
            or_clauses = [
                {"ward_name": {"$regex": search_query, "$options": "i"}},
                {"zone": {"$regex": search_query, "$options": "i"}}
            ]
            if search_query.isdigit():
                stripped_query = str(int(search_query))
                or_clauses.extend([
                    {"ward_number": int(search_query)},
                    {"ward_number": search_query},
                    {"ward_number": stripped_query},
                    {"ward_number": {"$regex": f"^{search_query}$", "$options": "i"}},
                    {"ward_number": {"$regex": f"^{stripped_query}$", "$options": "i"}}
                ])
            else:
                or_clauses.append({"ward_number": {"$regex": search_query, "$options": "i"}})

            query = {
                "district_id": ObjectId(district_id) if district_id and len(str(district_id)) == 24 else district_id,
                "$or": or_clauses
            }
            
            total = await self.collection.count_documents(query)
            
            wards = await self.collection.find(query)\
                .skip(skip)\
                .limit(limit)\
                .to_list(length=limit)
            
            return wards, total
        except Exception as e:
            logger.error(f"Error searching wards: {str(e)}")
            raise

    async def update_complaint_counts(self, ward_id: str, status_change: dict) -> bool:
        """Update complaint counts in ward"""
        try:
            update_data = {}
            
            if status_change.get("increment_total"):
                update_data["$inc"] = {"complaint_count": 1}
            
            if status_change.get("new_status") in ["CLOSED", "RESOLVED"]:
                if "$inc" not in update_data:
                    update_data["$inc"] = {}
                update_data["$inc"]["closed_complaints"] = 1
                update_data["$inc"]["active_complaints"] = -1
            elif status_change.get("new_status") in ["OPEN", "REOPENED"]:
                if "$inc" not in update_data:
                    update_data["$inc"] = {}
                update_data["$inc"]["active_complaints"] = 1
                if status_change.get("old_status") in ["CLOSED", "RESOLVED"]:
                    update_data["$inc"]["closed_complaints"] = -1
            
            if not update_data:
                return True

            resolved_id = ObjectId(ward_id) if ward_id and len(str(ward_id)) == 24 else ward_id
            result = await self.collection.update_one(
                {"_id": resolved_id},
                update_data
            )
            
            return result.matched_count > 0
        except Exception as e:
            logger.error(f"Error updating ward counts: {str(e)}")
            return False

    async def is_active(self, ward_id: str) -> bool:
        """Check if ward is active"""
        try:
            ward = await self.get_by_id(ward_id)
            return ward and ward.get("is_active", False)
        except Exception as e:
            logger.error(f"Error checking ward status: {str(e)}")
            return False

    async def exists(self, ward_id: str) -> bool:
        """Check if ward exists"""
        try:
            count = await self.collection.count_documents({"_id": ObjectId(ward_id) if ward_id and len(str(ward_id)) == 24 else ward_id})
            return count > 0
        except Exception as e:
            logger.error(f"Error checking ward existence: {str(e)}")
            return False

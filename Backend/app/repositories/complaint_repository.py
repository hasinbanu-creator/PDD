"""Complaint repository for data access"""
from typing import Optional, List, Dict
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)


class ComplaintRepository:
    """Repository for complaint operations"""

    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.collection = db["complaints"]
        self.history_collection = db["complaint_history"]

    @staticmethod
    def _normalize_id(value):
        """Convert valid Mongo IDs while preserving non-Mongo identifier strings."""
        if value is None:
            return None
        if isinstance(value, ObjectId):
            return value
        if isinstance(value, str):
            try:
                return ObjectId(value)
            except Exception:
                return value
        return value

    def _build_id_query(self, complaint_id):
        """Build a lookup query that works for either an internal Mongo ID or a public complaint id."""
        normalized = self._normalize_id(complaint_id)
        if isinstance(normalized, ObjectId):
            return {"$or": [{"_id": normalized}, {"complaint_id": str(complaint_id)}]}
        return {"$or": [{"_id": normalized}, {"complaint_id": complaint_id}]}

    async def create(self, complaint_data: dict) -> str:
        """Create a new complaint"""
        try:
            result = await self.collection.insert_one(complaint_data)
            logger.info(f"Complaint created: {result.inserted_id}")
            return str(result.inserted_id)
        except Exception as e:
            logger.error(f"Error creating complaint: {str(e)}")
            raise

    async def get_by_id(self, complaint_id: str) -> Optional[dict]:
        """Get complaint by MongoDB ID or public complaint_id string."""
        try:
            complaint = await self.collection.find_one(self._build_id_query(complaint_id))
            return complaint
        except Exception as e:
            logger.error(f"Error fetching complaint: {str(e)}")
            return None

    async def get_by_complaint_id(self, complaint_id: str) -> Optional[dict]:
        """Get complaint by complaint_id field"""
        try:
            complaint = await self.collection.find_one({"complaint_id": complaint_id})
            return complaint
        except Exception as e:
            logger.error(f"Error fetching complaint by ID: {str(e)}")
            return None

    async def update(self, complaint_id: str, update_data: dict) -> bool:
        """Update complaint"""
        try:
            update_data["updated_at"] = datetime.utcnow()
            result = await self.collection.update_one(
                self._build_id_query(complaint_id),
                {"$set": update_data}
            )
            logger.info(f"Complaint updated: {complaint_id}")
            return result.matched_count > 0
        except Exception as e:
            logger.error(f"Error updating complaint: {str(e)}")
            raise

    async def get_recent_by_user(
        self,
        user_id: str,
        days: int = 7,
        status: Optional[str] = None
    ) -> List[dict]:
        """Get recent complaints by user"""
        try:
            query = {
                "user_id": ObjectId(user_id),
                "created_at": {"$gte": datetime.utcnow() - timedelta(days=days)}
            }
            
            if status:
                query["status"] = status
            
            complaints = await self.collection.find(query)\
                .sort("created_at", -1)\
                .to_list(length=100)
            
            return complaints
        except Exception as e:
            logger.error(f"Error fetching recent complaints: {str(e)}")
            return []

    async def get_by_ward(
        self,
        ward_id: str,
        skip: int = 0,
        limit: int = 10,
        status: Optional[str] = None
    ) -> tuple[List[dict], int]:
        """Get complaints by ward with pagination"""
        try:
            try:
                resolved_id = ObjectId(ward_id)
            except Exception:
                resolved_id = ward_id

            query = {
                "$or": [
                    {"ward_id": resolved_id},
                    {"ward_id": str(ward_id)},
                    {"wardId": str(ward_id)}
                ]
            }
            
            if status:
                query["status"] = status
            
            total = await self.collection.count_documents(query)
            
            complaints = await self.collection.find(query)\
                .skip(skip)\
                .limit(limit)\
                .sort("created_at", -1)\
                .to_list(length=limit)
            
            return complaints, total
        except Exception as e:
            logger.error(f"Error fetching ward complaints: {str(e)}")
            raise

    async def get_by_inspector(
        self,
        inspector_id: str,
        skip: int = 0,
        limit: int = 10,
        status: Optional[str] = None
    ) -> tuple[List[dict], int]:
        """Get complaints assigned to inspector"""
        try:
            query = {"inspector_id": ObjectId(inspector_id)}
            
            if status:
                query["status"] = status
            
            total = await self.collection.count_documents(query)
            
            complaints = await self.collection.find(query)\
                .skip(skip)\
                .limit(limit)\
                .sort("created_at", -1)\
                .to_list(length=limit)
            
            return complaints, total
        except Exception as e:
            logger.error(f"Error fetching inspector complaints: {str(e)}")
            raise

    async def get_by_worker(
        self,
        worker_id: str,
        skip: int = 0,
        limit: int = 10,
        status: Optional[str] = None
    ) -> tuple[List[dict], int]:
        """Get complaints assigned to worker"""
        try:
            query = {"worker_id": ObjectId(worker_id)}
            
            if status:
                query["status"] = status
            
            total = await self.collection.count_documents(query)
            
            complaints = await self.collection.find(query)\
                .skip(skip)\
                .limit(limit)\
                .sort("created_at", -1)\
                .to_list(length=limit)
            
            return complaints, total
        except Exception as e:
            logger.error(f"Error fetching worker complaints: {str(e)}")
            raise

    async def search(
        self,
        query_dict: dict,
        skip: int = 0,
        limit: int = 10
    ) -> tuple[List[dict], int]:
        """Search complaints with filters"""
        try:
            total = await self.collection.count_documents(query_dict)
            
            complaints = await self.collection.find(query_dict)\
                .skip(skip)\
                .limit(limit)\
                .sort("created_at", -1)\
                .to_list(length=limit)
            
            return complaints, total
        except Exception as e:
            logger.error(f"Error searching complaints: {str(e)}")
            raise

    async def get_nearby_complaints(
        self,
        latitude: float,
        longitude: float,
        distance_meters: float = 500,
        complaint_type: Optional[str] = None,
        days: int = 7
    ) -> List[dict]:
        """Get complaints near a location (within distance_meters)"""
        try:
            query = {
                "location": {
                    "$near": {
                        "$geometry": {
                            "type": "Point",
                            "coordinates": [longitude, latitude]
                        },
                        "$maxDistance": distance_meters
                    }
                },
                "created_at": {"$gte": datetime.utcnow() - timedelta(days=days)}
            }
            
            if complaint_type:
                query["complaint_type"] = complaint_type
            
            complaints = await self.collection.find(query)\
                .to_list(length=100)
            
            return complaints
        except Exception as e:
            logger.error(f"Error getting nearby complaints: {str(e)}")
            return []

    async def get_stats_by_status(self, district_id: Optional[str] = None) -> dict:
        """Get complaint count by status"""
        try:
            query = {}
            if district_id:
                query["district_id"] = ObjectId(district_id)
            
            pipeline = [
                {"$match": query},
                {"$group": {
                    "_id": "$status",
                    "count": {"$sum": 1}
                }}
            ]
            
            stats = {}
            async for doc in self.collection.aggregate(pipeline):
                stats[doc["_id"]] = doc["count"]
            
            return stats
        except Exception as e:
            logger.error(f"Error getting status stats: {str(e)}")
            return {}

    async def add_history(self, history_data: dict) -> bool:
        """Add complaint history entry"""
        try:
            result = await self.history_collection.insert_one(history_data)
            logger.info(f"Complaint history added: {result.inserted_id}")
            return True
        except Exception as e:
            logger.error(f"Error adding complaint history: {str(e)}")
            raise

    async def get_history(self, complaint_id: str) -> List[dict]:
        """Get complaint history by internal complaint id or public complaint id."""
        try:
            normalized = self._normalize_id(complaint_id)
            query = {"complaint_id": normalized} if isinstance(normalized, ObjectId) else {"complaint_id": complaint_id}
            history = await self.history_collection.find(query).sort("timestamp", 1).to_list(length=100)
            return history
        except Exception as e:
            logger.error(f"Error fetching complaint history: {str(e)}")
            return []

    async def count_by_user_this_week(self, user_id: str) -> int:
        """Count complaints created by user this week"""
        try:
            week_ago = datetime.utcnow() - timedelta(days=7)
            count = await self.collection.count_documents({
                "user_id": ObjectId(user_id),
                "created_at": {"$gte": week_ago}
            })
            return count
        except Exception as e:
            logger.error(f"Error counting weekly complaints: {str(e)}")
            return 0

    async def count_by_user_today(self, user_id: str) -> int:
        """Count complaints created by user today"""
        try:
            today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
            count = await self.collection.count_documents({
                "user_id": ObjectId(user_id),
                "created_at": {"$gte": today}
            })
            return count
        except Exception as e:
            logger.error(f"Error counting daily complaints: {str(e)}")
            return 0

    async def get_pending_approvals_count(self, inspector_id: str) -> int:
        """Get count of complaints pending approval"""
        try:
            count = await self.collection.count_documents({
                "inspector_id": ObjectId(inspector_id),
                "status": "APPROVAL"
            })
            return count
        except Exception as e:
            logger.error(f"Error counting pending approvals: {str(e)}")
            return 0

    async def get_with_duplicates(
        self,
        ward_id: str,
        complaint_type: str,
        days: int = 7
    ) -> List[dict]:
        """Get complaints of same type in same ward within days"""
        try:
            time_threshold = datetime.utcnow() - timedelta(days=days)
            
            complaints = await self.collection.find({
                "ward_id": ObjectId(ward_id),
                "complaint_type": complaint_type,
                "created_at": {"$gte": time_threshold}
            }).to_list(length=100)
            
            return complaints
        except Exception as e:
            logger.error(f"Error getting duplicate complaints: {str(e)}")
            return []

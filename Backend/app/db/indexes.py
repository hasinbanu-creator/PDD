"""MongoDB indexes for performance optimization"""
from motor.motor_asyncio import AsyncIOMotorDatabase
import logging

logger = logging.getLogger(__name__)


async def create_indexes(db: AsyncIOMotorDatabase):
    """Create all necessary MongoDB indexes"""
    try:
        # User indexes
        await db["users"].create_index("mobile_number", unique=True)
        await db["users"].create_index("email", unique=True, sparse=True)
        await db["users"].create_index("role")
        await db["users"].create_index("district")
        await db["users"].create_index("is_active")
        
        # District indexes
        await db["districts"].create_index("code", unique=True)
        await db["districts"].create_index("is_active")
        
        # Ward indexes
        await db["wards"].create_index("district_id")
        await db["wards"].create_index("inspector_id")
        await db["wards"].create_index([("district_id", 1), ("ward_number", 1)], unique=True)
        await db["wards"].create_index("is_active")
        
        # Complaint indexes - CRITICAL for performance
        await db["complaints"].create_index("complaint_id", unique=True)
        await db["complaints"].create_index("user_id")
        await db["complaints"].create_index("ward_id")
        await db["complaints"].create_index("district_id")
        await db["complaints"].create_index("inspector_id")
        await db["complaints"].create_index("worker_id")
        await db["complaints"].create_index("status")
        await db["complaints"].create_index("complaint_type")
        await db["complaints"].create_index("priority")
        await db["complaints"].create_index("created_at")
        await db["complaints"].create_index([("created_at", -1)])
        await db["complaints"].create_index([("status", 1), ("created_at", -1)])
        await db["complaints"].create_index([("ward_id", 1), ("status", 1)])
        await db["complaints"].create_index([("inspector_id", 1), ("status", 1)])
        await db["complaints"].create_index([("user_id", 1), ("created_at", -1)])
        
        # Geospatial index for location-based queries
        await db["complaints"].create_index([("location", "2dsphere")], sparse=True)
        
        # Complaint history indexes
        await db["complaint_history"].create_index("complaint_id")
        await db["complaint_history"].create_index("performed_by")
        await db["complaint_history"].create_index("timestamp")
        await db["complaint_history"].create_index([("complaint_id", 1), ("timestamp", -1)])
        
        logger.info("All MongoDB indexes created successfully")
        
    except Exception as e:
        logger.error(f"Error creating indexes: {str(e)}")
        raise

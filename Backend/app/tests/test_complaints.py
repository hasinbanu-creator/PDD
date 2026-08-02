"""Tests for complaint management module"""
import pytest
from datetime import datetime, timedelta
from bson import ObjectId
from unittest.mock import Mock, AsyncMock, patch

from app.services.complaint_service import ComplaintService
from app.services.ward_service import WardService
from app.schemas.complaint_schema import (
    ComplaintCreateSchema, ComplaintAssignWorkerSchema,
    ComplaintSubmitResolutionSchema, ComplaintApproveSchema
)
from app.core.exceptions import ValidationError, UnauthorizedError
from app.utils.complaint_validators import (
    ComplaintValidator, DuplicateComplaintDetector, SpamDetector
)


class TestComplaintValidator:
    """Test complaint validation logic"""

    def test_validate_gps_coordinates_valid(self):
        """Test GPS coordinate validation with valid values"""
        assert ComplaintValidator.validate_gps_coordinates(13.0827, 80.2707) == True
        assert ComplaintValidator.validate_gps_coordinates(-90, 180) == True
        assert ComplaintValidator.validate_gps_coordinates(90, -180) == True

    def test_validate_gps_coordinates_invalid(self):
        """Test GPS coordinate validation with invalid values"""
        assert ComplaintValidator.validate_gps_coordinates(91, 80) == False
        assert ComplaintValidator.validate_gps_coordinates(-91, 80) == False
        assert ComplaintValidator.validate_gps_coordinates(80, 181) == False
        assert ComplaintValidator.validate_gps_coordinates(80, -181) == False

    def test_validate_description_valid(self):
        """Test description validation with valid input"""
        assert ComplaintValidator.validate_description("This is a valid complaint description") == True

    def test_validate_description_invalid(self):
        """Test description validation with invalid input"""
        assert ComplaintValidator.validate_description("") == False
        assert ComplaintValidator.validate_description("short") == False
        assert ComplaintValidator.validate_description("a" * 1001) == False

    def test_validate_email(self):
        """Test email validation"""
        assert ComplaintValidator.validate_email("test@example.com") == True
        assert ComplaintValidator.validate_email("invalid.email") == False
        assert ComplaintValidator.validate_email("test@") == False

    def test_validate_phone(self):
        """Test Indian phone number validation"""
        assert ComplaintValidator.validate_phone("9876543210") == True
        assert ComplaintValidator.validate_phone("6123456789") == True
        assert ComplaintValidator.validate_phone("5123456789") == False  # Must start with 6-9
        assert ComplaintValidator.validate_phone("987654321") == False   # Too short

    def test_validate_priority(self):
        """Test priority validation"""
        assert ComplaintValidator.validate_priority("LOW") == True
        assert ComplaintValidator.validate_priority("HIGH") == True
        assert ComplaintValidator.validate_priority("INVALID") == False


class TestDuplicateDetection:
    """Test duplicate complaint detection"""

    def test_calculate_distance(self):
        """Test distance calculation using Haversine formula"""
        # Same location
        distance = DuplicateComplaintDetector.calculate_distance(13.0827, 80.2707, 13.0827, 80.2707)
        assert distance < 1  # Less than 1 meter
        
        # Different locations
        distance = DuplicateComplaintDetector.calculate_distance(
            13.0827, 80.2707,  # T Nagar Chennai
            13.0880, 80.2790   # Nearby location (about 900 meters)
        )
        assert distance > 500

    def test_duplicate_same_location_same_type(self):
        """Test duplicate detection for same location and type"""
        existing_complaint = {
            "complaint_type": "GARBAGE",
            "latitude": 13.0827,
            "longitude": 80.2707,
            "created_at": datetime.utcnow()
        }
        
        is_dup = DuplicateComplaintDetector.is_duplicate(
            "GARBAGE",
            13.0827,
            80.2707,
            existing_complaint
        )
        
        assert is_dup == True

    def test_not_duplicate_different_type(self):
        """Test non-duplicate for different complaint type"""
        existing_complaint = {
            "complaint_type": "GARBAGE",
            "latitude": 13.0827,
            "longitude": 80.2707,
            "created_at": datetime.utcnow()
        }
        
        is_dup = DuplicateComplaintDetector.is_duplicate(
            "POTHOLE",
            13.0827,
            80.2707,
            existing_complaint
        )
        
        assert is_dup == False

    def test_not_duplicate_far_location(self):
        """Test non-duplicate for far location"""
        existing_complaint = {
            "complaint_type": "GARBAGE",
            "latitude": 13.0827,
            "longitude": 80.2707,
            "created_at": datetime.utcnow()
        }
        
        is_dup = DuplicateComplaintDetector.is_duplicate(
            "GARBAGE",
            13.0880,
            80.2790,  # About 900 meters away
            existing_complaint
        )
        
        assert is_dup == False


class TestSpamDetection:
    """Test spam detection logic"""

    def test_weekly_limit_check(self):
        """Test weekly complaint limit"""
        orig = SpamDetector.MAX_COMPLAINTS_PER_WEEK
        SpamDetector.MAX_COMPLAINTS_PER_WEEK = 2
        try:
            assert SpamDetector.check_weekly_limit(0) == True
            assert SpamDetector.check_weekly_limit(1) == True
            assert SpamDetector.check_weekly_limit(2) == False
            assert SpamDetector.check_weekly_limit(3) == False
        finally:
            SpamDetector.MAX_COMPLAINTS_PER_WEEK = orig

    def test_daily_limit_check(self):
        """Test daily complaint limit"""
        orig = SpamDetector.MAX_COMPLAINTS_PER_DAY
        SpamDetector.MAX_COMPLAINTS_PER_DAY = 1
        try:
            assert SpamDetector.check_daily_limit(0) == True
            assert SpamDetector.check_daily_limit(1) == False
            assert SpamDetector.check_daily_limit(2) == False
        finally:
            SpamDetector.MAX_COMPLAINTS_PER_DAY = orig

    def test_repetitive_description_check(self):
        """Test repetitive description detection"""
        current = "Garbage pile not cleaned in market area"
        recent = ["Garbage pile not cleaned in market area"]
        
        is_original = SpamDetector.check_repetitive_descriptions(current, recent)
        assert is_original == False
        
        # Different descriptions should not match
        recent2 = ["Pothole on the main road"]
        is_original2 = SpamDetector.check_repetitive_descriptions(current, recent2)
        assert is_original2 == True


class TestWardService:
    """Test ward service business logic"""

    @pytest.mark.asyncio
    async def test_create_ward_success(self):
        """Test successful ward creation"""
        mock_ward_repo = AsyncMock()
        mock_user_repo = AsyncMock()
        mock_district_repo = AsyncMock()
        
        mock_ward_repo.get_by_ward_number.return_value = None
        mock_ward_repo.create.return_value = "ward_123"
        mock_ward_repo.get_by_id.return_value = {
            "_id": ObjectId(),
            "district_id": ObjectId(),
            "ward_name": "T Nagar",
            "ward_number": "12",
            "inspector_id": ObjectId(),
            "is_active": True,
            "complaint_count": 0,
            "created_at": datetime.utcnow()
        }
        
        mock_district_repo.exists.return_value = True
        mock_user_repo.get_by_id.return_value = {
            "role": "INSPECTOR",
            "district": "dist_123"
        }
        
        service = WardService(mock_ward_repo, mock_user_repo, mock_district_repo)
        
        from app.schemas.complaint_schema import WardCreateSchema
        schema = WardCreateSchema(
            district_id="dist_123",
            ward_name="T Nagar",
            ward_number="12",
            inspector_id="insp_123"
        )
        
        # This should not raise
        result = await service.create_ward(schema, "user_123")
        assert result is not None
        assert result["ward_name"] == "T Nagar"

    @pytest.mark.asyncio
    async def test_create_ward_duplicate_ward_number(self):
        """Test ward creation with duplicate ward number"""
        mock_ward_repo = AsyncMock()
        mock_user_repo = AsyncMock()
        mock_district_repo = AsyncMock()
        
        # Simulate existing ward
        mock_ward_repo.get_by_ward_number.return_value = {
            "_id": ObjectId(),
            "ward_number": "12"
        }
        
        mock_district_repo.exists.return_value = True
        
        service = WardService(mock_ward_repo, mock_user_repo, mock_district_repo)
        
        from app.schemas.complaint_schema import WardCreateSchema
        schema = WardCreateSchema(
            district_id="dist_123",
            ward_name="T Nagar",
            ward_number="12",
            inspector_id="insp_123"
        )
        
        with pytest.raises(ValidationError):
            await service.create_ward(schema, "user_123")


class TestComplaintService:
    """Test complaint service business logic"""

    @pytest.mark.asyncio
    async def test_create_complaint_success(self):
        """Test successful complaint creation"""
        mock_complaint_repo = AsyncMock()
        mock_ward_repo = AsyncMock()
        
        mock_ward_repo.get_by_id.return_value = {
            "_id": ObjectId(),
            "district_id": ObjectId(),
            "is_active": True,
            "inspector_id": ObjectId()
        }
        
        mock_complaint_repo.count_by_user_this_week.return_value = 0
        mock_complaint_repo.count_by_user_today.return_value = 0
        mock_complaint_repo.get_with_duplicates.return_value = []
        mock_complaint_repo.create.return_value = "complaint_123"
        mock_complaint_repo.add_history.return_value = True
        mock_complaint_repo.get_by_id.return_value = {
            "_id": ObjectId(),
            "complaint_id": "CIVI-123",
            "status": "OPEN",
            "created_at": datetime.utcnow()
        }
        
        mock_ward_repo.update_complaint_counts.return_value = True
        
        service = ComplaintService(mock_complaint_repo, mock_ward_repo)
        
        schema = ComplaintCreateSchema(
            ward_id="ward_123",
            complaint_type="GARBAGE",
            description="Garbage not cleaned",
            latitude=13.0827,
            longitude=80.2707,
            landmark="Near Market"
        )
        
        result = await service.create_complaint(schema, "user_123", "CITIZEN")
        assert result is not None
        assert result["status"] == "OPEN"

    @pytest.mark.asyncio
    async def test_create_complaint_non_citizen(self):
        """Test complaint creation by non-citizen (should fail)"""
        mock_complaint_repo = AsyncMock()
        mock_ward_repo = AsyncMock()
        
        service = ComplaintService(mock_complaint_repo, mock_ward_repo)
        
        schema = ComplaintCreateSchema(
            ward_id="ward_123",
            complaint_type="GARBAGE",
            description="Garbage not cleaned",
            latitude=13.0827,
            longitude=80.2707,
            landmark="Near Market"
        )
        
        with pytest.raises(UnauthorizedError):
            await service.create_complaint(schema, "user_123", "INSPECTOR")

    @pytest.mark.asyncio
    async def test_get_complaint_by_complaint_id_string(self):
        """Complaint details should resolve when the client passes the complaint_id string."""
        mock_complaint_repo = AsyncMock()
        mock_ward_repo = AsyncMock()

        mock_complaint_repo.get_by_id.return_value = None
        mock_complaint_repo.get_by_complaint_id.return_value = {
            "_id": ObjectId(),
            "complaint_id": "CIVI-123",
            "status": "OPEN",
            "created_at": datetime.utcnow(),
        }
        mock_complaint_repo.get_history.return_value = []

        service = ComplaintService(mock_complaint_repo, mock_ward_repo)

        result = await service.get_complaint("CIVI-123")

        assert result is not None
        assert result["complaint_id"] == "CIVI-123"
        assert result["status"] == "OPEN"

    @pytest.mark.asyncio
    async def test_create_complaint_invalid_gps(self):
        """Test complaint creation with invalid GPS coordinates"""
        mock_complaint_repo = AsyncMock()
        mock_ward_repo = AsyncMock()
        
        mock_ward_repo.get_by_id.return_value = {
            "_id": ObjectId(),
            "district_id": ObjectId(),
            "is_active": True
        }
        
        mock_complaint_repo.count_by_user_this_week.return_value = 0
        mock_complaint_repo.count_by_user_today.return_value = 0
        
        service = ComplaintService(mock_complaint_repo, mock_ward_repo)
        
        schema = ComplaintCreateSchema(
            ward_id="ward_123",
            complaint_type="GARBAGE",
            description="Garbage not cleaned",
            latitude=13.0827,  # Valid for schema
            longitude=80.2707,
            landmark="Near Market"
        )
        
        with patch('app.utils.complaint_validators.ComplaintValidator.validate_gps_coordinates', return_value=False):
            with pytest.raises(ValidationError):
                await service.create_complaint(schema, "user_123", "CITIZEN")

    @pytest.mark.asyncio
    async def test_assign_worker_success(self):
        """Test successful worker assignment"""
        mock_complaint_repo = AsyncMock()
        mock_ward_repo = AsyncMock()
        mock_user_repo = AsyncMock()
        
        dist_id = ObjectId()
        complaint_data = {
            "_id": ObjectId(),
            "complaint_id": "CIVI-123",
            "status": "OPEN",
            "inspector_id": ObjectId("507f1f77bcf86cd799439010"),
            "district_id": dist_id
        }
        
        mock_complaint_repo.get_by_id.return_value = complaint_data
        mock_complaint_repo.update.return_value = True
        mock_complaint_repo.add_history.return_value = True
        
        updated_data = dict(complaint_data)
        updated_data["status"] = "WORKING"
        mock_complaint_repo.get_by_id.return_value = updated_data
        
        mock_user_repo.get_by_id.return_value = {
            "role": "WORKER",
            "district": str(dist_id)
        }
        
        service = ComplaintService(
            mock_complaint_repo,
            mock_ward_repo,
            mock_user_repo
        )
        
        schema = ComplaintAssignWorkerSchema(
            worker_id="worker_123",
            deadline=datetime.utcnow() + timedelta(days=7)
        )
        
        result = await service.assign_worker(
            "complaint_123",
            schema,
            "507f1f77bcf86cd799439010",
            "INSPECTOR"
        )
        
        assert result is not None
        assert result["status"] == "WORKING"


# Run tests with: pytest app/tests/test_complaints.py -v
if __name__ == "__main__":
    pytest.main([__file__, "-v"])

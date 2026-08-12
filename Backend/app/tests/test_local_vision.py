import pytest
from unittest.mock import patch, MagicMock
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.services.vision_service import VisionService
from app.dependencies.auth_dependency import get_current_user

# Minimum valid 1x1 JPEG image bytes to pass PIL integrity checks
VALID_JPEG = (
    b"\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x01\x00`\x00`\x00\x00\xff\xdb\x00C\x00\x08\x06\x06"
    b"\x07\x06\x05\x08\x07\x07\x07\t\t\x08\n\x0c\x14\r\x0c\x0b\x0b\x0c\x19\x12\x13\x0f\x14\x1d\x1a"
    b"\x1f\x1e\x1d\x1a\x1c\x1c $.' \",#\x1c\x1c(7),01444\x1f'9=82<.342\xff\xc0\x00\x0b\x08\x00\x01"
    b"\x00\x01\x01\x01\x11\x00\xff\xc4\x00\x1f\x00\x00\x01\x05\x01\x01\x01\x01\x01\x01\x00\x00\x00"
    b"\x00\x00\x00\x00\x00\x01\x02\x03\x04\x05\x06\x07\x08\t\n\x0b\xff\xda\x00\x08\x01\x01\x00\x00"
    b"?\x00\x37\x00\x0f\xff\xd9"
)

@pytest.fixture(autouse=True)
def override_auth():
    async def mock_user():
        return {"user_id": "test_user", "role": "CITIZEN"}
    app.dependency_overrides[get_current_user] = mock_user
    yield
    app.dependency_overrides.pop(get_current_user, None)

@pytest.fixture
def mock_pil_stddev():
    """Mock ImageStat.Stat stddev to bypass blank/solid image check"""
    with patch("PIL.ImageStat.Stat") as mock_stat:
        mock_stat_instance = MagicMock()
        mock_stat_instance.stddev = [10.0]
        mock_stat.return_value = mock_stat_instance
        yield

@pytest.mark.asyncio
async def test_verify_image_match(mock_pil_stddev):
    """TEST 1 - MATCH: selected = pothole, predicted = pothole, confidence = 0.95"""
    with patch("app.services.vision_service.VisionService.predict") as mock_predict:
        mock_predict.return_value = {
            "predicted_class": "pothole",
            "confidence": 0.95
        }
        
        files = {"file": ("test.jpg", VALID_JPEG, "image/jpeg")}
        data = {"selected_category": "POTHOLE"}
        
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            response = await client.post("/api/v1/complaints/verify-image", files=files, data=data)
            assert response.status_code == 200
            json_data = response.json()
            assert json_data["success"] is True
            assert json_data["verified"] is True
            assert json_data["verification_status"] == "MATCH"
            assert json_data["selected_category"] == "pothole"
            assert json_data["predicted_category"] == "pothole"
            assert json_data["confidence"] == 95

@pytest.mark.asyncio
async def test_verify_image_mismatch(mock_pil_stddev):
    """TEST 2 - MISMATCH: selected = pothole, predicted = street_light, confidence = 0.95"""
    with patch("app.services.vision_service.VisionService.predict") as mock_predict:
        mock_predict.return_value = {
            "predicted_class": "street_light",
            "confidence": 0.95
        }
        
        files = {"file": ("test.jpg", VALID_JPEG, "image/jpeg")}
        data = {"selected_category": "POTHOLE"}
        
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            response = await client.post("/api/v1/complaints/verify-image", files=files, data=data)
            assert response.status_code == 200
            json_data = response.json()
            assert json_data["success"] is True
            assert json_data["verified"] is False
            assert json_data["verification_status"] == "MISMATCH"
            assert json_data["selected_category"] == "pothole"
            assert json_data["predicted_category"] == "street_light"
            assert json_data["confidence"] == 95

@pytest.mark.asyncio
async def test_verify_image_low_confidence(mock_pil_stddev):
    """TEST 3 - LOW CONFIDENCE: selected = pothole, predicted = pothole, confidence = 0.40"""
    with patch("app.services.vision_service.VisionService.predict") as mock_predict:
        mock_predict.return_value = {
            "predicted_class": "pothole",
            "confidence": 0.40
        }
        
        files = {"file": ("test.jpg", VALID_JPEG, "image/jpeg")}
        data = {"selected_category": "POTHOLE"}
        
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            response = await client.post("/api/v1/complaints/verify-image", files=files, data=data)
            assert response.status_code == 200
            json_data = response.json()
            assert json_data["success"] is True
            assert json_data["verified"] is False
            assert json_data["verification_status"] == "LOW_CONFIDENCE"
            assert json_data["selected_category"] == "pothole"
            assert json_data["predicted_category"] == "pothole"
            assert json_data["confidence"] == 40

@pytest.mark.asyncio
async def test_verify_image_invalid_image():
    """TEST 4 - INVALID IMAGE: Upload invalid/corrupted image."""
    files = {"file": ("test.jpg", b"not an image", "image/jpeg")}
    data = {"selected_category": "POTHOLE"}
    
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post("/api/v1/complaints/verify-image", files=files, data=data)
        assert response.status_code == 400
        json_data = response.json()
        assert json_data["success"] is False
        assert "Invalid image" in json_data["error"]

@pytest.mark.asyncio
async def test_verify_image_model_loading_failure(mock_pil_stddev):
    """TEST 5 - MODEL LOADING FAILURE: Simulate model loading failure."""
    with patch("app.services.vision_service.VisionService.predict") as mock_predict:
        mock_predict.side_effect = RuntimeError("Vision model is not loaded. Model loading failure.")
        
        vision_service = VisionService()
        original_model = vision_service.model
        vision_service.model = None
        
        try:
            files = {"file": ("test.jpg", VALID_JPEG, "image/jpeg")}
            data = {"selected_category": "POTHOLE"}
            
            async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
                response = await client.post("/api/v1/complaints/verify-image", files=files, data=data)
                assert response.status_code == 500
                json_data = response.json()
                assert json_data["success"] is False
                assert "Local AI model error" in json_data["error"]
        finally:
            vision_service.model = original_model

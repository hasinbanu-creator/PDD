"""Tests for authentication endpoints"""
import pytest
from httpx import AsyncClient
from app.main import app
from datetime import datetime
from unittest.mock import AsyncMock, MagicMock, patch
from bson import ObjectId


@pytest.mark.asyncio
async def test_register_user():
    """Test user registration"""
    mock_db = MagicMock()
    
    # Mock constituency lookup
    mock_db.constituencies.find_one = AsyncMock(return_value={"_id": "const_123", "name": "Royapuram"})
    # Mock user exists lookup (return None)
    mock_db.users.find_one = AsyncMock(return_value=None)
    # Mock user insertion
    class MockResult:
        inserted_id = ObjectId()
    mock_db.users.insert_one = AsyncMock(return_value=MockResult())
    
    with patch("app.services.auth_service.db", mock_db), \
         patch("app.repositories.otp_repository.OTPRepository.create_otp_log", new_callable=AsyncMock):
        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.post(
                "/api/v1/auth/register",
                json={
                    "name": "Test User",
                    "email": "test@example.com",
                    "mobile_number": "9876543210",
                    "address": "Test Address",
                    "district": "Chennai",
                    "constituency_id": "const_123"
                }
            )
            
            assert response.status_code in [200, 201]
            data = response.json()
            assert data.get("success") is True
            assert "user_id" in data.get("data", {})


@pytest.mark.asyncio
async def test_register_duplicate_email():
    """Test duplicate email registration"""
    mock_db = MagicMock()
    
    # Mock constituency lookup
    mock_db.constituencies.find_one = AsyncMock(return_value={"_id": "const_123", "name": "Royapuram"})
    
    calls = []
    async def mock_find_one_stateful(query):
        calls.append(query)
        if len(calls) > 1:
            return {"_id": "existing_id"}
        return None
    mock_db.users.find_one = AsyncMock(side_effect=mock_find_one_stateful)
    
    class MockResult:
        inserted_id = ObjectId()
    mock_db.users.insert_one = AsyncMock(return_value=MockResult())
    
    with patch("app.services.auth_service.db", mock_db), \
         patch("app.repositories.otp_repository.OTPRepository.create_otp_log", new_callable=AsyncMock):
        async with AsyncClient(app=app, base_url="http://test") as client:
            # Register first user
            await client.post(
                "/api/v1/auth/register",
                json={
                    "name": "User 1",
                    "email": "duplicate@example.com",
                    "mobile_number": "9876543210",
                    "address": "Address",
                    "district": "Chennai",
                    "constituency_id": "const_123"
                }
            )
            
            # Try to register with same email
            response = await client.post(
                "/api/v1/auth/register",
                json={
                    "name": "User 2",
                    "email": "duplicate@example.com",
                    "mobile_number": "9876543211",
                    "address": "Address 2",
                    "district": "Chennai",
                    "constituency_id": "const_123"
                }
            )
            
            assert response.status_code in [400, 409]
            data = response.json()
            assert data.get("success") is False


@pytest.mark.asyncio
async def test_health_check():
    """Test health check endpoint"""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/health")
        
        assert response.status_code == 200
        data = response.json()
        assert data.get("status") == "healthy"


@pytest.mark.asyncio
async def test_root_endpoint():
    """Test root endpoint"""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/")
        
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") is True
        assert "Civifix Backend Running" in data.get("message", "")


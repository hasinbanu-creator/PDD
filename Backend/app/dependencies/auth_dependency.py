"""Authentication dependencies for FastAPI"""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional, Dict, Any
from app.services.jwt_service import JWTService
from app.repositories.user_repository import UserRepository
from app.core.exceptions import InvalidTokenException, TokenExpiredException, AuthenticationException

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> Dict[str, Any]:
    """Get current authenticated user from JWT token"""
    
    token = credentials.credentials
    
    # Decode token
    token_data = JWTService.decode_access_token(token)
    
    if not token_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check token expiry
    if not JWTService.is_token_valid(token_data):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check token type
    if token_data.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_id = token_data.get("user_id")
    
    # Verify user exists
    user = await UserRepository.find_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Build a complete profile from the MongoDB document
    # Stringify _id to make it JSON-serializable
    if "_id" in user:
        user["_id"] = str(user["_id"])
    
    # Ensure essential fields from JWT are always present as fallbacks
    user.setdefault("user_id", user_id)
    user.setdefault("email", token_data.get("email"))
    user.setdefault("role", token_data.get("role"))
    user.setdefault("district", token_data.get("district"))
    
    # Remove sensitive fields that should never be sent to the client
    for key in ("otp_code_hash", "otp_expiry", "otp_attempts", "otp_last_request_at", "password_hash"):
        user.pop(key, None)
    
    return user


async def get_current_admin(
    current_user: Dict[str, Any] = Depends(get_current_user)
) -> Dict[str, Any]:
    """Get current admin user (DISTRICT_ADMIN or SUPER_ADMIN)"""
    
    role = current_user.get("role")
    
    if role not in ["DISTRICT_ADMIN", "SUPER_ADMIN"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    return current_user


async def get_current_super_admin(
    current_user: Dict[str, Any] = Depends(get_current_user)
) -> Dict[str, Any]:
    """Get current super admin user"""
    
    if current_user.get("role") != "SUPER_ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Super admin access required"
        )
    
    return current_user

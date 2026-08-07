"""Authentication dependencies for FastAPI"""
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional, Dict, Any
import logging
import traceback
from app.services.jwt_service import JWTService
from app.repositories.user_repository import UserRepository
from app.core.exceptions import InvalidTokenException, TokenExpiredException, AuthenticationException

logger_auth = logging.getLogger(__name__)


class DiagnosticHTTPBearer(HTTPBearer):
    async def __call__(self, request: Request) -> Optional[HTTPAuthorizationCredentials]:
        logger_auth.info(f"[AUTH DIAGNOSTICS] DiagnosticHTTPBearer invoked. Path: {request.method} {request.url.path}")
        raw_auth = request.headers.get("Authorization")
        logger_auth.info(f"[AUTH DIAGNOSTICS] Raw Authorization Header from incoming request: '{raw_auth}'")
        
        try:
            res = await super().__call__(request)
            if res:
                logger_auth.info(f"[AUTH DIAGNOSTICS] HTTPBearer parsed scheme: '{res.scheme}'.")
            return res
        except HTTPException as http_exc:
            if http_exc.status_code == 403:
                print("=" * 80)
                print("403 CHECKPOINT")
                print("FILE:", __file__)
                print("FUNCTION: DiagnosticHTTPBearer.__call__")
                print("LINE: 31")
                print("USER: None")
                print("ROLE: None")
                print("REASON: HTTPBearer automatically rejected request because Authorization header is missing or malformed")
                print("=" * 80)
            raise http_exc


security = DiagnosticHTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> Dict[str, Any]:
    """Get current authenticated user from JWT token"""
    logger_auth.info("[AUTH DIAGNOSTICS] Entering get_current_user()")
    
    token = credentials.credentials
    logger_auth.info(f"[AUTH DIAGNOSTICS] Token payload: '{token[:15]}...'")
    
    # Decode token
    token_data = JWTService.decode_access_token(token)
    logger_auth.info(f"[AUTH DIAGNOSTICS] Decoded JWT token claims: {token_data}")
    
    if not token_data:
        logger_auth.warn("[AUTH DIAGNOSTICS] Token decoding failed: Invalid token signature/claims.")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check token expiry
    if not JWTService.is_token_valid(token_data):
        logger_auth.warn(f"[AUTH DIAGNOSTICS] Expired token. expiry (exp): {token_data.get('exp')}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check token type
    if token_data.get("type") != "access":
        logger_auth.warn(f"[AUTH DIAGNOSTICS] Invalid token type: '{token_data.get('type')}' (Expected: 'access')")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_id = token_data.get("user_id")
    
    # Verify user exists
    user = await UserRepository.find_by_id(user_id)
    logger_auth.info(f"[AUTH DIAGNOSTICS] MongoDB user profile found: {user}")
    
    if not user:
        logger_auth.warn(f"[AUTH DIAGNOSTICS] User '{user_id}' not found in database repository.")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Build a complete profile from the MongoDB document
    # Stringify _id to make it JSON-serializable
    if "_id" in user:
        user["_id"] = str(user["_id"])

    # Resolve district name and map district_id
    if "district" in user and user["district"]:
        dist_val = user["district"]
        try:
            from bson import ObjectId
            from app.db.mongodb import db as motor_db
            dist_obj_id = ObjectId(str(dist_val))
            user["district_id"] = str(dist_val)
            dist_doc = await motor_db.districts.find_one({"_id": dist_obj_id})
            if dist_doc:
                user["district"] = dist_doc.get("name")
        except Exception:
            user["district_id"] = str(dist_val)

    # Resolve ward name and map ward_id
    if "ward" in user and user["ward"]:
        ward_val = user["ward"]
        try:
            from bson import ObjectId
            from app.db.mongodb import db as motor_db
            ward_obj_id = ObjectId(str(ward_val))
            user["ward_id"] = str(ward_val)
            ward_doc = await motor_db.wards.find_one({"_id": ward_obj_id})
            if ward_doc:
                user["ward"] = ward_doc.get("ward_name")
        except Exception:
            user["ward_id"] = str(ward_val)

    # Resolve constituency name and map constituency_id
    const_val = user.get("constituency_id") or user.get("assembly_constituency_id")
    if const_val:
        try:
            from bson import ObjectId
            from app.db.mongodb import db as motor_db
            const_obj_id = ObjectId(str(const_val))
            user["constituency_id"] = str(const_val)
            user["assembly_constituency_id"] = str(const_val)
            const_doc = await motor_db.constituencies.find_one({"_id": const_obj_id})
            if const_doc:
                user["constituency_name"] = const_doc.get("name")
                user["assembly_constituency_name"] = const_doc.get("name")
        except Exception:
            user["constituency_id"] = str(const_val)
            user["assembly_constituency_id"] = str(const_val)
    
    # Ensure essential fields from JWT are always present as fallbacks
    user.setdefault("user_id", user_id)
    user.setdefault("email", token_data.get("email"))
    user.setdefault("role", token_data.get("role"))
    user.setdefault("district", token_data.get("district"))
    
    # Remove sensitive fields that should never be sent to the client
    for key in ("otp_code_hash", "otp_expiry", "otp_attempts", "otp_last_request_at", "password_hash"):
        user.pop(key, None)
    
    logger_auth.info(f"[AUTH DIAGNOSTICS] Exiting get_current_user(). Returning user context. Role: '{user.get('role')}'")
    return user


async def get_current_admin(
    current_user: Dict[str, Any] = Depends(get_current_user)
) -> Dict[str, Any]:
    """Get current admin user (DISTRICT_ADMIN or SUPER_ADMIN)"""
    logger_auth.info("[AUTH DIAGNOSTICS] Entering get_current_admin()")
    role = current_user.get("role")
    
    if role not in ["DISTRICT_ADMIN", "SUPER_ADMIN"]:
        print("=" * 80)
        print("403 CHECKPOINT")
        print("FILE:", __file__)
        print("FUNCTION: get_current_admin")
        print("LINE: 162")
        print("USER:", current_user.get("email") if isinstance(current_user, dict) else None)
        print("ROLE:", role)
        print("REASON: User role not in ['DISTRICT_ADMIN', 'SUPER_ADMIN']")
        print("=" * 80)
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    logger_auth.info("[AUTH DIAGNOSTICS] Exiting get_current_admin(). Admin access granted.")
    return current_user


async def get_current_super_admin(
    current_user: Dict[str, Any] = Depends(get_current_user)
) -> Dict[str, Any]:
    """Get current super admin user"""
    logger_auth.info("[AUTH DIAGNOSTICS] Entering get_current_super_admin()")
    role = current_user.get("role")
    
    if role != "SUPER_ADMIN":
        print("=" * 80)
        print("403 CHECKPOINT")
        print("FILE:", __file__)
        print("FUNCTION: get_current_super_admin")
        print("LINE: 181")
        print("USER:", current_user.get("email") if isinstance(current_user, dict) else None)
        print("ROLE:", role)
        print("REASON: User role is not SUPER_ADMIN")
        print("=" * 80)
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Super admin access required"
        )
    
    logger_auth.info("[AUTH DIAGNOSTICS] Exiting get_current_super_admin(). Super admin access granted.")
    return current_user

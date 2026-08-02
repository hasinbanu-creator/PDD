"""Authentication business logic"""
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from bson import ObjectId
from app.db.mongodb import db
from app.repositories.user_repository import UserRepository
from app.repositories.otp_repository import OTPRepository
from app.repositories.role_repository import RoleRepository
from app.core.security import SecurityUtils
from app.core.exceptions import (
    UserAlreadyExistsException,
    UserNotFoundException,
    InvalidOTPException,
    OTPExpiredException,
    OTPAttemptsExceededException,
    AuthenticationException,
    RateLimitException
)
from app.core.config import settings
from app.models.user_model import user_document
from app.models.otp_model import otp_log_document
from app.utils.otp_generator import generate_otp
from app.utils.validators import validate_mobile, validate_email

class AuthService:
    """Centralized authentication service"""
    
    @staticmethod
    async def register_user(
        name: str,
        email: str,
        mobile_number: str,
        address: str,
        district: str,
        constituency_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Register a new user"""
        
        # Validation
        if not validate_email(email):
            raise AuthenticationException("Invalid email format", "INVALID_EMAIL")
        
        if not validate_mobile(mobile_number):
            raise AuthenticationException("Invalid mobile number", "INVALID_MOBILE")
            
        if not constituency_id:
            raise AuthenticationException("Please select your Assembly Constituency.", "MISSING_CONSTITUENCY")
        
        # Lookup constituency name
        constituency_name = None
        try:
            const_doc = await db.constituencies.find_one({"_id": ObjectId(constituency_id) if len(str(constituency_id)) == 24 else constituency_id})
            if not const_doc:
                raise AuthenticationException("Assembly Constituency not found", "CONSTITUENCY_NOT_FOUND")
            constituency_name = const_doc.get("name")
        except Exception as e:
            if isinstance(e, AuthenticationException):
                raise
            raise AuthenticationException(f"Invalid constituency ID: {str(e)}", "INVALID_CONSTITUENCY")
        
        # Check if user already exists
        existing = await db.users.find_one({
            "$or": [
                {"email": email},
                {"mobile_number": mobile_number}
            ]
        })
        
        if existing:
            raise UserAlreadyExistsException("User with email or mobile already exists")
        
        # Generate OTP
        otp = generate_otp()
        otp_hash = SecurityUtils.hash_otp(otp)
        otp_expiry = datetime.utcnow() + timedelta(minutes=settings.OTP_EXPIRE_MINUTES)
        
        # Create user document
        user_data = {
            "name": name,
            "email": email,
            "mobile_number": mobile_number,
            "address": address,
            "district": district,
            "constituency_id": constituency_id,
            "constituency_name": constituency_name,
            "assembly_constituency_id": constituency_id,
            "assembly_constituency_name": constituency_name,
            "role": "CITIZEN",
            "permissions": [],
            "otp_code_hash": otp_hash,
            "otp_expiry": otp_expiry,
            "otp_attempts": 0,
            "otp_last_request_at": datetime.utcnow(),
            "otp_resend_count": 0,
            "is_verified": False,
            "is_active": False,
            "status": "INACTIVE",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        # Insert user
        result = await db.users.insert_one(user_data)
        
        # Create OTP log for audit
        otp_log = otp_log_document(
            identifier=email,
            identifier_type="email",
            otp_hash=otp_hash,
            expires_at=otp_expiry,
            purpose="registration"
        )
        await OTPRepository.create_otp_log(otp_log)
        
        return {
            "user_id": str(result.inserted_id),
            "otp": otp,
            "message": "OTP sent to email"
        }
    
    @staticmethod
    async def verify_registration_otp(
        email: str,
        otp: str
    ) -> Dict[str, Any]:
        """Verify OTP during registration"""
        
        # Find user
        user = await UserRepository.find_by_email(email)
        if not user:
            raise UserNotFoundException("User not found")
        
        # Check OTP expiry
        if user.get("otp_expiry") and datetime.utcnow() > user["otp_expiry"]:
            raise OTPExpiredException("OTP has expired")
        
        # Check attempts
        if user.get("otp_attempts", 0) >= settings.OTP_MAX_ATTEMPTS:
            raise OTPAttemptsExceededException("Maximum OTP attempts exceeded")
        
        # Verify OTP
        if not SecurityUtils.verify_otp(otp, user.get("otp_code_hash", "")):
            # Increment attempts
            await db.users.update_one(
                {"email": email},
                {"$inc": {"otp_attempts": 1}}
            )
            raise InvalidOTPException("Invalid OTP")
        
        # Mark as verified
        user_id = str(user["_id"])
        await UserRepository.verify_user(user_id)
        
        # Generate tokens
        tokens = AuthService._create_tokens(
            user_id,
            user.get("role"),
            email,
            user.get("district"),
            user.get("constituency_id") or user.get("assembly_constituency_id"),
            user.get("constituency_name") or user.get("assembly_constituency_name")
        )
        
        return {
            "user_id": user_id,
            "tokens": tokens,
            "constituency_id": user.get("constituency_id") or user.get("assembly_constituency_id"),
            "constituency_name": user.get("constituency_name") or user.get("assembly_constituency_name"),
            "assembly_constituency_id": user.get("constituency_id") or user.get("assembly_constituency_id"),
            "assembly_constituency_name": user.get("constituency_name") or user.get("assembly_constituency_name"),
            "message": "User verified successfully"
        }
    
    @staticmethod
    async def login_user(email: str) -> Dict[str, Any]:
        """Send OTP for login"""
        
        # Find user
        user = await UserRepository.find_by_email(email)
        if not user:
            raise UserNotFoundException("User not found")
        
        # Check if account is active
        if not user.get("is_active"):
            raise AuthenticationException("Account is not active", "ACCOUNT_INACTIVE")
        
        # Check rate limiting
        last_request = user.get("otp_last_request_at")
        if last_request:
            time_diff = (datetime.utcnow() - last_request).total_seconds() / 60
            if time_diff < 1 and user.get("otp_resend_count", 0) >= settings.OTP_MAX_RESEND:
                raise RateLimitException("Too many OTP requests")
        
        # Generate OTP
        otp = generate_otp()
        otp_hash = SecurityUtils.hash_otp(otp)
        otp_expiry = datetime.utcnow() + timedelta(minutes=settings.OTP_EXPIRE_MINUTES)
        
        # Update user OTP
        await db.users.update_one(
            {"email": email},
            {
                "$set": {
                    "otp_code_hash": otp_hash,
                    "otp_expiry": otp_expiry,
                    "otp_attempts": 0,
                    "otp_last_request_at": datetime.utcnow()
                },
                "$inc": {"otp_resend_count": 1}
            }
        )
        
        return {
            "otp": otp,
            "expires_in": settings.OTP_EXPIRE_MINUTES * 60,
            "message": "OTP sent to registered email"
        }
    
    @staticmethod
    async def verify_login_otp(email: str, otp: str) -> Dict[str, Any]:
        """Verify OTP for login"""
        
        # Find user
        user = await UserRepository.find_by_email(email)
        if not user:
            raise UserNotFoundException("User not found")
        
        # Check OTP
        if user.get("otp_expiry") and datetime.utcnow() > user["otp_expiry"]:
            raise OTPExpiredException("OTP has expired")
        
        if user.get("otp_attempts", 0) >= settings.OTP_MAX_ATTEMPTS:
            raise OTPAttemptsExceededException("Maximum OTP attempts exceeded")
        
        if not SecurityUtils.verify_otp(otp, user.get("otp_code_hash", "")):
            await db.users.update_one(
                {"email": email},
                {"$inc": {"otp_attempts": 1}}
            )
            raise InvalidOTPException("Invalid OTP")
        
        # Update last login
        user_id = str(user["_id"])
        await db.users.update_one(
            {"_id": user["_id"]},
            {"$set": {"last_login": datetime.utcnow()}}
        )
        
        # Generate tokens
        tokens = AuthService._create_tokens(
            user_id,
            user.get("role"),
            email,
            user.get("district"),
            user.get("constituency_id") or user.get("assembly_constituency_id"),
            user.get("constituency_name") or user.get("assembly_constituency_name")
        )
        
        return {
            "user_id": user_id,
            "tokens": tokens,
            "role": user.get("role"),
            "district": user.get("district"),
            "constituency_id": user.get("constituency_id") or user.get("assembly_constituency_id"),
            "constituency_name": user.get("constituency_name") or user.get("assembly_constituency_name"),
            "assembly_constituency_id": user.get("constituency_id") or user.get("assembly_constituency_id"),
            "assembly_constituency_name": user.get("constituency_name") or user.get("assembly_constituency_name"),
            "message": "Login successful"
        }
    
    @staticmethod
    async def refresh_tokens(refresh_token: str) -> Dict[str, Any]:
        """Refresh access token using refresh token"""
        
        # Decode refresh token
        token_data = SecurityUtils.decode_token(
            refresh_token,
            settings.JWT_REFRESH_SECRET
        )
        
        if not token_data or token_data.get("type") != "refresh":
            raise AuthenticationException("Invalid refresh token")
        
        if not SecurityUtils.verify_token_expiry(token_data):
            raise AuthenticationException("Refresh token expired")
        
        user_id = token_data.get("user_id")
        user = await UserRepository.find_by_id(user_id)
        
        if not user:
            raise UserNotFoundException("User not found")
        
        # Create new tokens
        tokens = AuthService._create_tokens(
            user_id,
            user.get("role"),
            user.get("email"),
            user.get("district"),
            user.get("constituency_id") or user.get("assembly_constituency_id"),
            user.get("constituency_name") or user.get("assembly_constituency_name")
        )
        
        return tokens
    
    @staticmethod
    def _create_tokens(
        user_id: str,
        role: str,
        email: str,
        district: str,
        constituency_id: Optional[str] = None,
        constituency_name: Optional[str] = None
    ) -> Dict[str, Any]:
        """Create access and refresh tokens"""
        
        access_token_data = {
            "user_id": user_id,
            "email": email,
            "role": role,
            "district": district,
            "constituency_id": constituency_id,
            "constituency_name": constituency_name,
            "assembly_constituency_id": constituency_id,
            "assembly_constituency_name": constituency_name,
            "type": "access"
        }
        
        refresh_token_data = {
            "user_id": user_id,
            "type": "refresh"
        }
        
        access_token = SecurityUtils.create_access_token(access_token_data)
        refresh_token = SecurityUtils.create_refresh_token(refresh_token_data)
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        }

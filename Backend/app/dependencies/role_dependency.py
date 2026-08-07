"""Role-based access control dependencies"""
from fastapi import Depends, HTTPException, status
from typing import Dict, Any, List
from app.dependencies.auth_dependency import get_current_user
from app.services.role_service import RoleService


def require_role(*allowed_roles: str):
    """Decorator to require specific roles"""
    async def role_checker(
        current_user: Dict[str, Any] = Depends(get_current_user)
    ) -> Dict[str, Any]:
        # Normalize allowed_roles: flatten nested iterables and stringify values
        normalized: List[str] = []
        for r in allowed_roles:
            if isinstance(r, (list, tuple, set)):
                for v in r:
                    normalized.append(str(v))
            else:
                normalized.append(str(r))

        user_role = current_user.get("role")

        if str(user_role) not in normalized:
            print("=" * 80)
            print("403 CHECKPOINT")
            print("FILE:", __file__)
            print("FUNCTION: require_role.role_checker")
            print("LINE: 25")
            print("USER:", current_user.get("email"))
            print("ROLE:", user_role)
            print("REASON: User role not in allowed roles:", normalized)
            print("=" * 80)
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"This action requires one of these roles: {', '.join(normalized)}"
            )
        
        return current_user
    
    return role_checker


def require_permission(required_permission: str):
    """Decorator to require specific permission"""
    async def permission_checker(
        current_user: Dict[str, Any] = Depends(get_current_user)
    ) -> Dict[str, Any]:
        
        user_role = current_user.get("role")
        user_permissions = current_user.get("permissions", [])
        
        # Check if permission is in user's permissions
        if required_permission not in user_permissions:
            # Try to check role-based permissions
            has_permission = await RoleService.check_permission(
                user_role, # type: ignore
                required_permission
            )
            
            if not has_permission:
                print("=" * 80)
                print("403 CHECKPOINT")
                print("FILE:", __file__)
                print("FUNCTION: require_permission.permission_checker")
                print("LINE: 53")
                print("USER:", current_user.get("email"))
                print("ROLE:", user_role)
                print("REASON: User lack permission:", required_permission)
                print("=" * 80)
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Permission '{required_permission}' required"
                )
        
        return current_user
    
    return permission_checker

from fastapi import Depends, Request, HTTPException, status
from app.schemas.user import CurrentUser
from app.models.company import Company
from app.schemas.enums import UserRole

def get_current_user(request: Request) -> CurrentUser:
    user = getattr(request.state, "user", None)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )
    return user

def get_current_company(request: Request) -> Company:
    company = getattr(request.state, "company", None)
    if not company:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not associated with a company",
        )
    return company

def require_manager(current_user: CurrentUser = Depends(get_current_user)):
    if not hasattr(current_user, "role") or current_user.role != UserRole.MANAGER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Manager role required",
        )
    return current_user

# Example of a dependency that requires an active user
# def get_current_active_user(current_user: CurrentUser = Depends(get_current_user)):
#     if not current_user.is_active: # Assuming is_active field in your user model
#         raise HTTPException(status_code=400, detail="Inactive user")
#     return current_user 
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies.db import get_db
from app.schemas.user import UserSyncRequest, UserSyncResponse
from app.services import user_service

router = APIRouter()

@router.post(
    "/sync",
    response_model=UserSyncResponse,
    status_code=status.HTTP_200_OK,
)
async def sync_user_endpoint(
    user_data: UserSyncRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Synchronize user data from Clerk.
    This endpoint is called by the frontend after a user signs in.
    It finds an existing user or creates a new one,
    and returns the user and their associated company.
    """
    user, company = await user_service.find_or_create_user_with_company(db, user_data)
    
    return UserSyncResponse(
        user=user,
        company=company
    ) 
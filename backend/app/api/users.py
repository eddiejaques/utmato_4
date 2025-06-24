from fastapi import APIRouter, Depends, status, HTTPException
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
    if not user_data.clerk_id or not user_data.email:
        raise HTTPException(status_code=422, detail="clerk_id and email are required.")
    user, company = await user_service.find_or_create_user_with_company(db, user_data)
    if not user:
        raise HTTPException(status_code=404, detail="User could not be created or found.")
    return UserSyncResponse(
        user=user,
        company=company
    ) 
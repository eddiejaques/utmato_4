from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.utm import URLValidationRequest, URLValidationResponse, UTMLinkCreate, UTMLinkResponse
from app.services import utm_service
from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User


router = APIRouter()


@router.post("/generate", response_model=UTMLinkResponse)
async def generate_utm_link(
    *,
    db: AsyncSession = Depends(get_db),
    link_in: UTMLinkCreate,
    current_user: User = Depends(get_current_user),
):
    """
    Generate a single UTM link.
    """
    utm_link = await utm_service.generate_single_utm_link(db=db, link_data=link_in, user=current_user)
    return utm_link


@router.post("/validate-url", response_model=URLValidationResponse)
def validate_url_endpoint(
    request: URLValidationRequest,
):
    """
    Validates a destination URL.
    """
    validation_result = utm_service.validate_url(str(request.url))
    return URLValidationResponse(**validation_result) 
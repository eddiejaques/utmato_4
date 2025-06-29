from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
import uuid

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
    if not link_in.destination_url or not link_in.utm_source or not link_in.utm_medium:
        raise HTTPException(status_code=422, detail="Missing required UTM parameters.")
    utm_link = await utm_service.generate_single_utm_link(db=db, link_data=link_in, user=current_user)
    return utm_link


@router.get("/campaign/{campaign_id}/links", response_model=list[UTMLinkResponse])
async def get_campaign_utm_links(
    *,
    db: AsyncSession = Depends(get_db),
    campaign_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
):
    """
    Retrieve all UTM links for a specific campaign.
    """
    utm_links = await utm_service.get_utm_links_for_campaign(db=db, campaign_id=campaign_id, user=current_user)
    return utm_links


@router.post("/validate-url", response_model=URLValidationResponse)
def validate_url_endpoint(
    request: URLValidationRequest,
):
    """
    Validates a destination URL.
    """
    validation_result = utm_service.validate_url(str(request.url))
    return URLValidationResponse(**validation_result)


@router.delete("/link/{utm_link_id}", response_model=UTMLinkResponse)
async def delete_utm_link(
    *,
    db: AsyncSession = Depends(get_db),
    utm_link_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
):
    """
    Delete a UTM link by id (user self-service).
    """
    utm_link = await utm_service.delete_utm_link(db=db, utm_link_id=utm_link_id, user=current_user)
    return utm_link 
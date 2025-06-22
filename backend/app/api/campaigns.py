from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
import uuid
from typing import List

from app.dependencies.db import get_db
from app.dependencies.auth import get_current_company
from app.models.company import Company
from app.services import campaign_service
from app.schemas.campaign import CampaignCreate, CampaignUpdate, CampaignResponse

router = APIRouter()

@router.post("", response_model=CampaignResponse, status_code=status.HTTP_201_CREATED)
async def create_campaign(
    *,
    db: AsyncSession = Depends(get_db),
    current_company: Company = Depends(get_current_company),
    campaign_in: CampaignCreate
):
    """
    Create new campaign.
    """
    campaign = await campaign_service.create_campaign(db=db, campaign_in=campaign_in, company_id=current_company.id)
    return campaign

@router.get("", response_model=List[CampaignResponse])
async def read_campaigns(
    db: AsyncSession = Depends(get_db),
    current_company: Company = Depends(get_current_company),
    skip: int = 0,
    limit: int = 100,
):
    """
    Retrieve campaigns for the current company.
    """
    campaigns = await campaign_service.get_campaigns(db=db, company_id=current_company.id, skip=skip, limit=limit)
    return campaigns

@router.get("/{campaign_id}", response_model=CampaignResponse)
async def read_campaign(
    *,
    db: AsyncSession = Depends(get_db),
    current_company: Company = Depends(get_current_company),
    campaign_id: uuid.UUID,
):
    """
    Get campaign by ID.
    """
    campaign = await campaign_service.get_campaign(db=db, campaign_id=campaign_id, company_id=current_company.id)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return campaign

@router.put("/{campaign_id}", response_model=CampaignResponse)
async def update_campaign(
    *,
    db: AsyncSession = Depends(get_db),
    current_company: Company = Depends(get_current_company),
    campaign_id: uuid.UUID,
    campaign_in: CampaignUpdate,
):
    """
    Update a campaign.
    """
    campaign = await campaign_service.get_campaign(db=db, campaign_id=campaign_id, company_id=current_company.id)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    campaign = await campaign_service.update_campaign(db=db, db_campaign=campaign, campaign_in=campaign_in)
    return campaign

@router.delete("/{campaign_id}", response_model=CampaignResponse)
async def delete_campaign(
    *,
    db: AsyncSession = Depends(get_db),
    current_company: Company = Depends(get_current_company),
    campaign_id: uuid.UUID,
):
    """
    Delete a campaign.
    """
    campaign = await campaign_service.get_campaign(db=db, campaign_id=campaign_id, company_id=current_company.id)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    campaign = await campaign_service.delete_campaign(db=db, db_campaign=campaign)
    return campaign

@router.post("/{campaign_id}/duplicate", response_model=CampaignResponse, status_code=status.HTTP_201_CREATED)
async def duplicate_campaign(
    *,
    db: AsyncSession = Depends(get_db),
    current_company: Company = Depends(get_current_company),
    campaign_id: uuid.UUID,
):
    """
    Duplicate a campaign.
    """
    campaign = await campaign_service.duplicate_campaign(db=db, campaign_id=campaign_id, company_id=current_company.id)
    if not campaign:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campaign to duplicate not found")
    return campaign 
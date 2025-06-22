from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import uuid
from typing import List

from app.dependencies.db import get_db
from app.dependencies.auth import get_current_company
from app.models.company import Company
from app.services import campaign_service
from app.schemas.campaign import CampaignCreate, CampaignUpdate, CampaignResponse

router = APIRouter()

@router.post("", response_model=CampaignResponse, status_code=status.HTTP_201_CREATED)
def create_campaign(
    *,
    db: Session = Depends(get_db),
    current_company: Company = Depends(get_current_company),
    campaign_in: CampaignCreate
):
    """
    Create new campaign.
    """
    campaign = campaign_service.create_campaign(db=db, campaign_in=campaign_in, company_id=current_company.id)
    return campaign

@router.get("", response_model=List[CampaignResponse])
def read_campaigns(
    db: Session = Depends(get_db),
    current_company: Company = Depends(get_current_company),
    skip: int = 0,
    limit: int = 100,
):
    """
    Retrieve campaigns for the current company.
    """
    campaigns = campaign_service.get_campaigns(db=db, company_id=current_company.id, skip=skip, limit=limit)
    return campaigns

@router.get("/{campaign_id}", response_model=CampaignResponse)
def read_campaign(
    *,
    db: Session = Depends(get_db),
    current_company: Company = Depends(get_current_company),
    campaign_id: uuid.UUID,
):
    """
    Get campaign by ID.
    """
    campaign = campaign_service.get_campaign(db=db, campaign_id=campaign_id, company_id=current_company.id)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return campaign

@router.put("/{campaign_id}", response_model=CampaignResponse)
def update_campaign(
    *,
    db: Session = Depends(get_db),
    current_company: Company = Depends(get_current_company),
    campaign_id: uuid.UUID,
    campaign_in: CampaignUpdate,
):
    """
    Update a campaign.
    """
    campaign = campaign_service.get_campaign(db=db, campaign_id=campaign_id, company_id=current_company.id)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    campaign = campaign_service.update_campaign(db=db, db_campaign=campaign, campaign_in=campaign_in)
    return campaign

@router.delete("/{campaign_id}", response_model=CampaignResponse)
def delete_campaign(
    *,
    db: Session = Depends(get_db),
    current_company: Company = Depends(get_current_company),
    campaign_id: uuid.UUID,
):
    """
    Delete a campaign.
    """
    campaign = campaign_service.get_campaign(db=db, campaign_id=campaign_id, company_id=current_company.id)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    campaign = campaign_service.delete_campaign(db=db, db_campaign=campaign)
    return campaign 
from sqlalchemy.orm import Session
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
import uuid
from typing import List, Optional

from app.models.campaign import Campaign
from app.schemas.campaign import CampaignCreate, CampaignUpdate

async def create_campaign(db: Session, *, campaign_in: CampaignCreate, company_id: uuid.UUID) -> Campaign:
    data = campaign_in.model_dump()
    # Serialize demographics and interests as comma-separated strings
    if data.get("demographics") is not None:
        data["demographics"] = ",".join(data["demographics"])
    if data.get("interests") is not None:
        data["interests"] = ",".join(data["interests"])
    db_campaign = Campaign(**data, company_id=company_id)
    db.add(db_campaign)
    await db.commit()
    await db.refresh(db_campaign)
    # Deserialize for API response
    if db_campaign.demographics:
        db_campaign.demographics = db_campaign.demographics.split(",")
    else:
        db_campaign.demographics = []
    if db_campaign.interests:
        db_campaign.interests = db_campaign.interests.split(",")
    else:
        db_campaign.interests = []
    return db_campaign

async def get_campaign(db: Session, *, campaign_id: uuid.UUID, company_id: uuid.UUID) -> Optional[Campaign]:
    result = await db.execute(
        select(Campaign).filter(Campaign.id == campaign_id, Campaign.company_id == company_id)
    )
    campaign = result.scalars().first()
    if campaign:
        # Deserialize for API response
        if campaign.demographics:
            campaign.demographics = campaign.demographics.split(",")
        else:
            campaign.demographics = []
        if campaign.interests:
            campaign.interests = campaign.interests.split(",")
        else:
            campaign.interests = []
    return campaign

async def get_campaigns(db: Session, *, company_id: uuid.UUID, skip: int = 0, limit: int = 100) -> List[Campaign]:
    result = await db.execute(
        select(Campaign).options(selectinload(Campaign.utm_links)).filter(Campaign.company_id == company_id).offset(skip).limit(limit)
    )
    campaigns = result.scalars().all()
    for campaign in campaigns:
        if campaign.demographics:
            campaign.demographics = campaign.demographics.split(",")
        else:
            campaign.demographics = []
        if campaign.interests:
            campaign.interests = campaign.interests.split(",")
        else:
            campaign.interests = []
    return campaigns

async def update_campaign(db: Session, *, db_campaign: Campaign, campaign_in: CampaignUpdate) -> Campaign:
    update_data = campaign_in.model_dump(exclude_unset=True)
    # Serialize demographics and interests as comma-separated strings
    if "demographics" in update_data:
        update_data["demographics"] = ",".join(update_data["demographics"]) if update_data["demographics"] is not None else None
    if "interests" in update_data:
        update_data["interests"] = ",".join(update_data["interests"]) if update_data["interests"] is not None else None
    for field, value in update_data.items():
        setattr(db_campaign, field, value)
    db.add(db_campaign)
    await db.commit()
    await db.refresh(db_campaign)
    # Deserialize for API response
    if db_campaign.demographics:
        db_campaign.demographics = db_campaign.demographics.split(",")
    else:
        db_campaign.demographics = []
    if db_campaign.interests:
        db_campaign.interests = db_campaign.interests.split(",")
    else:
        db_campaign.interests = []
    return db_campaign

async def delete_campaign(db: Session, *, db_campaign: Campaign) -> Campaign:
    await db.delete(db_campaign)
    await db.commit()
    return db_campaign

async def duplicate_campaign(db: Session, *, campaign_id: uuid.UUID, company_id: uuid.UUID) -> Optional[Campaign]:
    original_campaign = await get_campaign(db=db, campaign_id=campaign_id, company_id=company_id)
    if not original_campaign:
        return None
    
    new_campaign_data = CampaignCreate(
        name=f"{original_campaign.name} (Copy)",
        status='draft',
        budget_info=original_campaign.budget_info
    )
    
    return await create_campaign(db=db, campaign_in=new_campaign_data, company_id=company_id) 
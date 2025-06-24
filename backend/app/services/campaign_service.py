from sqlalchemy.orm import Session
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
import uuid
from typing import List, Optional

from app.models.campaign import Campaign
from app.schemas.campaign import CampaignCreate, CampaignUpdate

async def create_campaign(db: Session, *, campaign_in: CampaignCreate, company_id: uuid.UUID) -> Campaign:
    db_campaign = Campaign(**campaign_in.model_dump(), company_id=company_id)
    db.add(db_campaign)
    await db.commit()
    await db.refresh(db_campaign)
    return db_campaign

async def get_campaign(db: Session, *, campaign_id: uuid.UUID, company_id: uuid.UUID) -> Optional[Campaign]:
    result = await db.execute(
        select(Campaign).filter(Campaign.id == campaign_id, Campaign.company_id == company_id)
    )
    return result.scalars().first()

async def get_campaigns(db: Session, *, company_id: uuid.UUID, skip: int = 0, limit: int = 100) -> List[Campaign]:
    result = await db.execute(
        select(Campaign).options(selectinload(Campaign.utm_links)).filter(Campaign.company_id == company_id).offset(skip).limit(limit)
    )
    # To analyze performance, run EXPLAIN ANALYZE on this query in psql or your DB tool.
    return result.scalars().all()

async def update_campaign(db: Session, *, db_campaign: Campaign, campaign_in: CampaignUpdate) -> Campaign:
    update_data = campaign_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_campaign, field, value)
    db.add(db_campaign)
    await db.commit()
    await db.refresh(db_campaign)
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
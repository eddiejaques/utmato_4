from sqlalchemy.orm import Session
import uuid
from typing import List, Optional

from app.models.campaign import Campaign
from app.schemas.campaign import CampaignCreate, CampaignUpdate

def create_campaign(db: Session, *, campaign_in: CampaignCreate, company_id: uuid.UUID) -> Campaign:
    db_campaign = Campaign(**campaign_in.dict(), company_id=company_id)
    db.add(db_campaign)
    db.commit()
    db.refresh(db_campaign)
    return db_campaign

def get_campaign(db: Session, *, campaign_id: uuid.UUID, company_id: uuid.UUID) -> Optional[Campaign]:
    return db.query(Campaign).filter(Campaign.id == campaign_id, Campaign.company_id == company_id).first()

def get_campaigns(db: Session, *, company_id: uuid.UUID, skip: int = 0, limit: int = 100) -> List[Campaign]:
    return db.query(Campaign).filter(Campaign.company_id == company_id).offset(skip).limit(limit).all()

def update_campaign(db: Session, *, db_campaign: Campaign, campaign_in: CampaignUpdate) -> Campaign:
    update_data = campaign_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_campaign, field, value)
    db.add(db_campaign)
    db.commit()
    db.refresh(db_campaign)
    return db_campaign

def delete_campaign(db: Session, *, db_campaign: Campaign) -> Campaign:
    db.delete(db_campaign)
    db.commit()
    return db_campaign 
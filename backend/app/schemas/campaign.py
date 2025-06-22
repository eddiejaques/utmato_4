from pydantic import BaseModel, Field
import uuid
from typing import Optional, Dict, Any
from datetime import datetime
from .enums import CampaignStatus

class CampaignBase(BaseModel):
    name: str
    status: CampaignStatus = CampaignStatus.DRAFT
    budget_info: Optional[Dict[str, Any]] = None

class CampaignCreate(CampaignBase):
    pass

class CampaignUpdate(BaseModel):
    name: Optional[str] = None
    status: Optional[CampaignStatus] = None
    budget_info: Optional[Dict[str, Any]] = None

class CampaignResponse(CampaignBase):
    id: uuid.UUID
    company_id: uuid.UUID
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True 
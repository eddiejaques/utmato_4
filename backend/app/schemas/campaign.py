from pydantic import BaseModel, ConfigDict
import uuid
from typing import Optional, Dict, Any
from datetime import datetime
from .enums import CampaignStatus

# Fields shared by all campaign-related schemas
class CampaignBase(BaseModel):
    name: Optional[str] = None
    status: Optional[CampaignStatus] = None
    budget_info: Optional[Dict[str, Any]] = None
    demographics: Optional[list[str]] = None
    interests: Optional[list[str]] = None
    audiences: Optional[list[str]] = None

# Schema for creating a new campaign. Name is required.
class CampaignCreate(CampaignBase):
    name: str
    status: CampaignStatus = CampaignStatus.DRAFT

# Schema for updating an existing campaign. All fields are optional.
class CampaignUpdate(CampaignBase):
    pass

# Schema for the response model. Includes all database fields.
class CampaignResponse(CampaignCreate):
    id: uuid.UUID
    company_id: uuid.UUID
    demographics: Optional[list[str]] = None
    interests: Optional[list[str]] = None
    audiences: Optional[list[str]] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True) 
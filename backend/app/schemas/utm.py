from pydantic import BaseModel, HttpUrl, ConfigDict
from typing import Optional
import uuid
from datetime import datetime

class URLValidationRequest(BaseModel):
    url: str

class URLValidationResponse(BaseModel):
    is_valid: bool
    message: str
    validated_url: Optional[HttpUrl] = None

# Base schema for UTM link properties
class UTMLinkBase(BaseModel):
    destination_url: HttpUrl
    utm_source: str
    utm_medium: str
    utm_term: Optional[str] = None
    utm_content: Optional[str] = None

# Schema for creating a new UTM link.
class UTMLinkCreate(UTMLinkBase):
    campaign_id: uuid.UUID

# Schema for the response model, including all database fields.
class UTMLinkResponse(UTMLinkBase):
    id: uuid.UUID
    campaign_id: uuid.UUID
    utm_campaign: str
    generated_url: HttpUrl
    click_count: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True) 
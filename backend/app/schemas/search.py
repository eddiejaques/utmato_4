from typing import List, Optional
from pydantic import BaseModel, HttpUrl

from .campaign import CampaignResponse
from .utm import UTMLinkResponse

class SearchResultResponse(BaseModel):
    campaigns: List[CampaignResponse]
    utm_links: List[UTMLinkResponse]

class ReverseUTMLookupRequest(BaseModel):
    url: HttpUrl

class ReverseUTMLookupResponse(BaseModel):
    utm_link: Optional[UTMLinkResponse] = None
    campaign: Optional[CampaignResponse] = None 
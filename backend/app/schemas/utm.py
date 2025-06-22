from pydantic import BaseModel, HttpUrl
from typing import Optional

class URLValidationRequest(BaseModel):
    url: str

class URLValidationResponse(BaseModel):
    is_valid: bool
    message: str
    validated_url: Optional[HttpUrl] = None 
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Literal

class ClerkEmail(BaseModel):
    id: str
    email_address: EmailStr

class ClerkUser(BaseModel):
    id: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email_addresses: List[ClerkEmail]
    image_url: Optional[str] = None
    
class ClerkUserData(BaseModel):
    id: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email_addresses: List[ClerkEmail]
    image_url: Optional[str] = None
    
class ClerkDeletedUserData(BaseModel):
    id: str
    deleted: bool

class ClerkWebhookEvent(BaseModel):
    type: Literal['user.created', 'user.updated', 'user.deleted']
    data: dict

class ClerkUserCreatedEvent(BaseModel):
    data: ClerkUserData
    object: Literal['event']
    type: Literal['user.created']
    
class ClerkUserUpdatedEvent(BaseModel):
    data: ClerkUserData
    object: Literal['event']
    type: Literal['user.updated']

class ClerkUserDeletedEvent(BaseModel):
    data: ClerkDeletedUserData
    object: Literal['event']
    type: Literal['user.deleted'] 
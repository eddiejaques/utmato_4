from pydantic import BaseModel, EmailStr
from uuid import UUID
from typing import Optional
from app.schemas.enums import UserRole, InviteStatus

class InvitationBase(BaseModel):
    email: EmailStr
    role: UserRole
    company_id: UUID

class InvitationCreate(InvitationBase):
    pass

class InvitationResponse(InvitationBase):
    id: UUID
    status: InviteStatus
    token: str

    class Config:
        from_attributes = True

class InvitationAcceptRequest(BaseModel):
    token: str
    password: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None

class InvitationRejectRequest(BaseModel):
    token: str

class InvitationStatusResponse(BaseModel):
    status: InviteStatus
    message: str 
from pydantic import BaseModel
from uuid import UUID
from .enums import UserRole

class CurrentUser(BaseModel):
    id: UUID
    clerk_id: str
    email: str
    role: UserRole
    company_id: UUID

    class Config:
        orm_mode = True 
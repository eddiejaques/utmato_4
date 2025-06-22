from pydantic import BaseModel, EmailStr
from typing import Optional
from uuid import UUID
from .enums import UserRole

from app.models.company import Company as CompanyModel
from app.models.user import User as UserModel

# Base Schemas
class UserBase(BaseModel):
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None

class CompanyBase(BaseModel):
    name: str
    domain: str

# Request Schemas
class UserSyncRequest(BaseModel):
    clerk_id: str
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None

# Response Schemas
class UserResponse(UserBase):
    id: UUID
    clerk_id: str
    company_id: Optional[UUID] = None

    class Config:
        from_attributes = True

class CompanyResponse(CompanyBase):
    id: UUID

    class Config:
        from_attributes = True

class UserSyncResponse(BaseModel):
    user: UserResponse
    company: Optional[CompanyResponse] = None

# For Dependency Injection
class CurrentUser(BaseModel):
    id: UUID
    clerk_id: str
    email: EmailStr
    company_id: Optional[UUID] = None
    company_domain: Optional[str] = None

    @classmethod
    def from_orm(cls, user: UserModel, company: Optional[CompanyModel]):
        return cls(
            id=user.id,
            clerk_id=user.clerk_id,
            email=user.email,
            company_id=user.company_id,
            company_domain=company.domain if company else None,
        )

    class Config:
        orm_mode = True 
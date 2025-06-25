from pydantic import BaseModel
from uuid import UUID

class TeamMembershipBase(BaseModel):
    user_id: UUID
    company_id: UUID
    role_id: UUID

class TeamMembershipCreate(TeamMembershipBase):
    pass

class TeamMembershipResponse(TeamMembershipBase):
    id: UUID

    class Config:
        from_attributes = True 
from sqlalchemy import Column, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from app.db.base_class import Base

class TeamMembership(Base):
    """Association table for users and companies with roles."""
    __tablename__ = "team_memberships"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True, doc="Primary key (UUID)")
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, doc="Foreign key to user")
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id"), nullable=False, doc="Foreign key to company")
    role_id = Column(UUID(as_uuid=True), ForeignKey("roles.id"), nullable=False, doc="Foreign key to role")

    user = relationship("User", back_populates="team_memberships")
    company = relationship("Company", back_populates="team_memberships")
    role = relationship("Role") 
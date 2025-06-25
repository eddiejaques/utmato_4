from sqlalchemy import Column, String, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from app.db.base_class import Base
from app.schemas.enums import UserRole, InviteStatus

class Invitation(Base):
    """Invitation for a user to join a company."""
    __tablename__ = "invitations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True, doc="Primary key (UUID)")
    email = Column(String, nullable=False, index=True, doc="Email address of the invitee")
    role = Column(Enum(UserRole), nullable=False, doc="Role to be assigned upon acceptance")
    status = Column(Enum(InviteStatus), nullable=False, default=InviteStatus.PENDING, doc="Status of the invitation")
    token = Column(String, nullable=False, unique=True, doc="Unique invitation token")
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id"), nullable=False, doc="Foreign key to company")

    company = relationship("Company", back_populates="invitations") 
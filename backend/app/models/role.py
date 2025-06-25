from sqlalchemy import Column, String
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.db.base_class import Base

class Role(Base):
    """Role definition for team members."""
    __tablename__ = "roles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True, doc="Primary key (UUID)")
    name = Column(String, unique=True, nullable=False, doc="Role name (Manager, Team Member, Viewer)") 
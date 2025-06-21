import uuid
from sqlalchemy import Column, String, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.db.base_class import Base

class Company(Base):
    __tablename__ = "companies"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False, unique=True)
    domain = Column(String, nullable=False, unique=True)
    settings = Column(JSON, nullable=True)

    users = relationship("User", back_populates="company")
    campaigns = relationship("Campaign", back_populates="company") 
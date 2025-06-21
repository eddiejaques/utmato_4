import uuid
from sqlalchemy import Column, String, ForeignKey, Integer, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.db.base import Base

class UTMLink(Base):
    __tablename__ = "utm_links"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    campaign_id = Column(UUID(as_uuid=True), ForeignKey("campaigns.id"), nullable=False)
    
    destination_url = Column(String, nullable=False)
    utm_source = Column(String, nullable=False)
    utm_medium = Column(String, nullable=False)
    utm_campaign = Column(String, nullable=False)
    utm_term = Column(String, nullable=True)
    utm_content = Column(String, nullable=True)
    
    generated_url = Column(String, nullable=False)
    click_count = Column(Integer, default=0)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    campaign = relationship("Campaign", back_populates="utm_links") 
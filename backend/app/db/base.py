# Import all the models, so that Base has them before being
# imported by Alembic
from app.models.company import Company
from app.models.user import User
from app.models.campaign import Campaign
from app.models.utm_link import UTMLink
from sqlalchemy.orm import declarative_base

Base = declarative_base() 
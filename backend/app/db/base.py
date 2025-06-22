# Import all the models, so that Base has them registered automatically
from app.models.user import User  # noqa
from app.models.company import Company  # noqa
from app.models.campaign import Campaign  # noqa
from app.models.utm_link import UTMLink  # noqa
from app.db.base_class import Base  # noqa 
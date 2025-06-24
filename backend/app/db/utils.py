from sqlalchemy.orm import selectinload

def with_campaign_utm_links(query):
    """Apply selectinload for Campaign.utm_links relationship."""
    return query.options(selectinload('utm_links'))

def with_utm_link_campaign(query):
    """Apply selectinload for UTMLink.campaign relationship."""
    return query.options(selectinload('campaign')) 
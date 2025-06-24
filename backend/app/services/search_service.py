from urllib.parse import urlparse, parse_qs
from sqlalchemy.orm import Session, selectinload
from sqlalchemy import func, or_

from app.models.campaign import Campaign
from app.models.utm_link import UTMLink
from app.schemas.search import ReverseUTMLookupResponse
from app.services.campaign_service import get_campaign

async def search_campaigns_and_utms(db: Session, company_id: int, query: str):
    search_query = func.to_tsquery('english', query)

    # Use selectinload for campaign relationships to avoid N+1
    campaigns_tsvector = func.to_tsvector('english', func.coalesce(Campaign.name, '') + ' ' + func.coalesce(Campaign.demographics, '') + ' ' + func.coalesce(Campaign.interests, ''))
    campaigns = db.query(Campaign).options(selectinload(Campaign.utm_links)).filter(
        Campaign.company_id == company_id,
        campaigns_tsvector.match(search_query)
    ).all()

    utm_links_tsvector = func.to_tsvector('english', func.coalesce(UTMLink.source, '') + ' ' + func.coalesce(UTMLink.medium, '') + ' ' + func.coalesce(UTMLink.content, ''))
    utm_links = db.query(UTMLink).join(Campaign).options(selectinload(UTMLink.campaign)).filter(
        Campaign.company_id == company_id,
        utm_links_tsvector.match(search_query)
    ).all()

    # To analyze performance, run EXPLAIN ANALYZE on these queries in psql or your DB tool.
    return {"campaigns": campaigns, "utm_links": utm_links}

async def reverse_utm_lookup(db: Session, company_id: int, url: str) -> ReverseUTMLookupResponse:
    parsed_url = urlparse(url)
    query_params = parse_qs(parsed_url.query)

    utm_source = query_params.get('utm_source', [None])[0]
    utm_medium = query_params.get('utm_medium', [None])[0]
    utm_campaign = query_params.get('utm_campaign', [None])[0]
    utm_content = query_params.get('utm_content', [None])[0]
    utm_term = query_params.get('utm_term', [None])[0]

    utm_link_query = db.query(UTMLink).join(Campaign).filter(Campaign.company_id == company_id)

    filters = []
    if utm_source:
        filters.append(UTMLink.source == utm_source)
    if utm_medium:
        filters.append(UTMLink.medium == utm_medium)
    if utm_campaign:
        # Assuming utm_campaign parameter in URL corresponds to campaign's name or a specific slug
        # This might need adjustment based on how campaign identifier is used in UTM links.
        # For now, let's assume it can match the campaign ID directly if it's numeric.
        campaign_filter = or_(Campaign.name == utm_campaign)
        if utm_campaign.isdigit():
            campaign_filter = or_(campaign_filter, Campaign.id == int(utm_campaign))
        
        utm_link_query = utm_link_query.filter(UTMLink.campaign.has(campaign_filter))

    if utm_content:
        filters.append(UTMLink.content == utm_content)
    if utm_term:
        filters.append(UTMLink.term == utm_term)

    if not filters:
        return ReverseUTMLookupResponse()

    utm_link = utm_link_query.filter(*filters).first()
    
    if not utm_link:
        return ReverseUTMLookupResponse()

    campaign = await get_campaign(db, utm_link.campaign_id, company_id)

    return ReverseUTMLookupResponse(utm_link=utm_link, campaign=campaign) 
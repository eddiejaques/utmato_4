import socket
from urllib.parse import urlparse
import validators
from pydantic import HttpUrl, ValidationError
from typing import Optional, Tuple
from sqlalchemy.orm import Session, selectinload
from sqlalchemy import select
from fastapi import HTTPException, status
import uuid

from app.schemas.utm import UTMLinkCreate
from app.schemas.user import CurrentUser
from app.models.user import User
from app.models.campaign import Campaign
from app.models.utm_link import UTMLink
from app.utils.utm_builder import build_utm_url

MALICIOUS_DOMAINS = {
    "malicious.com",
    "phishing-site.net",
    "scam-domain.org",
}

def validate_url(url: str) -> dict:
    """
    Validates a URL using a series of checks.
    """
    if not isinstance(url, str) or not validators.url(url):
        return {"is_valid": False, "message": "URL format is invalid."}

    parsed_url = urlparse(url)
    domain = parsed_url.netloc

    if not domain:
        return {"is_valid": False, "message": "Could not determine domain from URL."}

    try:
        socket.gethostbyname(domain)
    except socket.gaierror:
        return {"is_valid": False, "message": "Domain does not exist (DNS lookup failed)."}

    if domain in MALICIOUS_DOMAINS:
        return {"is_valid": False, "message": "URL is from a known malicious domain."}

    return {"is_valid": True, "message": "URL is valid."}

def validate_url_with_correction(url_str: str) -> Tuple[bool, str, Optional[HttpUrl]]:
    """
    Validates a URL against a set of checks, with correction attempts.

    Args:
        url_str: The URL string to validate.

    Returns:
        A tuple containing a boolean indicating if the URL is valid,
        a message, and an optional corrected URL.
    """
    validated_url: Optional[HttpUrl] = None
    
    try:
        # First attempt to validate the URL as is
        url = HttpUrl(url_str)
    except ValidationError:
        # If validation fails, try to correct it by adding a scheme
        if not url_str.startswith(('http://', 'https://')):
            corrected_url_str = f"https://{url_str}"
            try:
                url = HttpUrl(corrected_url_str)
                validated_url = url
            except ValidationError:
                return False, "Invalid URL format.", None
        else:
            return False, "Invalid URL format.", None

    parsed_url = urlparse(str(url))
    domain = parsed_url.netloc

    if not domain:
        return False, "Invalid URL format, cannot extract domain.", None

    if not validators.domain(domain):
        return False, "Invalid domain format.", None

    if domain in MALICIOUS_DOMAINS:
        return False, "URL is from a known malicious domain.", None

    try:
        socket.gethostbyname(domain)
    except socket.gaierror:
        return False, "Domain does not exist (DNS lookup failed).", None

    if validated_url:
        return True, "URL is valid and has been corrected.", validated_url
    
    return True, "URL is valid.", url 

async def generate_single_utm_link(db: Session, *, link_data: UTMLinkCreate, user: CurrentUser) -> UTMLink:
    """
    Generates a single UTM link, saves it to the database, and associates it with a campaign.

    Args:
        db: The database session.
        link_data: The Pydantic schema containing the UTM link data.
        user: The currently authenticated user.

    Returns:
        The created UTMLink object.
        
    Raises:
        HTTPException: If the campaign is not found or the user is not authorized.
    """
    stmt = select(Campaign).where(Campaign.id == link_data.campaign_id)
    result = await db.execute(stmt)
    campaign = result.scalars().first()

    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found.",
        )
    
    # Authorization check: Ensure the campaign belongs to the user's company
    if campaign.company_id != user.company_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to create a link for this campaign.",
        )

    utm_params = {
        "utm_source": link_data.utm_source,
        "utm_medium": link_data.utm_medium,
        "utm_campaign": campaign.name,
        "utm_term": link_data.utm_term,
        "utm_content": link_data.utm_content,
    }

    generated_url = build_utm_url(str(link_data.destination_url), utm_params)

    db_utm_link = UTMLink(
        destination_url=str(link_data.destination_url),
        generated_url=generated_url,
        campaign_id=link_data.campaign_id,
        utm_source=link_data.utm_source,
        utm_medium=link_data.utm_medium,
        utm_campaign=campaign.name, # Storing campaign name for easier querying
        utm_term=link_data.utm_term,
        utm_content=link_data.utm_content,
    )

    db.add(db_utm_link)
    await db.commit()
    await db.refresh(db_utm_link)

    return db_utm_link 

async def get_utm_links_for_campaign(db: Session, *, campaign_id: uuid.UUID, user: CurrentUser) -> list[UTMLink]:
    """
    Retrieves all UTM links for a specific campaign.

    Args:
        db: The database session.
        campaign_id: The ID of the campaign.
        user: The currently authenticated user.

    Returns:
        A list of UTMLink objects.
        
    Raises:
        HTTPException: If the campaign is not found or the user is not authorized.
    """
    stmt = select(Campaign).where(Campaign.id == campaign_id)
    result = await db.execute(stmt)
    campaign = result.scalars().first()

    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found.",
        )
    
    if campaign.company_id != user.company_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to view links for this campaign.",
        )

    # Use selectinload for UTM link relationships to avoid N+1
    stmt = select(UTMLink).options(selectinload(UTMLink.campaign)).where(UTMLink.campaign_id == campaign_id)
    result = await db.execute(stmt)
    utm_links = result.scalars().all()

    # To analyze performance, run EXPLAIN ANALYZE on this query in psql or your DB tool.
    return utm_links 
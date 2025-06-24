from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_user
from app.dependencies.db import get_db
from app.models.user import User
from app.schemas.search import SearchResultResponse, ReverseUTMLookupRequest, ReverseUTMLookupResponse
from app.services import search_service

router = APIRouter()

@router.get("/", response_model=SearchResultResponse)
async def search(
    query: str = Query(..., min_length=1, description="Search query for campaigns and UTM links"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Performs a full-text search across campaigns and UTM links for the user's company.
    """
    if not query or len(query.strip()) == 0:
        raise HTTPException(status_code=400, detail="Query parameter is required.")
    results = await search_service.search_campaigns_and_utms(db, company_id=current_user.company_id, query=query)
    return results

@router.post("/reverse-utm", response_model=ReverseUTMLookupResponse)
async def reverse_utm_lookup(
    request: ReverseUTMLookupRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Looks up a campaign and UTM link by a given URL containing UTM parameters.
    """
    if not request.url:
        raise HTTPException(status_code=422, detail="URL is required for reverse UTM lookup.")
    result = await search_service.reverse_utm_lookup(db, company_id=current_user.company_id, url=str(request.url))
    if not result.utm_link:
        raise HTTPException(status_code=404, detail="UTM link not found for the provided URL.")
    return result 
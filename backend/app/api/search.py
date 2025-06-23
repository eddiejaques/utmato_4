from fastapi import APIRouter, Depends, Query
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
    result = await search_service.reverse_utm_lookup(db, company_id=current_user.company_id, url=str(request.url))
    return result 
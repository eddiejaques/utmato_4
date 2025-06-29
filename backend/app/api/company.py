from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user, get_current_company, require_manager
from app.schemas.user import CurrentUser
from app.services import company_service
from typing import List, Dict, Optional
from uuid import UUID

from pydantic import BaseModel

router = APIRouter()

class CompanyDefaultsResponse(BaseModel):
    interests: List[str]
    audiences: List[str]

class CompanyDefaultsUpdateRequest(BaseModel):
    interests: Optional[List[str]] = None
    audiences: Optional[List[str]] = None

@router.get(
    "/defaults",
    response_model=CompanyDefaultsResponse,
    status_code=status.HTTP_200_OK,
)
async def get_company_defaults(
    db: AsyncSession = Depends(get_db),
    current_user: CurrentUser = Depends(require_manager),
    company=Depends(get_current_company),
):
    defaults = await company_service.get_company_defaults(db, company.id)
    return CompanyDefaultsResponse(**defaults)

@router.put(
    "/defaults",
    response_model=CompanyDefaultsResponse,
    status_code=status.HTTP_200_OK,
)
async def update_company_defaults(
    req: CompanyDefaultsUpdateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: CurrentUser = Depends(require_manager),
    company=Depends(get_current_company),
):
    try:
        updated = await company_service.update_company_defaults(db, company.id, req.interests, req.audiences)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    return CompanyDefaultsResponse(**updated) 
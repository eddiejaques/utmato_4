from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.company import Company
from uuid import UUID
from typing import Optional, List, Dict

async def get_company_defaults(db: AsyncSession, company_id: UUID) -> Dict[str, List[str]]:
    result = await db.execute(select(Company).where(Company.id == company_id))
    company = result.scalar_one_or_none()
    if not company:
        return {"interests": [], "audiences": []}
    settings = company.settings or {}
    return {
        "interests": settings.get("default_interests", []),
        "audiences": settings.get("default_audiences", []),
    }

async def update_company_defaults(db: AsyncSession, company_id: UUID, interests: Optional[List[str]], audiences: Optional[List[str]]) -> Dict[str, List[str]]:
    result = await db.execute(select(Company).where(Company.id == company_id))
    company = result.scalar_one_or_none()
    if not company:
        raise ValueError("Company not found")
    settings = company.settings or {}
    if interests is not None:
        settings["default_interests"] = interests
    if audiences is not None:
        settings["default_audiences"] = audiences
    company.settings = settings
    await db.commit()
    await db.refresh(company)
    return {
        "interests": settings.get("default_interests", []),
        "audiences": settings.get("default_audiences", []),
    } 
from fastapi import FastAPI, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.middleware.auth_middleware import RLSAuthMiddleware
from app.dependencies import get_db
# Example imports for a protected route
from app.models.company import Company
from sqlalchemy.future import select

app = FastAPI()

# Add RLS middleware
app.add_middleware(RLSAuthMiddleware)


@app.get("/")
def read_root():
    return {"message": "UTMato API is running"}


@app.get("/api/v1/companies")
async def list_companies(db: AsyncSession = Depends(get_db)):
    """
    Example of a protected route.
    With RLS enabled, this will only return companies matching
    the company_id set in the session by the middleware.
    """
    result = await db.execute(select(Company))
    companies = result.scalars().all()
    return companies 
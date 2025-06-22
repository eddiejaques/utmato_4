# This import is crucial for SQLAlchemy to discover all models
from app.db import base  # noqa

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from app.api import webhooks
from app.api import users  # Import the new users router
from app.middleware.auth_middleware import AuthMiddleware
from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user
# Example imports for a protected route
from app.models.company import Company
from app.schemas.user import CurrentUser
from sqlalchemy.future import select

app = FastAPI()

# CORS Middleware
origins = [
    "http://localhost:3000",
    # Add other origins if needed, e.g., your production frontend URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add RLS middleware
app.add_middleware(AuthMiddleware)

app.include_router(webhooks.router, prefix="/api/v1/webhooks", tags=["webhooks"])
app.include_router(users.router, prefix="/api/v1/users", tags=["users"])

@app.get("/")
def read_root():
    return {"message": "UTMato API is running"}


@app.get("/api/v1/companies")
async def list_companies(
    db: AsyncSession = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    """
    Example of a protected route.
    With RLS enabled, this will only return companies matching
    the company_id set in the session by the middleware.
    """
    result = await db.execute(select(Company))
    companies = result.scalars().all()
    return companies 
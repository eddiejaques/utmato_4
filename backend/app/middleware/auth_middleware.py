import logging
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseFunction
from starlette.requests import Request
from starlette.responses import Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.db.database import SessionLocal
from app.models.user import User

logger = logging.getLogger(__name__)

async def get_user_company_id(clerk_id: str, db: AsyncSession) -> str | None:
    """Fetch the company_id for a given clerk_id."""
    if not clerk_id:
        return None
    try:
        result = await db.execute(select(User).filter(User.clerk_id == clerk_id))
        user = result.scalars().first()
        if user:
            return str(user.company_id)
    except Exception as e:
        logger.error(f"Could not fetch user company_id: {e}")
    return None


class RLSAuthMiddleware(BaseHTTPMiddleware):
    """
    Middleware to implement Row-Level Security.
    It sets a company_id in the database session for the current request.
    """
    async def dispatch(
        self, request: Request, call_next: RequestResponseFunction
    ) -> Response:
        clerk_user_id = request.headers.get("x-clerk-user-id")
        
        db_session: AsyncSession = SessionLocal()
        
        try:
            if clerk_user_id:
                company_id = await get_user_company_id(clerk_user_id, db_session)
                if company_id:
                    # Set company_id for RLS within the transaction
                    await db_session.execute(f"SET app.current_company_id = '{company_id}'")
            
            request.state.db = db_session
            response = await call_next(request)
        finally:
            await db_session.close()
            
        return response 
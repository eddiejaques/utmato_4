import logging
from typing import Callable, Awaitable
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
from fastapi_clerk_auth import ClerkConfig, ClerkHTTPBearer
from sqlalchemy import text
from sqlalchemy.sql import select

from app.core.config import settings
from app.db.database import SessionLocal
from app.services.user_service import get_user_by_clerk_id
from app.models.user import User  # For type hinting if needed
from app.models.company import Company

logger = logging.getLogger(__name__)

# Configure Clerk
clerk_config = ClerkConfig(
    jwks_url=f"https://{settings.CLERK_ISSUER_URL}/.well-known/jwks.json"
    if settings.CLERK_ISSUER_URL
    else "",
    auto_error=False,  # Allow public routes, auth is checked by dependencies
)
clerk_auth_guard = ClerkHTTPBearer(config=clerk_config)

# Paths that DO NOT require user lookup and RLS setup in the middleware.
# These might be fully public, or they might handle their own authorization.
AUTH_BYPASS_PATHS = ["/", "/docs", "/openapi.json", "/redoc", "/api/v1/webhooks/clerk", "/api/v1/users/sync"]

class AuthMiddleware(BaseHTTPMiddleware):
    """
    Middleware to:
    1. Manage DB session lifecycle for each request.
    2. For protected routes, validate Clerk JWT, find the user in DB, and set RLS.
    """

    async def dispatch(
        self, request: Request, call_next: Callable[[Request], Awaitable[Response]]
    ) -> Response:
        # Create a new session for each request
        async with SessionLocal() as db_session:
            request.state.db = db_session
            try:
                # Check if the current path should bypass the main auth logic
                bypass_auth = any(request.url.path.startswith(path) for path in AUTH_BYPASS_PATHS)

                if not bypass_auth:
                    credentials = await clerk_auth_guard(request)
                    if credentials:
                        clerk_id = credentials.decoded.get("sub")
                        if clerk_id:
                            # get_user_by_clerk_id is async and uses the session
                            user = await get_user_by_clerk_id(db_session, clerk_id)
                            if user:
                                request.state.user = user
                                company = user.company
                                # If relationship is not loaded, but the FK exists, fetch it directly
                                if not company and user.company_id:
                                    company_result = await db_session.execute(
                                        select(Company).filter(Company.id == user.company_id)
                                    )
                                    company = company_result.scalars().first()

                                if company:
                                    request.state.company = company
                                    # Set company_id for RLS within the transaction
                                    await db_session.execute(
                                        text(f"SET app.current_company_id = '{company.id}'")
                                    )

                response = await call_next(request)
            except Exception as e:
                logger.error(f"Error in auth middleware: {e}")
                # Rollback in case of error
                await db_session.rollback()
                # Ensure we send a response even if an error occurs
                response = Response("Internal Server Error", status_code=500)
            
            return response 
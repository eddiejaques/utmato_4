import logging
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseFunction
from starlette.requests import Request
from starlette.responses import Response
from fastapi_clerk_auth import ClerkConfig, ClerkHTTPBearer

from app.core.config import settings
from app.db.database import SessionLocal
from app.services.user_service import get_user_by_clerk_id
from app.models.user import User  # For type hinting if needed

logger = logging.getLogger(__name__)

# Configure Clerk
clerk_config = ClerkConfig(
    jwks_url=f"https://{settings.CLERK_FRONTEND_API}/.well-known/jwks.json"
    if settings.CLERK_FRONTEND_API
    else "",
    auto_error=False,  # Allow public routes, auth is checked by dependencies
)
clerk_auth_guard = ClerkHTTPBearer(config=clerk_config)


class AuthMiddleware(BaseHTTPMiddleware):
    """
    Authentication middleware that validates Clerk JWTs,
    and sets user and company context on the request state.
    It also sets the company_id for RLS in the database session.
    """

    async def dispatch(
        self, request: Request, call_next: RequestResponseFunction
    ) -> Response:
        db_session = SessionLocal()
        request.state.db = db_session

        try:
            # Skip auth for webhook endpoint
            if request.url.path.startswith("/api/v1/webhooks/"):
                 response = await call_next(request)
                 return response
                 
            credentials = await clerk_auth_guard(request)

            if credentials:
                clerk_id = credentials.decoded.get("sub")
                if clerk_id:
                    user = await get_user_by_clerk_id(db_session, clerk_id)
                    if user:
                        request.state.user = user
                        company = user.company
                        if company:
                            request.state.company = company
                            # Set company_id for RLS within the transaction
                            await db_session.execute(
                                f"SET app.current_company_id = '{company.id}'"
                            )

            response = await call_next(request)

        except Exception as e:
            logger.error(f"Error in auth middleware: {e}")
            # Ensure we send a response even if an error occurs
            response = Response("Internal Server Error", status_code=500)
        finally:
            await db_session.close()

        return response 
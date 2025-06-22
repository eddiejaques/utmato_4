import logging
import os
from typing import Callable, Awaitable
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response, JSONResponse
from sqlalchemy import text
from sqlalchemy.sql import select
import httpx
from clerk_backend_api import Clerk
from clerk_backend_api.security.types import AuthenticateRequestOptions

from app.db.database import SessionLocal
from app.services.user_service import get_user_by_clerk_id
from app.models.company import Company

logger = logging.getLogger(__name__)

# Paths that DO NOT require authentication.
AUTH_BYPASS_PATHS = ["/", "/docs", "/openapi.json", "/redoc", "/api/v1/webhooks/clerk"]

class AuthMiddleware(BaseHTTPMiddleware):
    """
    Middleware to:
    1. Manage DB session lifecycle for each request.
    2. For protected routes, validate Clerk JWT, find the user in DB, and set RLS.
    """

    async def dispatch(
        self, request: Request, call_next: Callable[[Request], Awaitable[Response]]
    ) -> Response:
        # Let OPTIONS requests pass through without auth checks for CORS preflight
        if request.method == "OPTIONS":
            return await call_next(request)

        # Check if the current path should bypass authentication
        path = request.url.path
        if path in AUTH_BYPASS_PATHS or any(path.startswith(p) for p in AUTH_BYPASS_PATHS if p != "/"):
            return await call_next(request)

        try:
            clerk_client = Clerk(bearer_auth=os.environ.get("CLERK_SECRET_KEY"))
            
            # The SDK expects an httpx.Request. We can build one from the Starlette request.
            # The body is not needed for Bearer token authentication.
            httpx_request = httpx.Request(
                method=request.method,
                url=str(request.url),
                headers=request.headers,
            )

            request_state = clerk_client.authenticate_request(
                httpx_request,
                AuthenticateRequestOptions()
            )

            if not (request_state.is_signed_in and request_state.payload):
                return JSONResponse(
                    status_code=401,
                    content={"detail": f"Invalid token: {request_state.reason}"},
                )

            payload = request_state.payload
            clerk_id = payload.get("sub")

            if not clerk_id:
                return JSONResponse(status_code=401, content={"detail": "Invalid token: No 'sub' claim in payload"})

            async with SessionLocal() as db_session:
                request.state.db = db_session
                user = await get_user_by_clerk_id(db_session, clerk_id)
                
                if not user:
                    return JSONResponse(status_code=401, content={"detail": "User not found"})

                request.state.user = user
                company = user.company
                if not company and user.company_id:
                    company_result = await db_session.execute(
                        select(Company).filter(Company.id == user.company_id)
                    )
                    company = company_result.scalars().first()

                if not company:
                    return JSONResponse(status_code=403, content={"detail": "User not associated with a company"})

                request.state.company = company
                await db_session.execute(
                    text(f"SET app.current_company_id = '{company.id}'")
                )
                
                response = await call_next(request)
                return response

        except Exception as e:
            logger.error(f"Authentication error: {e}")
            return JSONResponse(status_code=401, content={"detail": f"Invalid token: {e}"}) 
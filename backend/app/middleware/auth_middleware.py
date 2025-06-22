import logging
import httpx
from typing import Callable, Awaitable, Dict, Any, List
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response, JSONResponse
from sqlalchemy import text
from sqlalchemy.sql import select
from jose import jwt, jwk
from jose.exceptions import JWTError, JWKError

from app.db.database import SessionLocal
from app.services.user_service import get_user_by_clerk_id
from app.models.company import Company
from app.core.config import settings

logger = logging.getLogger(__name__)

# Paths that DO NOT require authentication.
AUTH_BYPASS_PATHS = ["/", "/docs", "/openapi.json", "/redoc", "/api/v1/webhooks/clerk", "/api/v1/utm/validate-url"]

class AuthMiddleware(BaseHTTPMiddleware):
    """
    Middleware to:
    1. Manage DB session lifecycle for each request.
    2. For protected routes, validate Clerk JWT, find the user in DB, and set RLS.
    """

    jwks_cache: List[Dict[str, Any]] = []

    async def get_jwks(self) -> List[Dict[str, Any]]:
        if not self.jwks_cache:
            async with httpx.AsyncClient() as client:
                try:
                    response = await client.get(settings.CLERK_JWKS_URL)
                    response.raise_for_status()
                    self.jwks_cache = response.json().get("keys", [])
                except httpx.HTTPStatusError as e:
                    logger.error(f"Failed to fetch JWKS: {e}")
                    return []
        return self.jwks_cache

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

        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return JSONResponse(status_code=401, content={"detail": "Authorization header missing or invalid"})

        token = auth_header.split(" ")[1]

        try:
            jwks = await self.get_jwks()
            if not jwks:
                 return JSONResponse(status_code=500, content={"detail": "Could not fetch signing keys"})
            
            unverified_headers = jwt.get_unverified_headers(token)
            rsa_key = {}
            for key in jwks:
                if key["kid"] == unverified_headers["kid"]:
                    rsa_key = {
                        "kty": key["kty"],
                        "kid": key["kid"],
                        "use": key["use"],
                        "n": key["n"],
                        "e": key["e"],
                    }
            if not rsa_key:
                 return JSONResponse(status_code=401, content={"detail": "Invalid token: Unable to find corresponding key"})

            payload = jwt.decode(
                token,
                rsa_key,
                algorithms=["RS256"],
                issuer=settings.CLERK_ISSUER_URL,
                audience=None, # In a real app, you might want to check the 'azp' claim (authorized party)
            )

            clerk_id = payload.get("sub")
            if not clerk_id:
                return JSONResponse(status_code=401, content={"detail": "Invalid token: No 'sub' claim"})

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
                
                return await call_next(request)

        except JWTError as e:
            logger.error(f"JWT validation error: {e}")
            return JSONResponse(status_code=401, content={"detail": f"Invalid token: {e}"})
        except Exception as e:
            logger.error(f"An unexpected authentication error occurred: {e}")
            return JSONResponse(status_code=500, content={"detail": "An unexpected error occurred during authentication"}) 
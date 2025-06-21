from fastapi import Request
from sqlalchemy.ext.asyncio import AsyncSession

def get_db(request: Request) -> AsyncSession:
    """
    Dependency to get the database session from the request state.
    The session is attached to the request state by the RLSAuthMiddleware.
    """
    return request.state.db 
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.security import verify_clerk_webhook
from app.dependencies.db import get_db
from app.schemas.clerk import ClerkWebhookEvent, ClerkUserData, ClerkDeletedUserData
from app.services import user_service

router = APIRouter()

@router.post("/clerk", status_code=status.HTTP_202_ACCEPTED)
async def handle_clerk_webhooks(
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    try:
        payload = await verify_clerk_webhook(request)
    except HTTPException as e:
        # Re-raise to let FastAPI handle the response
        raise e

    event = ClerkWebhookEvent.model_validate(payload)

    if event.type == "user.created":
        user_data = ClerkUserData.model_validate(event.data)
        await user_service.handle_user_created(db, user_data)
        return {"status": "user created"}

    elif event.type == "user.updated":
        user_data = ClerkUserData.model_validate(event.data)
        await user_service.handle_user_updated(db, user_data)
        return {"status": "user updated"}

    elif event.type == "user.deleted":
        user_data = ClerkDeletedUserData.model_validate(event.data)
        await user_service.handle_user_deleted(db, user_data)
        return {"status": "user deleted"}

    # If the event type is not one of the handled types,
    # we can just acknowledge it without taking action.
    return {"status": f"event type {event.type} received but not handled"} 
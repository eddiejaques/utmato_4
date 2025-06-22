from fastapi import APIRouter, Request, Depends, HTTPException, status
from pydantic import ValidationError
# from app.core.security import verify_clerk_webhook
# from app.schemas.clerk import ClerkEvent, ClerkUserEvent, ClerkDeletedUserEvent
from app.services.user_service import handle_user_created, handle_user_updated, handle_user_deleted
from sqlalchemy.ext.asyncio import AsyncSession
from app.dependencies.db import get_db

router = APIRouter()

@router.post("/clerk")
async def webhook_clerk(
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    # body = await request.body()
    # try:
    #     event_data = verify_clerk_webhook(request, body)
    #     event = ClerkEvent.parse_obj(event_data)
    # except (ValueError, ValidationError) as e:
    #     raise HTTPException(status_code=400, detail=f"Invalid payload: {e}")

    # # We are only interested in user events for now
    # if event.type.startswith("user."):
    #     user_event = ClerkUserEvent.parse_obj(event_data)
    #     if user_event.type == "user.created":
    #         await handle_user_created(db, user_event.data)
    #     elif user_event.type == "user.updated":
    #         await handle_user_updated(db, user_event.data)
    # elif event.type == "user.deleted":
    #     deleted_user_event = ClerkDeletedUserEvent.parse_obj(event_data)
    #     await handle_user_deleted(db, deleted_user_event.data)
        
    return {"status": "ok"} 
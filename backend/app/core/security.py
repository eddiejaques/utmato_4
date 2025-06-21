from fastapi import Request, HTTPException, status
from svix.webhooks import Webhook, WebhookVerificationError
from app.core.config import settings

async def verify_clerk_webhook(request: Request):
    """
    Verifies the signature of an incoming Clerk webhook.
    """
    headers = request.headers
    body = await request.body()
    
    secret = settings.CLERK_WEBHOOK_SECRET
    
    if not secret:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Clerk webhook secret is not configured.",
        )

    try:
        wh = Webhook(secret)
        payload = wh.verify(body, headers)
        return payload
    except WebhookVerificationError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Webhook verification failed: {e}",
        ) 
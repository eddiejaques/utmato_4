from fastapi import Request, HTTPException, status
# from svix.webhooks import Webhook, WebhookVerificationError
from app.core.config import settings

# def verify_clerk_webhook(request: Request, body: bytes):
#     try:
#         wh = Webhook(settings.CLERK_WEBHOOK_SECRET)
#         headers = dict(request.headers)
#         return wh.verify(body, headers)
#     except WebhookVerificationError as e:
#         raise HTTPException(
#             status_code=status.HTTP_403_FORBIDDEN,
#             detail="Webhook verification failed"
#         ) from e 
# Resend API Integration for Invitation Emails

## Overview
This document describes how the FastAPI backend integrates with the Resend API to send invitation emails.

---

## Integration Steps
1. Compose the email body (HTML template) with the invitation link and context.
2. Make an async HTTP POST request to the Resend API endpoint `/emails` with the required payload:
    - `to`: invitee's email
    - `from`: your verified sender address
    - `subject`: invitation subject
    - `html`: rendered email body
3. Handle the API response:
    - On success: log/send analytics event
    - On failure: log error, optionally update invitation status to 'email_failed'

---

## Example (Python, httpx)

```python
import httpx

async def send_email_via_resend(to: str, subject: str, html: str):
    api_key = settings.RESEND_API_KEY
    sender = settings.RESEND_SENDER_EMAIL
    payload = {
        "to": to,
        "from": sender,
        "subject": subject,
        "html": html
    }
    headers = {"Authorization": f"Bearer {api_key}"}
    async with httpx.AsyncClient() as client:
        response = await client.post("https://api.resend.com/emails", json=payload, headers=headers)
        response.raise_for_status()
    return response.json()
```

---

## Error Handling
- Catch and log all exceptions from the HTTP request.
- If sending fails, mark the invitation as 'email_failed' in the DB for retry/monitoring.
- Never expose API keys or sensitive errors to the client.

---

## Security
- Store Resend API keys in environment variables or a secure secrets manager.
- Use a verified sender domain with Resend.
- Sanitize all user input before including in emails. 
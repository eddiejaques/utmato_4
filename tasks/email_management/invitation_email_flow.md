# Invitation Email Flow: Architecture & Rationale

## Architecture & Flow Diagram

```
Frontend (Next.js)
    |
    |---1. User submits 'Invite Team Member' form--->|
    |
FastAPI Backend (Python)
    |
    |---2. Validates, checks, inserts invitation, composes email, calls Resend API--->|
    |
Supabase (Postgres)
    |
    |---3. Stores invitation row--->|
    |
Resend API
    |
    |---4. Sends transactional email to invitee--->|
    |
Invitee
    |
    |---5. Receives email, clicks invite link, completes onboarding--->|
```

## Overview
This document describes the architecture and rationale for handling team invitation emails in the utmato platform. The approach uses the FastAPI backend to manage invitation creation and email delivery, integrating with Supabase for data storage and Resend API for transactional email delivery.

---

## Architecture Diagram

```
Frontend (Next.js)
    |
    | 1. User submits 'Invite Team Member' form
    v
FastAPI Backend (Python)
    |
    | 2. Validates, checks, inserts invitation, composes email, calls Resend API
    v
Supabase (Postgres)
    |
    | 3. Stores invitation row
    v
Resend API
    |
    | 4. Sends transactional email to invitee
```

---

## Rationale
- **Control**: Backend manages business logic, validation, and error handling.
- **Extensibility**: Easy to add custom logic, analytics, or alternate email providers.
- **Security**: Sensitive operations (token generation, role checks) are handled server-side.
- **Observability**: Centralized logging and error reporting.

---

## Flow Summary
1. Manager submits invite form in frontend.
2. FastAPI validates, checks for duplicates, generates token, inserts invitation, composes email, and calls Resend API.
3. Invitation row is stored in Supabase.
4. Resend API delivers the email to the invitee.
5. Invitee clicks link to complete onboarding. 
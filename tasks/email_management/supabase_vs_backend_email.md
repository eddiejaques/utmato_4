# Supabase Trigger vs Backend-Driven Email: Decision Log

## Options Considered

### 1. Supabase Trigger + Edge Function
- DB trigger on invitations table calls a Supabase Edge Function (Deno/TypeScript) to send email via Resend API.

#### Pros
- No backend code changes
- Immediate, scalable
- Serverless

#### Cons
- Limited context (only DB row data)
- Harder to debug/monitor
- Vendor lock-in
- Difficult to add custom business logic

---

### 2. Backend-Driven Email (Chosen)
- FastAPI endpoint handles invitation creation and calls Resend API directly.

#### Pros
- Full control and extensibility
- Centralized error handling and logging
- Easy to add business rules, analytics, or alternate providers
- Consistent with other backend logic

#### Cons
- Slightly more backend code
- Backend responsible for email delivery

---

## Decision
**Chose backend-driven email for greater control, extensibility, and maintainability.**

- Allows for richer business logic and error handling
- Easier to test, debug, and monitor
- Keeps all business logic in one place 
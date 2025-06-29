# Test Cases: Invitation Email Feature

## Positive Cases
- [ ] Manager invites a new user with valid email and role; invitation and email are sent
- [ ] Invitation email contains correct invite link and context
- [ ] Invitee receives email and can complete onboarding

## Negative/Error Cases
- [ ] Invalid email format is rejected
- [ ] Invalid role is rejected
- [ ] Non-manager user cannot invite
- [ ] Duplicate invitation is rejected
- [ ] Existing user cannot be re-invited
- [ ] Email sending fails (Resend API error); invitation status is marked as 'email_failed'
- [ ] Database insert fails; no email is sent
- [ ] API key missing or invalid; error is logged, not exposed to client

## Edge Cases
- [ ] Invite link token is expired or invalid
- [ ] Invitee tries to accept invite twice
- [ ] Invitee email contains special/unicode characters
- [ ] Large batch of invites (rate limiting, performance) 
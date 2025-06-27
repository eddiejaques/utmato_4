# Team Management API Postman Test Guide

This guide provides step-by-step instructions for testing all Team Management API endpoints using Postman.

---

## **1. Authentication: Obtaining a Token**

Most endpoints require an authenticated user. You need a JWT token from Clerk.

### **How to Get a Token:**
- **Option 1:** Sign in via your frontend and copy the token from browser dev tools (usually in `Authorization` header or localStorage).
- **Option 2:** Use Clerk's API to programmatically obtain a session token (see Clerk docs).

**In Postman:**
- Set an `Authorization` header:  
  `Authorization: Bearer <YOUR_JWT_TOKEN>`

---

## **2. Endpoints & Example Requests**

### **A. Invite a Team Member**
- **POST** `/api/v1/invitations/invite`
- **Body (JSON):**
```json
{
  "email": "invitee@example.com",
  "role": "member",
  "company_id": "<COMPANY_UUID>"
}
```
- **Headers:** `Authorization: Bearer <token>`

---

### **B. Accept an Invitation (Onboarding)**
- **POST** `/api/v1/invitations/accept`
- **Body (JSON):**
```json
{
  "token": "<INVITE_TOKEN>",
  "password": "newpassword123",
  "first_name": "John",
  "last_name": "Doe"
}
```

---

### **C. Reject an Invitation**
- **POST** `/api/v1/invitations/reject`
- **Body (JSON):**
```json
{
  "token": "<INVITE_TOKEN>"
}
```

---

### **D. List Invitations for a Company**
- **GET** `/api/v1/invitations/list/<COMPANY_UUID>`
- **Headers:** `Authorization: Bearer <token>`

---

### **E. List Team Members**
- **GET** `/api/v1/team-membership/list/<COMPANY_UUID>`
- **Headers:** `Authorization: Bearer <token>`

---

### **F. Change a Team Member's Role**
- **PATCH** `/api/v1/team-membership/change-role/<MEMBERSHIP_ID>?new_role_id=<ROLE_UUID>`
- **Headers:** `Authorization: Bearer <token>`

---

### **G. Remove a Team Member**
- **DELETE** `/api/v1/team-membership/remove/<MEMBERSHIP_ID>`
- **Headers:** `Authorization: Bearer <token>`

---

### **H. Delete a Campaign (User Self-Service)**
- **DELETE** `/api/v1/campaigns/<CAMPAIGN_ID>`
- **Headers:** `Authorization: Bearer <token>`

---

### **I. Delete a UTM Link (User Self-Service)**
- **DELETE** `/api/v1/utm/link/<UTM_LINK_ID>`
- **Headers:** `Authorization: Bearer <token>`

---

## **3. Notes & Tips**
- Replace all placeholder values (`<...>`) with real UUIDs/tokens from your database or previous API responses.
- For onboarding, the invite token is sent to the invitee's email (or can be copied from the DB for testing).
- Use the OpenAPI docs (`/docs`) for more details on request/response schemas.
- All endpoints return standard HTTP status codes and error messages for edge cases (e.g., unauthorized, not found, duplicate, etc).

---

## **4. Example Authorization Header in Postman**
```
Authorization: Bearer eyJhbGciOi...<snip>...
```

---

## **5. Troubleshooting**
- If you get a 401/403 error, check your token and permissions.
- If you get a 404, check the resource ID and your company context.
- For Clerk onboarding, ensure the invite token is valid and not already used.

---

Happy testing! 
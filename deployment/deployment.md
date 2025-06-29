# Deployment Guide

## Project Structure
- **Backend:** `/backend` (FastAPI, deployed on GCP Cloud Run)
- **Frontend:** `/frontend` (Next.js, deployed on Netlify)
- **Database/Storage:** Supabase (Postgres, storage only)
- **Authentication:** Clerk

---

## 1. Backend Deployment (GCP Cloud Run)

### Prerequisites
- Google Cloud account
- `gcloud` CLI installed and authenticated
- Docker installed

### Steps
1. **Enable Cloud Run & Artifact Registry:**
   - In GCP Console, enable Cloud Run and Artifact Registry APIs.

2. **Containerize FastAPI App:**
   - In `/backend`, create a `Dockerfile` (if not present):
     ```dockerfile
     FROM python:3.11-slim
     WORKDIR /app
     COPY requirements.txt ./
     RUN pip install --no-cache-dir -r requirements.txt
     COPY . .
     CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
     ```

3. **Build and Push Docker Image:**
   ```sh
   cd backend
   gcloud builds submit --tag gcr.io/<YOUR_PROJECT_ID>/utmato-backend
   ```

4. **Deploy to Cloud Run:**
   ```sh
   gcloud run deploy utmato-backend \
     --image gcr.io/<YOUR_PROJECT_ID>/utmato-backend \
     --platform managed \
     --region <YOUR_REGION> \
     --allow-unauthenticated \
     --set-env-vars "ENV_VAR1=value1,ENV_VAR2=value2"
   ```
   - Set environment variables for Supabase, Clerk, DB, etc.

5. **Configure CORS:**
   - Ensure FastAPI CORS middleware allows your frontend domain (see CORS section).

6. **Validate Clerk JWTs in FastAPI:**
   - Install `python-jose` for JWT validation:
     ```sh
     pip install python-jose
     ```
   - In your FastAPI app, add a dependency to validate Clerk tokens:
     ```python
     from fastapi import Depends, HTTPException, status, Request
     from jose import jwt
     import requests

     CLERK_ISSUER = "https://api.clerk.dev"
     CLERK_JWKS_URL = f"{CLERK_ISSUER}/.well-known/jwks.json"
     CLERK_AUDIENCE = "<YOUR_CLERK_FRONTEND_API>"  # e.g., 'clerk.yourdomain.com'

     jwks = requests.get(CLERK_JWKS_URL).json()

     def get_public_key(token):
         headers = jwt.get_unverified_header(token)
         for key in jwks["keys"]:
             if key["kid"] == headers["kid"]:
                 return jwt.algorithms.RSAAlgorithm.from_jwk(key)
         raise HTTPException(status_code=401, detail="Invalid token header")

     def verify_clerk_token(request: Request):
         auth = request.headers.get("authorization")
         if not auth or not auth.startswith("Bearer "):
             raise HTTPException(status_code=401, detail="Missing token")
         token = auth.split(" ")[1]
         public_key = get_public_key(token)
         try:
             payload = jwt.decode(token, public_key, algorithms=["RS256"], audience=CLERK_AUDIENCE, issuer=CLERK_ISSUER)
             return payload
         except Exception:
             raise HTTPException(status_code=401, detail="Invalid token")
     ```
   - Use `Depends(verify_clerk_token)` on protected routes.

---

## 2. Frontend Deployment (Netlify)

### Prerequisites
- Netlify account
- GitHub repo for `/frontend`

### Steps
1. **Push `/frontend` to GitHub.**
2. **Connect Netlify to GitHub repo.**
3. **Configure Build Settings:**
   - Build command: `npm run build` or `next build`
   - Publish directory: `out` (for static export) or as per SSR config
4. **Set Environment Variables:**
   - In Netlify dashboard, add all required `NEXT_PUBLIC_` variables (Clerk, Supabase, API URLs, etc.)
5. **Deploy.**
6. **Add Custom Domain (optional).**

### Clerk Integration
- **Install Clerk SDK:**
  ```sh
  npm install @clerk/clerk-react
  ```
- **Configure Clerk Provider:**
  - In your main app entry (e.g., `src/app/layout.tsx`):
    ```tsx
    import { ClerkProvider } from '@clerk/clerk-react';
    // ...
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      {/* your app */}
    </ClerkProvider>
    ```
- **Set Clerk Environment Variables in Netlify:**
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - `NEXT_PUBLIC_CLERK_FRONTEND_API`
  - `NEXT_PUBLIC_CLERK_SIGN_IN_URL`, etc.
- **Configure Clerk dashboard:**
  - Add your Netlify domain as an allowed origin.

---

## 3. Supabase Setup (Database/Storage Only)

1. **Create a new project** at [Supabase](https://app.supabase.com/).
2. **Configure tables and storage** as needed.
3. **Get API URL and service role key** from project settings.
4. **Set allowed origins (CORS)** in Supabase settings to include your Netlify and backend domains.
5. **Add Supabase keys/URLs to backend and frontend environment variables.**

---

## 4. CORS Configuration

- **Backend (FastAPI):**
  - Use FastAPI CORS middleware:
    ```python
    from fastapi.middleware.cors import CORSMiddleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["https://your-app.netlify.app"],
        allow_credentials=True,
        allow_methods=["*"] ,
        allow_headers=["*"]
    )
    ```
  - For local dev, add `http://localhost:3000` (Next.js) and `http://localhost:8000` (FastAPI).

- **Supabase:**
  - In project settings, set allowed origins to your Netlify and backend domains.

- **Clerk:**
  - In Clerk dashboard, add your Netlify domain and backend API URL as allowed origins.

---

## 5. Environment Variables

### Backend
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL` (if using external DB)
- `CLERK_ISSUER` (usually `https://api.clerk.dev`)
- `CLERK_JWKS_URL` (usually `https://api.clerk.dev/.well-known/jwks.json`)
- `CLERK_AUDIENCE` (your Clerk frontend API)
- Any other secrets

### Frontend
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_CLERK_FRONTEND_API`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_API_URL` (backend endpoint)

---

## 6. Troubleshooting

- **CORS Errors:**
  - Ensure all domains are whitelisted in backend, Supabase, and Clerk.
  - Check browser console for blocked requests.
- **JWT Validation Errors:**
  - Ensure backend is using correct Clerk JWKS and audience.
  - Check for token expiration or misconfiguration.
- **Build Failures:**
  - Verify environment variables are set in Netlify/GCP.
- **API Connectivity:**
  - Ensure backend is publicly accessible and not restricted by firewall.

---

## 7. References
- [FastAPI CORS Docs](https://fastapi.tiangolo.com/tutorial/cors/)
- [Clerk Docs](https://clerk.com/docs)
- [Netlify Docs](https://docs.netlify.com/)
- [GCP Cloud Run Docs](https://cloud.google.com/run/docs/)
- [Supabase Docs](https://supabase.com/docs) 
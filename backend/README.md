# Utmato Backend

This is the backend for the Utmato application, built with FastAPI.

## Getting Started

Follow these instructions to get the backend server up and running on your local machine for development and testing.

### Prerequisites

- Python 3.8+
- A running PostgreSQL database instance

### Installation & Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Activate the virtual environment:**
    A virtual environment is included in this directory. Activate it using the following command:
    ```bash
    source venv/bin/activate
    ```

3.  **Install dependencies:**
    Install all the required Python packages from the `requirements.txt` file.
    ```bash
    pip install -r requirements.txt
    ```

4.  **Configure Environment Variables:**
    Create a `.env` file in the `backend` directory by copying the example. If `.env.example` does not exist, create it with the content below.
    ```bash
    cp .env.example .env
    ```
    Your `.env.example` should look like this:
    ```env
    DATABASE_URL=postgresql+asyncpg://user:password@host:port/dbname
    CLERK_SECRET_KEY=your_clerk_secret_key
    CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret
    CLERK_ISSUER_URL=your_clerk_frontend_api_url
    ```
    Update the `.env` file with your database credentials and any other required settings.

### Running the Server

To start the FastAPI development server, run the following command. The `--reload` flag will ensure the server restarts automatically whenever you make a code change.

```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.

### Verifying the Server is Running

Once the server is running, you can verify that it's operating correctly in a couple of ways:

1.  **Check the Interactive API Docs:**
    Open your web browser and navigate to [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs). You should see the Swagger UI documentation page, which lists all of your available API endpoints. This is the best way to confirm the application has started successfully.

2.  **Use `curl` for a quick check:**
    Open a new terminal window and run the following command:
    ```bash
    curl http://127.0.0.1:8000/
    ```
    You should receive a JSON response confirming that the API is running:
    ```json
    {"message":"UTMato API is running"}
    ```

## Testing the API with Postman

You can use an API client like Postman or Insomnia to test the campaign endpoints.

### Authentication

The API uses JWT-based authentication handled by Clerk. To access protected endpoints, you need to include an `Authorization` header with a valid JWT bearer token.

-   **Header Key**: `Authorization`
-   **Header Value**: `Bearer <YOUR_CLERK_JWT>`

You can obtain a JWT for a test user from the Clerk dashboard or your frontend application during development.

How to get a token from the Clerk Dashboard

For situations where you might not be running the frontend, you can get a token directly from the Clerk Dashboard. These are great for quickly testing with tools like Postman.
Here's how you do it:
Go to your Clerk Dashboard and select your application.
Navigate to the Users page from the sidebar.
Click on the user you want to test with.
In the user's profile, go to the Sessions tab.
You will see a list of active sessions for that user. Click on one to expand it.
You'll find a JWT section with a button to copy the token. These tokens are typically short-lived (e.g., 60 seconds), so you may need to click the "refresh" icon to get a new one before making your API request.
This should give you two solid ways to get a token for testing your API endpoints.

### Campaign Endpoints

The base URL for the campaign endpoints is `http://localhost:8000/api/v1/campaigns`.

#### 1. Create a Campaign

-   **Method**: `POST`
-   **URL**: `/`
-   **Headers**: `Authorization: Bearer <YOUR_CLERK_JWT>`
-   **Body** (raw, JSON):
    ```json
    {
      "name": "Summer Sale 2024",
      "status": "draft",
      "budget_info": {
        "total_budget": 5000,
        "currency": "USD"
      }
    }
    ```
-   **Success Response** (201 Created):
    ```json
    {
      "name": "Summer Sale 2024",
      "status": "draft",
      "budget_info": {
        "total_budget": 5000,
        "currency": "USD"
      },
      "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
      "company_id": "d4c3b2a1-f6e5-9078-4321-fedcba098765",
      "created_at": "2024-01-01T12:00:00Z",
      "updated_at": null
    }
    ```

#### 2. Get All Campaigns

-   **Method**: `GET`
-   **URL**: `/`
-   **Headers**: `Authorization: Bearer <YOUR_CLERK_JWT>`
-   **Success Response** (200 OK):
    ```json
    [
      {
        "name": "Summer Sale 2024",
        "status": "draft",
        ...
      },
      {
        "name": "Winter Promo",
        "status": "active",
        ...
      }
    ]
    ```

#### 3. Get a Single Campaign

-   **Method**: `GET`
-   **URL**: `/{campaign_id}`
-   **Headers**: `Authorization: Bearer <YOUR_CLERK_JWT>`
-   **Success Response** (200 OK):
    ```json
    {
      "name": "Summer Sale 2024",
      "status": "draft",
      ...
    }
    ```

#### 4. Update a Campaign

-   **Method**: `PUT`
-   **URL**: `/{campaign_id}`
-   **Headers**: `Authorization: Bearer <YOUR_CLERK_JWT>`
-   **Body** (raw, JSON):
    ```json
    {
      "name": "Summer Sale 2024 (Updated)",
      "status": "active"
    }
    ```
-   **Success Response** (200 OK):
    ```json
    {
      "name": "Summer Sale 2024 (Updated)",
      "status": "active",
      ...
    }
    ```

#### 5. Delete a Campaign

-   **Method**: `DELETE`
-   **URL**: `/{campaign_id}`
-   **Headers**: `Authorization: Bearer <YOUR_CLERK_JWT>`
-   **Success Response** (200 OK):
    ```json
    {
      "name": "Summer Sale 2024 (Updated)",
      "status": "active",
      ...
    }
    ```

### UTM Link Generation Endpoint

The base URL for the UTM link generation endpoint is `http://localhost:8000/api/v1/utm`.

#### 1. Generate a Single UTM Link

This endpoint allows you to generate a single UTM-tagged URL for an existing campaign. You must provide a valid `campaign_id`.

-   **Method**: `POST`
-   **URL**: `utm/generate`
-   **Headers**: `Authorization: Bearer <YOUR_CLERK_JWT>`
-   **Body** (raw, JSON):
    Replace `"campaign_id"` with a valid ID from one of your campaigns.
    ```json
    {
      "destination_url": "https://www.myproduct.com/landing",
      "utm_source": "google",
      "utm_medium": "cpc",
      "utm_term": "saas_platform",
      "utm_content": "ad_variant_1",
      "campaign_id": "YOUR_CAMPAIGN_ID_HERE"
    }
    ```
-   **Success Response** (200 OK):
    The response will include the full generated URL and all the parameters stored in the database.
    ```json
    {
        "destination_url": "https://www.myproduct.com/landing",
        "utm_source": "google",
        "utm_medium": "cpc",
        "utm_term": "saas_platform",
        "utm_content": "ad_variant_1",
        "id": "e5c1a8a0-5b1e-4b2e-8b1e-2e8b1e2e8b1e",
        "campaign_id": "YOUR_CAMPAIGN_ID_HERE",
        "utm_campaign": "Your Campaign Name",
        "generated_url": "https://www.myproduct.com/landing?utm_source=google&utm_medium=cpc&utm_campaign=Your+Campaign+Name&utm_term=saas_platform&utm_content=ad_variant_1",
        "click_count": 0,
        "created_at": "2024-07-29T12:00:00Z"
    }
    ```

## Testing the URL Validation Endpoint

You can use a command-line tool like `curl` to test the URL validation endpoint.

### Test Case 1: A Valid URL

```bash
curl -X POST -H "Content-Type: application/json" \
-d '{"url": "https://www.google.com"}' \
http://127.0.0.1:8000/api/v1/utm/validate-url
```

**Expected Response:**

```json
{"is_valid":true,"message":"URL is valid."}
```

### Test Case 2: An Invalid URL Format

```bash
curl -X POST -H "Content-Type: application/json" \
-d '{"url": "not-a-valid-url"}' \
http://127.0.0.1:8000/api/v1/utm/validate-url
```

**Expected Response:**

```json
{"is_valid":false,"message":"URL format is invalid."}
```

### Test Case 3: A Non-Existent Domain

```bash
curl -X POST -H "Content-Type: application/json" \
-d '{"url": "https://thisdomainprobablydoesnotexist12345.com"}' \
http://127.0.0.1:8000/api/v1/utm/validate-url
```

**Expected Response:**

```json
{"is_valid":false,"message":"Domain does not exist (DNS lookup failed)."}
```

### Test Case 4: A Malicious Domain

This test uses one of the domains from the blocklist defined in `app/services/utm_service.py`.

```bash
curl -X POST -H "Content-Type: application/json" \
-d '{"url": "https://malicious.com"}' \
http://127.0.0.1:8000/api/v1/utm/validate-url
```

**Expected Response:**

```json
{"is_valid":false,"message":"URL is from a known malicious domain."}
``` 
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
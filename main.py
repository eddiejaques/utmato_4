from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import json
import uuid

from app.api.v1.api import api_router
from app.core.config import settings
from app.middleware.auth_middleware import AuthMiddleware

class CustomJSONResponse(JSONResponse):
    def render(self, content: any) -> bytes:
        # Custom renderer to handle UUID serialization
        return json.dumps(
            content,
            ensure_ascii=False,
            allow_nan=False,
            indent=None,
            separators=(",", ":"),
            default=str, # This will convert non-serializable types to their string representation
        ).encode("utf-8")

app = FastAPI(
    title="Utmato API",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    default_response_class=CustomJSONResponse
)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ... existing code ... 
from fastapi import APIRouter

from app.schemas.utm import URLValidationRequest, URLValidationResponse
from app.services.utm_service import validate_url

router = APIRouter()


@router.post("/validate-url", response_model=URLValidationResponse)
def validate_url_endpoint(
    request: URLValidationRequest,
):
    """
    Validates a destination URL.
    """
    validation_result = validate_url(str(request.url))
    return URLValidationResponse(**validation_result) 
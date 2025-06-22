import socket
from urllib.parse import urlparse
import validators
from pydantic import HttpUrl, ValidationError
from typing import Optional, Tuple

MALICIOUS_DOMAINS = {
    "malicious.com",
    "phishing-site.net",
    "scam-domain.org",
}

def validate_url(url: str) -> dict:
    """
    Validates a URL using a series of checks.
    """
    if not isinstance(url, str) or not validators.url(url):
        return {"is_valid": False, "message": "URL format is invalid."}

    parsed_url = urlparse(url)
    domain = parsed_url.netloc

    if not domain:
        return {"is_valid": False, "message": "Could not determine domain from URL."}

    try:
        socket.gethostbyname(domain)
    except socket.gaierror:
        return {"is_valid": False, "message": "Domain does not exist (DNS lookup failed)."}

    if domain in MALICIOUS_DOMAINS:
        return {"is_valid": False, "message": "URL is from a known malicious domain."}

    return {"is_valid": True, "message": "URL is valid."}

def validate_url_with_correction(url_str: str) -> Tuple[bool, str, Optional[HttpUrl]]:
    """
    Validates a URL against a set of checks, with correction attempts.

    Args:
        url_str: The URL string to validate.

    Returns:
        A tuple containing a boolean indicating if the URL is valid,
        a message, and an optional corrected URL.
    """
    validated_url: Optional[HttpUrl] = None
    
    try:
        # First attempt to validate the URL as is
        url = HttpUrl(url_str)
    except ValidationError:
        # If validation fails, try to correct it by adding a scheme
        if not url_str.startswith(('http://', 'https://')):
            corrected_url_str = f"https://{url_str}"
            try:
                url = HttpUrl(corrected_url_str)
                validated_url = url
            except ValidationError:
                return False, "Invalid URL format.", None
        else:
            return False, "Invalid URL format.", None

    parsed_url = urlparse(str(url))
    domain = parsed_url.netloc

    if not domain:
        return False, "Invalid URL format, cannot extract domain.", None

    if not validators.domain(domain):
        return False, "Invalid domain format.", None

    if domain in MALICIOUS_DOMAINS:
        return False, "URL is from a known malicious domain.", None

    try:
        socket.gethostbyname(domain)
    except socket.gaierror:
        return False, "Domain does not exist (DNS lookup failed).", None

    if validated_url:
        return True, "URL is valid and has been corrected.", validated_url
    
    return True, "URL is valid.", url 
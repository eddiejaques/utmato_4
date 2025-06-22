from urllib.parse import urlencode, urlparse, urlunparse, parse_qs

def build_utm_url(destination_url: str, params: dict) -> str:
    """
    Adds UTM parameters to a destination URL.
    It correctly handles URLs that already have query parameters.
    """
    # Remove None values from params
    utm_params = {k: v for k, v in params.items() if v is not None}
    
    if not utm_params:
        return destination_url

    # Parse the destination URL
    parsed_url = urlparse(destination_url)
    
    # Get existing query parameters
    query_params = parse_qs(parsed_url.query)
    
    # Add new UTM parameters, overwriting existing ones if there are conflicts
    query_params.update(utm_params)
    
    # Encode the combined query parameters
    encoded_query = urlencode(query_params, doseq=True)
    
    # Reconstruct the URL
    final_url = urlunparse((
        parsed_url.scheme,
        parsed_url.netloc,
        parsed_url.path,
        parsed_url.params,
        encoded_query,
        parsed_url.fragment
    ))
    
    return final_url 
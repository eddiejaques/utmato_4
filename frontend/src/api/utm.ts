import { post, get } from './api';
import { URLValidationRequest, URLValidationResponse, UTMLinkCreate, UTMLink } from '@/types/utm';

export const validateUrl = async (
  data: URLValidationRequest,
  token: string | null
): Promise<URLValidationResponse> => {
  return await post<URLValidationResponse>('/utm/validate-url', data, token);
};

export const generateUTMLink = async (
    data: UTMLinkCreate,
    token: string | null
): Promise<UTMLink> => {
    return await post<UTMLink>('/utm/generate', data, token);
};

export const fetchUTMLinksByCampaign = async (
    campaignId: string,
    token: string | null
): Promise<UTMLink[]> => {
    return await get<UTMLink[]>(`/utm/campaign/${campaignId}/links`, token);
} 
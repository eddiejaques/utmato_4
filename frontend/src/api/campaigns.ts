import { Campaign, CampaignCreate, CampaignUpdate } from '@/types/campaign';
import { get, post, put, del } from './api';

export const fetchCampaigns = async (token: string | null): Promise<Campaign[]> => {
  return await get<Campaign[]>('/campaigns', token);
};

export const fetchCampaignById = async (id: string, token: string | null): Promise<Campaign> => {
  return await get<Campaign>(`/campaigns/${id}`, token);
};

export const createCampaign = async (campaignData: CampaignCreate, token: string | null): Promise<Campaign> => {
  return await post<Campaign>('/campaigns', campaignData, token);
};

export const updateCampaign = async (id: string, campaignData: CampaignUpdate, token: string | null): Promise<Campaign> => {
  return await put<Campaign>(`/campaigns/${id}`, campaignData, token);
};

export const deleteCampaign = async (id: string, token: string | null): Promise<void> => {
  await del(`/campaigns/${id}`, token);
};

export const duplicateCampaign = async (id: string, token: string | null): Promise<Campaign> => {
  return await post<Campaign>(`/campaigns/${id}/duplicate`, {}, token);
}; 
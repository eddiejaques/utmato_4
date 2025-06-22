import { Campaign, CampaignCreate, CampaignUpdate } from '@/types/campaign';
import { get, post, put, del } from './api';

export const fetchCampaigns = async (): Promise<Campaign[]> => {
  return await get<Campaign[]>('/campaigns');
};

export const fetchCampaignById = async (id: string): Promise<Campaign> => {
  return await get<Campaign>(`/campaigns/${id}`);
};

export const createCampaign = async (campaignData: CampaignCreate): Promise<Campaign> => {
  return await post<Campaign>('/campaigns', campaignData);
};

export const updateCampaign = async (id: string, campaignData: CampaignUpdate): Promise<Campaign> => {
  return await put<Campaign>(`/campaigns/${id}`, campaignData);
};

export const deleteCampaign = async (id: string): Promise<Campaign> => {
  return await del<Campaign>(`/campaigns/${id}`);
};

export const duplicateCampaign = async (id: string): Promise<Campaign> => {
  return await post<Campaign>(`/campaigns/${id}/duplicate`, {});
}; 
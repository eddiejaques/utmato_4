import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as campaignApi from '@/api/campaigns';
import { Campaign, CampaignCreate, CampaignUpdate } from '@/types/campaign';

interface CampaignState {
  campaigns: Campaign[];
  currentCampaign: Campaign | null;
  loading: boolean;
  error: string | null;
}

const initialState: CampaignState = {
  campaigns: [],
  currentCampaign: null,
  loading: false,
  error: null,
};

export const fetchCampaigns = createAsyncThunk('campaigns/fetchCampaigns', async () => {
  return await campaignApi.fetchCampaigns();
});

export const fetchCampaignById = createAsyncThunk('campaigns/fetchCampaignById', async (id: string) => {
  return await campaignApi.fetchCampaignById(id);
});

export const createCampaign = createAsyncThunk('campaigns/createCampaign', async (campaignData: CampaignCreate) => {
  return await campaignApi.createCampaign(campaignData);
});

export const updateCampaign = createAsyncThunk('campaigns/updateCampaign', async ({ id, campaignData }: { id: string; campaignData: CampaignUpdate }) => {
  return await campaignApi.updateCampaign(id, campaignData);
});

export const deleteCampaign = createAsyncThunk('campaigns/deleteCampaign', async (id: string) => {
  await campaignApi.deleteCampaign(id);
  return id;
});

export const duplicateCampaign = createAsyncThunk('campaigns/duplicateCampaign', async (id: string) => {
  return await campaignApi.duplicateCampaign(id);
});


const campaignSlice = createSlice({
  name: 'campaigns',
  initialState,
  reducers: {
    setCurrentCampaign: (state, action: PayloadAction<Campaign | null>) => {
        state.currentCampaign = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCampaigns.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCampaigns.fulfilled, (state, action: PayloadAction<Campaign[]>) => {
        state.loading = false;
        state.campaigns = action.payload;
      })
      .addCase(fetchCampaigns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch campaigns';
      })
      .addCase(fetchCampaignById.fulfilled, (state, action: PayloadAction<Campaign>) => {
        state.currentCampaign = action.payload;
      })
      .addCase(createCampaign.fulfilled, (state, action: PayloadAction<Campaign>) => {
        state.campaigns.push(action.payload);
      })
      .addCase(updateCampaign.fulfilled, (state, action: PayloadAction<Campaign>) => {
        const index = state.campaigns.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.campaigns[index] = action.payload;
        }
        if (state.currentCampaign?.id === action.payload.id) {
            state.currentCampaign = action.payload;
        }
      })
      .addCase(deleteCampaign.fulfilled, (state, action: PayloadAction<string>) => {
        state.campaigns = state.campaigns.filter((c) => c.id !== action.payload);
      })
      .addCase(duplicateCampaign.fulfilled, (state, action: PayloadAction<Campaign>) => {
        state.campaigns.push(action.payload);
      });
  },
});

export const { setCurrentCampaign } = campaignSlice.actions;

export default campaignSlice.reducer; 
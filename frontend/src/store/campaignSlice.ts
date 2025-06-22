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

// Types for thunkAPI
interface ThunkApiConfig {
    state: { auth: { token: string | null } };
    rejectValue: string;
}

export const fetchCampaigns = createAsyncThunk<Campaign[], void, ThunkApiConfig>('campaigns/fetchCampaigns', async (_, thunkAPI) => {
    const token = thunkAPI.getState().auth.token;
    return await campaignApi.fetchCampaigns(token);
});

export const fetchCampaignById = createAsyncThunk<Campaign, string, ThunkApiConfig>('campaigns/fetchCampaignById', async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.token;
    return await campaignApi.fetchCampaignById(id, token);
});

export const createCampaign = createAsyncThunk<Campaign, CampaignCreate, ThunkApiConfig>('campaigns/createCampaign', async (campaignData, thunkAPI) => {
    const token = thunkAPI.getState().auth.token;
    return await campaignApi.createCampaign(campaignData, token);
});

export const updateCampaign = createAsyncThunk<Campaign, { id: string; campaignData: CampaignUpdate }, ThunkApiConfig>('campaigns/updateCampaign', async ({ id, campaignData }, thunkAPI) => {
    const token = thunkAPI.getState().auth.token;
    return await campaignApi.updateCampaign(id, campaignData, token);
});

export const deleteCampaign = createAsyncThunk<string, string, ThunkApiConfig>('campaigns/deleteCampaign', async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.token;
    await campaignApi.deleteCampaign(id, token);
    return id;
});

export const duplicateCampaign = createAsyncThunk<Campaign, string, ThunkApiConfig>('campaigns/duplicateCampaign', async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.token;
    return await campaignApi.duplicateCampaign(id, token);
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
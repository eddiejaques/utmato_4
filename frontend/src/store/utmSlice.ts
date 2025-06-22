import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as utmApi from '@/api/utm';
import { UTMLink, UTMLinkCreate, URLValidationRequest, URLValidationResponse } from '@/types/utm';
import { UUID } from 'crypto';

interface UTMState {
  destinationUrl: string;
  utmSource: string;
  utmMedium: string;
  utmTerm: string;
  utmContent: string;
  generatedUrl: string;
  validation: {
    isValid: boolean;
    message: string;
  };
  loading: boolean;
  error: string | null;
  generatedLinks: UTMLink[];
  campaignLinks: UTMLink[];
}

const initialState: UTMState = {
  destinationUrl: '',
  utmSource: '',
  utmMedium: '',
  utmTerm: '',
  utmContent: '',
  generatedUrl: '',
  validation: {
    isValid: false,
    message: '',
  },
  loading: false,
  error: null,
  generatedLinks: [],
  campaignLinks: [],
};

interface ThunkApiConfig {
    state: { auth: { token: string | null } };
    rejectValue: string;
}

export const validateUrl = createAsyncThunk<URLValidationResponse, URLValidationRequest, ThunkApiConfig>(
  'utm/validateUrl',
  async (data, thunkAPI) => {
    const token = thunkAPI.getState().auth.token;
    return await utmApi.validateUrl(data, token);
  }
);

export const generateUTMLink = createAsyncThunk<UTMLink, UTMLinkCreate, ThunkApiConfig>(
    'utm/generateUTMLink',
    async (data, thunkAPI) => {
      const token = thunkAPI.getState().auth.token;
      const result = await utmApi.generateUTMLink(data, token);
      thunkAPI.dispatch(addGeneratedLink(result));
      return result;
    }
  );

export const fetchUTMLinksByCampaign = createAsyncThunk<UTMLink[], UUID, ThunkApiConfig>(
    'utm/fetchUTMLinksByCampaign',
    async (campaignId, thunkAPI) => {
        const token = thunkAPI.getState().auth.token;
        return await utmApi.fetchUTMLinksByCampaign(campaignId, token);
    }
)

const utmSlice = createSlice({
  name: 'utm',
  initialState,
  reducers: {
    setUTMField: (state, action: PayloadAction<{ field: keyof UTMState, value: string }>) => {
        const { field, value } = action.payload;
        if (field in state) {
            (state as any)[field] = value;
        }
    },
    clearUTMFields: (state) => {
        state.destinationUrl = '';
        state.utmSource = '';
        state.utmMedium = '';
        state.utmTerm = '';
        state.utmContent = '';
        state.generatedUrl = '';
        state.validation = { isValid: false, message: '' };
    },
    addGeneratedLink: (state, action: PayloadAction<UTMLink>) => {
        state.generatedLinks.push(action.payload);
        state.campaignLinks.push(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(validateUrl.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(validateUrl.fulfilled, (state, action: PayloadAction<URLValidationResponse>) => {
        state.loading = false;
        state.validation.isValid = action.payload.is_valid;
        state.validation.message = action.payload.message;
      })
      .addCase(validateUrl.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to validate URL';
        state.validation.isValid = false;
        state.validation.message = action.error.message || 'Failed to validate URL';
      })
      .addCase(generateUTMLink.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateUTMLink.fulfilled, (state, action: PayloadAction<UTMLink>) => {
        state.loading = false;
        state.generatedUrl = action.payload.generated_url;
      })
      .addCase(generateUTMLink.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to generate UTM link';
      })
      .addCase(fetchUTMLinksByCampaign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUTMLinksByCampaign.fulfilled, (state, action: PayloadAction<UTMLink[]>) => {
        state.loading = false;
        state.campaignLinks = action.payload;
      })
      .addCase(fetchUTMLinksByCampaign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch UTM links';
      });
  },
});

export const { setUTMField, clearUTMFields, addGeneratedLink } = utmSlice.actions;

export default utmSlice.reducer; 
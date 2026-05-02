import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/api';

export const fetchDisputes = createAsyncThunk(
  'disputes/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/disputes');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch disputes');
    }
  }
);

export const raiseDispute = createAsyncThunk(
  'disputes/raise',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await API.post('/disputes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to raise dispute');
    }
  }
);

export const resolveDispute = createAsyncThunk(
  'disputes/resolve',
  async ({ disputeId, resolution, adminNote }, { rejectWithValue }) => {
    try {
      const response = await API.put(`/disputes/${disputeId}/resolve`, { resolution, adminNote });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to resolve dispute');
    }
  }
);

const disputeSlice = createSlice({
  name: 'disputes',
  initialState: {
    disputes: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearDisputeError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDisputes.pending, (state) => { state.loading = true; })
      .addCase(fetchDisputes.fulfilled, (state, action) => {
        state.loading = false;
        state.disputes = action.payload.disputes;
      })
      .addCase(fetchDisputes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(raiseDispute.fulfilled, (state, action) => {
        state.disputes.unshift(action.payload.dispute);
      })
      .addCase(resolveDispute.fulfilled, (state, action) => {
        const idx = state.disputes.findIndex(d => d._id === action.payload.dispute._id);
        if (idx !== -1) state.disputes[idx] = action.payload.dispute;
      });
  },
});

export const { clearDisputeError } = disputeSlice.actions;
export default disputeSlice.reducer;

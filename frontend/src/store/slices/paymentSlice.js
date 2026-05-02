import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/api';

export const fetchPayments = createAsyncThunk(
  'payments/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/payments');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch payments');
    }
  }
);

export const depositFunds = createAsyncThunk(
  'payments/deposit',
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await API.post('/payments/deposit', { projectId });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to deposit funds');
    }
  }
);

const paymentSlice = createSlice({
  name: 'payments',
  initialState: {
    payments: [],
    summary: { total: 0, locked: 0, pending: 0, released: 0, disputed: 0 },
    loading: false,
    error: null,
  },
  reducers: {
    clearPaymentError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayments.pending, (state) => { state.loading = true; })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload.payments;
        state.summary = action.payload.summary;
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(depositFunds.fulfilled, (state) => {
        state.loading = false;
      });
  },
});

export const { clearPaymentError } = paymentSlice.actions;
export default paymentSlice.reducer;

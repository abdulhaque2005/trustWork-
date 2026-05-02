import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import projectReducer from './slices/projectSlice';
import paymentReducer from './slices/paymentSlice';
import disputeReducer from './slices/disputeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    payments: paymentReducer,
    disputes: disputeReducer,
  },
});

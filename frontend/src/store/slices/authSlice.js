import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/api';

const safeJSONParse = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
};

// Async Thunks for API calls
export const registerUserAsync = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await API.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const loginUserAsync = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await API.post('/auth/login', credentials);
      const resData = response.data?.data;
      if (!resData?.token || !resData?.user) {
        return rejectWithValue('Invalid response from server');
      }
      localStorage.setItem('token', resData.token);
      localStorage.setItem('user', JSON.stringify(resData.user));
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('role', resData.user.role);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const updateProfileAsync = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await API.put('/auth/profile', profileData);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
      return response.data.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Update failed');
    }
  }
);

const initialState = {
  user: safeJSONParse('user', null),
  isLoggedIn: !!localStorage.getItem('isLoggedIn'),
  loading: false,
  error: null,
  settings: safeJSONParse('settings', {
    darkMode: false,
    notifications: true,
    emailAlerts: true,
  })
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      localStorage.removeItem('user');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('role');
      localStorage.removeItem('token');
    },
    updateSettings: (state, action) => {
      state.settings = { ...state.settings, ...action.payload };
      localStorage.setItem('settings', JSON.stringify(state.settings));
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUserAsync.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(loginUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.user = action.payload.data.user;
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Profile
      .addCase(updateProfileAsync.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { logout, updateSettings, clearError } = authSlice.actions;
export default authSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

const safeJSONParse = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error parsing ${key} from localStorage`, e);
    return fallback;
  }
};

const initialState = {
  user: safeJSONParse('user', null),
  isLoggedIn: !!localStorage.getItem('isLoggedIn'),
  registeredUsers: safeJSONParse('registeredUsers', []),
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
    registerUser: (state, action) => {
      state.registeredUsers.push(action.payload);
      localStorage.setItem('registeredUsers', JSON.stringify(state.registeredUsers));
    },
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true;
      localStorage.setItem('user', JSON.stringify(action.payload));
      localStorage.setItem('isLoggedIn', 'true');
    },
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      localStorage.removeItem('user');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('role');
    },
    updatePlan: (state, action) => {
      if (state.user) {
        state.user.plan = action.payload;
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
    updateProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    updateSettings: (state, action) => {
      state.settings = { ...state.settings, ...action.payload };
      localStorage.setItem('settings', JSON.stringify(state.settings));
    }
  },
});

export const { registerUser, loginSuccess, logout, updatePlan, updateProfile, updateSettings } = authSlice.actions;
export default authSlice.reducer;

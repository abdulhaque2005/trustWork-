import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/api';
import { fetchPublicData } from '../../services/publicData';

// Async Thunks
export const fetchDashboardStats = createAsyncThunk(
  'projects/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/projects/stats');
      return response.data.data.stats;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats');
    }
  }
);

export const fetchProjects = createAsyncThunk(
  'projects/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/projects');
      return response.data.data.projects;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch projects');
    }
  }
);

export const createProjectAsync = createAsyncThunk(
  'projects/create',
  async (projectData, { rejectWithValue }) => {
    try {
      const response = await API.post('/projects', projectData);
      return response.data.data.project;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create project');
    }
  }
);


export const getProjectDetails = createAsyncThunk(
  'projects/getDetails',
  async (projectId, { rejectWithValue }) => {
    try {
      if (projectId.startsWith('pub-')) {
        const data = await fetchPublicData();
        const project = data.projects.find(p => p._id === projectId);
        if (project) {
          return {
            project,
            milestones: project.milestones
          };
        }
      }
      const response = await API.get(`/projects/${projectId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch project details');
    }
  }
);

const initialState = {
  projects: [],
  currentProject: null,
  stats: {
    totalProjects: 0,
    activeProjects: 0,
    escrowAmount: 0,
    totalEarnings: 0
  },
  loading: false,
  error: null,
  searchQuery: ""
};

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    clearProjectError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Stats
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      // Fetch Projects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Project
      .addCase(createProjectAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProjectAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.projects.unshift(action.payload);
      })
      .addCase(createProjectAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Project Details
      .addCase(getProjectDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProjectDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProject = action.payload;
      })
      .addCase(getProjectDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSearchQuery, clearProjectError } = projectSlice.actions;
export default projectSlice.reducer;

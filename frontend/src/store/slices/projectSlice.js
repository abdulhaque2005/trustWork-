import { createSlice } from '@reduxjs/toolkit';

const initialProjects = [
  {
    id: 'PRJ-4921',
    name: "E-commerce Redesign",
    client: "Fashion Hub",
    category: "Design",
    totalAmount: 1500,
    status: "Active",
    progress: 65,
    deadline: "Oct 30, 2026",
    milestones: [
      { id: 'M1', title: "Wireframes", amount: 500, status: "Released", deadline: "Oct 10" },
      { id: 'M2', title: "High-Fi Design", amount: 1000, status: "Locked", deadline: "Oct 25" },
    ],
    disputes: []
  }
];

const initialState = {
  projects: JSON.parse(localStorage.getItem('projects')) || initialProjects,
  payments: JSON.parse(localStorage.getItem('payments')) || [],
  activities: JSON.parse(localStorage.getItem('activities')) || [
    { id: 1, text: "System initialized", time: "Just now", type: "system" }
  ],
  searchQuery: ""
};

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    addProject: (state, action) => {
      const newProject = { ...action.payload, id: `PRJ-${Math.floor(1000 + Math.random() * 9000)}`, status: "Active", progress: 0, disputes: [] };
      state.projects.unshift(newProject);
      state.activities.unshift({ id: Date.now(), text: `New project created: ${newProject.name}`, time: "1m ago", type: "create" });
      localStorage.setItem('projects', JSON.stringify(state.projects));
      localStorage.setItem('activities', JSON.stringify(state.activities));
    },
    releaseMilestone: (state, action) => {
      const { projectId, milestoneId } = action.payload;
      const project = state.projects.find(p => p.id === projectId);
      if (project) {
        const milestone = project.milestones.find(m => m.id === milestoneId);
        if (milestone && milestone.status !== "Released") {
          milestone.status = "Released";
          state.activities.unshift({ id: Date.now(), text: `Milestone released: ${milestone.title}`, time: "Just now", type: "payment" });
          localStorage.setItem('projects', JSON.stringify(state.projects));
          localStorage.setItem('activities', JSON.stringify(state.activities));
        }
      }
    }
  },
});

export const { addProject, releaseMilestone, setSearchQuery } = projectSlice.actions;
export default projectSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  hourlyRate: 30,
  sprints: [],
  maintenanceCost: 0,
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setHourlyRate: (state, action) => {
      state.hourlyRate = action.payload;
    },
    setSprints: (state, action) => {
      state.sprints = action.payload;
    },
    setMaintenanceCost: (state, action) => {
      state.maintenanceCost = action.payload;
    },
    addSprint: (state, action) => {
      state.sprints.push(action.payload);
    },
    removeSprint: (state, action) => {
      state.sprints = state.sprints.filter(sprint => sprint.id !== action.payload);
    },
    updateSprint: (state, action) => {
      const { id, field, value } = action.payload;
      const sprint = state.sprints.find(sprint => sprint.id === id);
      if (sprint) {
        sprint[field] = value;
      }
    },
    addTask: (state, action) => {
      const { sprintId, task } = action.payload;
      const sprint = state.sprints.find(sprint => sprint.id === sprintId);
      if (sprint) {
        sprint.tasks.push(task);
      }
    },
    removeTask: (state, action) => {
      const { sprintId, taskIndex } = action.payload;
      const sprint = state.sprints.find(sprint => sprint.id === sprintId);
      if (sprint) {
        sprint.tasks.splice(taskIndex, 1);
      }
    },
    updateTask: (state, action) => {
      const { sprintId, taskIndex, field, value } = action.payload;
      const sprint = state.sprints.find(sprint => sprint.id === sprintId);
      if (sprint) {
        sprint.tasks[taskIndex][field] = value;
      }
    },
  },
});

export const {
  setHourlyRate,
  setSprints,
  setMaintenanceCost,
  addSprint,
  removeSprint,
  updateSprint,
  addTask,
  removeTask,
  updateTask,
} = projectSlice.actions;

export default projectSlice.reducer;

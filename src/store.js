import { configureStore } from '@reduxjs/toolkit';
import projectReducer from './slices/projectSlice';

const store = configureStore({
  reducer: {
    project: projectReducer,
  },
});

export default store;

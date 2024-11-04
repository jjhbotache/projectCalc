import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './slices/themeSlice';
import projectReducer from './slices/projectSlice';

const store = configureStore({
  reducer: {
    theme: themeReducer,
    project: projectReducer,
  },
});

export default store;

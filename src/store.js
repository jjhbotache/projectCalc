import { configureStore } from '@reduxjs/toolkit';
import projectReducer from './slices/projectSlice';
import configReducer from './slices/configSlice'; // Import the config reducer

const store = configureStore({
  reducer: {
    project: projectReducer,
    config: configReducer, // Add the config reducer
  },
});

export default store;

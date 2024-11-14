import { configureStore } from '@reduxjs/toolkit';
import projectReducer from './slices/projectSlice';
import configReducer from './slices/configSlice';
import chatReducer from './slices/chatSlice'; // Import the chat reducer

const store = configureStore({
  reducer: {
    project: projectReducer,
    config: configReducer,
    chat: chatReducer, // Add the chat reducer
  },
});

export default store;

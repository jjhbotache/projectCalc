import { configureStore } from '@reduxjs/toolkit';
import projectReducer from '@/slices/projectSlice';
import configReducer from '@/slices/configSlice';
import chatReducer from '@/slices/chatSlice';
import projectsReducer from '@/slices/projectsSlice';

const store = configureStore({
  reducer: {
    project: projectReducer,
    config: configReducer,
    chat: chatReducer,
    projectsSlice: projectsReducer, 
  },
});

export default store;

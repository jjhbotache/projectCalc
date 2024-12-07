import { createSlice } from '@reduxjs/toolkit';


const initialState = {
	projectIds: [
		0
	],
	currentProjectId: 0,
};

const projectsSlice = createSlice({
	name: 'projects',
	initialState,
	reducers: {
		setProjectIds(state, action) {
			state.projectIds = action.payload;
		},
		setCurrentProjectId(state, action) {
			state.currentProjectId = action.payload;
		},
		addProjectId(state, action) {
			state.projectIds.push(action.payload);
		},
		removeProjectId(state, action) {
			state.projectIds = state.projectIds.filter(id => id !== action.payload);
		},
	},
});


export const { setProjectIds, setCurrentProjectId, addProjectId, removeProjectId } = projectsSlice.actions;

export default projectsSlice.reducer;

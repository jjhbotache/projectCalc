import { createSlice } from '@reduxjs/toolkit';



const initialState = {
	projects: [
		
	],
	currentProjectId: null,
};

const projectsSlice = createSlice({
	name: 'projects',
	initialState,
	reducers: {
		registerProject(state, action) {
			const {
				project,
				history,
			} = action.payload;

			console.log("registering: ", project);
			
			state.projects.push({
				project,
				history,
			});
		},

		updateProject(state, action) {
			const {
				project,
				history,
			} = action.payload;

			const projectIndex = state.projects.findIndex((project) => project.project.id === project.id);
			if (projectIndex !== -1) {
				state.projects[projectIndex] = {
					project,
					history,
				};
			}
		},

		setCurrentProjectId(state, action) {
			state.currentProjectId = action.payload;
		},
		removeProject(state, action) {
			state.projects = state.projects.filter((project) => project.id !== action.payload);			
		},
	},
});


export const { updateProject,registerProject, setCurrentProjectId, removeProject } = projectsSlice.actions;

export default projectsSlice.reducer;

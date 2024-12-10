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

			
			state.projects.push({
				project,
				history,
			});
		},

		updateProject(state, action) {
			const {
				project,
				history,
				currentHistoryIndex
			} = action.payload;

			
			const projectIndex = state.projects.findIndex((proj) => proj.project.projectInfo.id === project.projectInfo.id);
			
			
			
			if (projectIndex !== -1) {
				
				const finalHistoryIndex = currentHistoryIndex
					? currentHistoryIndex
					:
					history
						? history.length - 1
						: null;

				state.projects[projectIndex] = {
					project,
					history: history || state.projects[projectIndex].history,
					currentHistoryIndex: finalHistoryIndex,
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

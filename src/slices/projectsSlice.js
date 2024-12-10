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
				history:[project],
				currentHistoryIndex: 0,
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
		
		loadProjectsFromLocalStorage(state) {
			if (localStorage.getItem('projects')) {
				return JSON.parse(localStorage.getItem('projects'));
			}
		},
	},
});


export const { updateProject,registerProject, setCurrentProjectId, removeProject, loadProjectsFromLocalStorage } = projectsSlice.actions;

export default projectsSlice.reducer;

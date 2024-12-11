import { createSlice } from '@reduxjs/toolkit';
import { initialState as initialProjectState } from '@/slices/projectSlice';
import { deleteAll } from './projectSlice';


const initialDefaultState = {
	projects: [
		// {
		// 	project,
		// 	history: [project],
		// 	currentHistoryIndex: 0,
		// }
	],
	currentProjectId: null,
};


const projectsSlice = createSlice({
	name: 'projects',
	initialState: 
		localStorage.getItem('projects')
			? JSON.parse(localStorage.getItem('projects'))
			: initialDefaultState
	,
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
			console.log("removing project: ", action.payload);
			const projectIndex = state.projects.findIndex((proj) => proj.project.projectInfo.id === action.payload);
			const projectIdToRemove = action.payload;
			
			if (state.projects.length === 1) {
				state.projects = [
					{
						project:initialProjectState,
						history:[initialProjectState],
						currentHistoryIndex: 0,
					}					
				];
				state.currentProjectId = 0;
				deleteAll();
			}else{

				const newProjects = state.projects.filter((proj) => proj.project.projectInfo.id !== action.payload);
				state.projects = newProjects;
				if (state.currentProjectId === projectIdToRemove) {

					const newIndex = projectIndex > 0 ? projectIndex - 1 : 0;
					state.currentProjectId = state.projects[newIndex].project.projectInfo.id;
				}
					

			}
			
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

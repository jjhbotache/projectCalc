import { initialFunctionality, initialState } from '../slices/projectSlice';
import { useSelector } from 'react-redux';

export default function useGemini() {
    const config = useSelector((state) => state.config);
    const { geminiApiKey:apiKey,  } = config;
    

    const generateContent = async (inputText) => {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: inputText }]
                }]
            })
        });
        const data = await response.json();
        return data;
    };

    const generateProjectFromDescription = async (description) => {
        // from a project description, generate a project in the form of a JSON object
        
        const projectJsonFormat = JSON.stringify(initialState);
        const prompt = `
            Generate a project from the following description:
            ${description}
            ---
            The project must be given in the following JSON format:
            ${projectJsonFormat}

            ANSWER ONLY WITH THE JSON FORMAT
        `

        try {
            const result = await generateContent(prompt);
            const text = result.candidates[0].content.parts[0].text;
            const parsedText = text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1);
            
            const project = JSON.parse(parsedText);

            return project;
        } catch (error) {
            console.error('Error generating project with Gemini API:', error);
        }
    };

    const editFunctionality = async (inputText,functionality) => {
        const initialFunctionalityJson = JSON.stringify(initialFunctionality);
        const functionalityJson = JSON.stringify(functionality);
        const prompt = `
            Edit the following functionality:
            ${functionalityJson}
            according to the following description:
            ${inputText}

            ---
            The functionality must be given in the following JSON format:
            ${initialFunctionalityJson}

        `
        try {
            const result = await generateContent(prompt);
            const text = result.candidates[0].content.parts[0].text;
            const parsedText = text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1);
            
            const updatedFunctionality = JSON.parse(parsedText);

            return updatedFunctionality;
        } catch (error) {
            console.error('Error generating project with Gemini API:', error);
        }
        
    };

    const editProject = async (inputText, project) => {
        const initialProjectJson = JSON.stringify(initialState);
        const projectJson = JSON.stringify(project);
        const prompt = `
            Edit the following project:
            ${projectJson}
            according to the following description:
            ${inputText}

            ---
            The project must be given in the following JSON format:
            ${initialProjectJson}

        `
        try {
            const result = await generateContent(prompt);
            const text = result.candidates[0].content.parts[0].text;
            const parsedText = text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1);
            
            const updatedProject = JSON.parse(parsedText);

            return updatedProject;
        } catch (error) {
            console.error('Error generating project with Gemini API:', error);
        }
    };



    const calculateTaskDifferences = (currentTasks, updatedTasks) => {
        const allTasks = [...currentTasks, ...updatedTasks];

        const diffs = allTasks.map((task) => {
            let status = '';
            let hours = task.hours;

            if (!currentTasks.find((t) => t.name === task.name)) {
                status = 'added';
            } else if (!updatedTasks.find((t) => t.name === task.name)) {
                status = 'removed';
            } else {
                const currentTask = currentTasks.find((t) => t.name === task.name);
                const updatedTask = updatedTasks.find((t) => t.name === task.name);
                const hourDifference = updatedTask.hours - currentTask.hours;

                if (hourDifference === 0) {
                    status = 'not modified';
                } else {
                    status = 'edited';
                    hours = hourDifference;
                }
            }

            return { ...task, status, hours };
        });

        return diffs.filter((task, index) => index === diffs.findIndex((t) => t.name === task.name));
    };

    const calculateProjectDifferences = (currentProject, newProject) => {
        const currentFunctionalities = currentProject.functionalities;
        const newFunctionalities = newProject.functionalities;

        let differences = [];

        

        newFunctionalities.forEach((func) => {
            if (!currentFunctionalities.find((f) => f.id === func.id)) {
                differences.push({ type: 'added', functionality: func });
            }
        });

        currentFunctionalities.forEach((func) => {
            if (!newFunctionalities.find((f) => f.id === func.id)) {
                differences.push({ type: 'removed', functionality: func });
            }
        });

        newFunctionalities.forEach((func) => {
            const currentFunc = currentFunctionalities.find((f) => f.id === func.id);
            if (currentFunc) {
                if (JSON.stringify(currentFunc) !== JSON.stringify(func)) {
                    
                    const taskDifferences = calculateTaskDifferences(currentFunc.tasks, func.tasks);
                    console.log(currentFunc.tasks, func.tasks);
                    console.log(taskDifferences);
                    
                    
                    differences.push({
                        type: 'edited',
                        functionality: func,
                        taskDifferences: taskDifferences,
                    });
                }
            }
        });

        // Calculate configuration differences
        const currentConfig = currentProject.config || {};
        const newConfig = newProject.config || {};

        // Check for added configurations
        Object.keys(newConfig).forEach((key) => {
            if (!currentConfig.hasOwnProperty(key)) {
                differences.push({ type: 'added', key, value: newConfig[key] });
            }
        });

        // Check for removed configurations
        Object.keys(currentConfig).forEach((key) => {
            if (!newConfig.hasOwnProperty(key)) {
                differences.push({ type: 'removed', key, value: currentConfig[key] });
            }
        });

        // Check for edited configurations
        Object.keys(newConfig).forEach((key) => {
            if (
                currentConfig.hasOwnProperty(key) &&
                currentConfig[key] !== newConfig[key]
            ) {
                differences.push({
                    type: 'edited',
                    key,
                    oldValue: currentConfig[key],
                    newValue: newConfig[key],
                });
            }
        });

        differences = differences.sort((a, b) => a.functionality?.id - b.functionality?.id || 0);
        console.log(differences);
        
        return differences;
    };

    const calculateConfigurationDifferences = (currentConfig = {}, newConfig = {}) => {
        let differences = [];

        // Check for added configurations
        Object.keys(newConfig).forEach((key) => {
            if (!currentConfig.hasOwnProperty(key)) {
                differences.push({ type: 'added', key, value: newConfig[key] });
            }
        });

        // Check for removed configurations
        Object.keys(currentConfig).forEach((key) => {
            if (!newConfig.hasOwnProperty(key)) {
                differences.push({ type: 'removed', key, value: currentConfig[key] });
            }
        });

        // Check for edited configurations
        Object.keys(newConfig).forEach((key) => {
            if (
                currentConfig.hasOwnProperty(key) &&
                currentConfig[key] !== newConfig[key]
            ) {
                differences.push({
                    type: 'edited',
                    key,
                    oldValue: currentConfig[key],
                    newValue: newConfig[key],
                });
            }
        });
        
        return differences;
    };

    return { generateProjectFromDescription, editFunctionality, editProject, calculateTaskDifferences, calculateProjectDifferences, calculateConfigurationDifferences };
};

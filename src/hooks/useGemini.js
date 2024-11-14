import { initialFunctionality, initialState } from '../slices/projectSlice';
import { addMessage } from '../slices/chatSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function useGemini() {
    const config = useSelector((state) => state.config);
    const project = useSelector((state) => state.project); // Include project data
    const { geminiApiKey: apiKey } = config;
    const chatHistory = useSelector((state) => state.chat.history);
    const dispatch = useDispatch();

    const generateContent = async (inputText) => {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    role: 'model',
                    parts: [{ text: `Project Info: ${JSON.stringify(project.projectInfo)}\nConfigurations: ${JSON.stringify(config)}` }]
                }, {
                    role: 'user',
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
            Take into account the expertise and techs of the programmer:
            ${JSON.stringify(config.technologiesKnown)}
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

    const editFunctionality = async (inputText, functionality) => {
        const initialFunctionalityJson = JSON.stringify(initialFunctionality);
        const functionalityJson = JSON.stringify(functionality);
        const prompt = `
            Edit the following functionality:
            ${functionalityJson}
            according to the following description:
            ${inputText}
            ---
            Take into account the expertise and techs of the programmer:
            ${JSON.stringify(config.technologiesKnown)}
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
            Take into account the expertise and techs of the programmer:
            ${JSON.stringify(config.technologiesKnown)}
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

    const sendMessage = async (message) => {
        dispatch(addMessage({ role: 'user', text: message }));

        // Assemble the prompt with project and config data
        const filteredConfig = { ...config };
        delete filteredConfig.geminiApiKey;

        const context = {
            role: 'user',
            parts: [{
                text: `
                    This is the context:
                    Project Info: ${JSON.stringify(project.projectInfo)}\nProgramer data: ${JSON.stringify(filteredConfig)}
                    ---
                    now, let's talk about the project
                    ---
                    ` }]
        };
        
        const prompt = {
            contents: [
                context,
                ...chatHistory.map(msg => ({
                    role: msg.role,
                    parts: [{ text: msg.text }]
                })),
                { role: 'user', parts: [{ text: message }] }
            ]
        };
        
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(prompt)
            });
            console.log("prompt", prompt);
            

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Gemini API Error:', errorData);
                dispatch(addMessage({ role: 'model', text: 'Sorry, something went wrong. Please try again later.' }));
                return;
            }

            const data = await response.json();

            if (data.candidates && data.candidates.length > 0 && data.candidates[0].content.parts.length > 0) {
                const reply = data.candidates[0].content.parts[0].text;
                dispatch(addMessage({ role: 'model', text: reply }));
            } else {
                console.error('Unexpected Gemini API response structure:', data);
                dispatch(addMessage({ role: 'model', text: 'Sorry, I couldn\'t process that. Please try again.' }));
            }
        } catch (error) {
            console.error('Error communicating with Gemini API:', error);
            dispatch(addMessage({ role: 'model', text: 'Sorry, an error occurred. Please try again later.' }));
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

    return { generateProjectFromDescription, editFunctionality, editProject, calculateTaskDifferences, calculateProjectDifferences, calculateConfigurationDifferences, sendMessage };
};

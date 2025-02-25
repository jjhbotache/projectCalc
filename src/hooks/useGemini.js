import { initialFunctionality, initialState } from '../slices/projectSlice';
import { addMessage } from '../slices/chatSlice';
import { useDispatch, useSelector } from 'react-redux';
import { calculateTotals } from '../utils/calculate';
import exhaustedGeminiResponse from '../mocks/exhaustedGeminiResponse.json'; // Import the mock response

export default function useGemini() {
    const config = useSelector((state) => state.config);
    const project = useSelector((state) => state.project);
    const { geminiApiKey: apiKey, model } = config; // now includes model
    const chatHistory = useSelector((state) => state.chat.history);
    const dispatch = useDispatch();

    
    

    // Updated generateContent: use model from config
    const generateContent = async (inputText) => {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [
                    {
                        role: 'model',
                        parts: [{ text: `
                            Current project Info: ${JSON.stringify(project.projectInfo)}
                            Configurations: ${JSON.stringify(config)}
                            ---  
                            Take into account the expertise and techs of the programmer: ${JSON.stringify(config.technologiesKnown)}
                        ` }]
                    },
                    {
                        role: 'user',
                        parts: [{ text: inputText }]
                    }
                ]
            })
        });
        const data = await response.json();
        console.log(data);
        
        if (data.status !== undefined) {
            throw new Error(data.message);
        }
        return data;
    };

    // New function: listModels
    const listModels = async () => {
        if (!apiKey) {
            console.log('API key is missing while listing models');
            return [];
        }
        
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
            const data = await response.json();
            // Filter models that support generateContent
            /*
            models: [{
                "name": "models/gemini-1.5-flash-001-tuning",
                "version": "001",
                "displayName": "Gemini 1.5 Flash 001 Tuning",
                "description": "Version of Gemini 1.5 Flash that supports tuning, our fast and versatile multimodal model for scaling across diverse tasks, released in May of 2024.",
                "inputTokenLimit": 16384,
                "outputTokenLimit": 8192,
                "supportedGenerationMethods": [
                    "generateContent",
                    "countTokens",
                    "createTunedModel"
                ],
                "temperature": 1,
                "topP": 0.95,
                "topK": 64,
                "maxTemperature": 2
            }]
            */
            const models = data.models?.filter(model => 
                model.supportedGenerationMethods?.includes('generateContent')
            ) || [];
            return models;
        } catch (error) {
            console.error('Error listing models:', error);
            return [];
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
            The functionality must be given in the following JSON format:
            ${initialFunctionalityJson}

            ANSWER ONLY WITH THE JSON FORMAT
        `;
        const result = await generateContent(prompt);
        const text = result.candidates[0].content.parts[0].text;
        const parsedText = text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1);
        const updatedFunctionality = JSON.parse(parsedText);
        return updatedFunctionality;
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
        `;
        const result = await generateContent(prompt);
        if (!result) return null; // Handle the case when result is null
        const text = result.candidates[0].content.parts[0].text;
        const parsedText = text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1);

        const project = JSON.parse(parsedText);

        return project;
    };

    const editProject = async (inputText) => {
        const initialProjectJson = JSON.stringify(initialState);
        const prompt = `
            Edit the following current project according to the following description:
            ${inputText}
            ---
            The project must be given in the following JSON format:
            ${initialProjectJson}

            ANSWER ONLY WITH THE JSON FORMAT
        `;
        const result = await generateContent(prompt);
        if (!result) return null; // Handle the case when result is null
        const text = result.candidates[0].content.parts[0].text;
        const parsedText = text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1);

        const updatedProject = JSON.parse(parsedText);

        return updatedProject;
    };


    // chat
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
                    Project Info: ${JSON.stringify(project.projectInfo)}
                    Programer data: ${JSON.stringify(filteredConfig)}
                    Totals: ${JSON.stringify(calculateTotals(project, config))}
                    ---
                    We are here to talk about the proyect
                    ---  
                    ` }]
        };

        const body = {
            contents: [
                context,
                ...chatHistory.map(msg => ({
                    role: msg.role,
                    parts: [{ text: msg.text }]
                })),
                { role: 'user', parts: [{ text: message }] }
            ],
            generationConfig: {
                "temperature": .15,
            }   
        };
        
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (response.status === 429) {
                console.error('Gemini API Error:', exhaustedGeminiResponse);
                dispatch(addMessage({ role: 'model', text: exhaustedGeminiResponse.message }));
                return;
            }

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


    return { generateProjectFromDescription, editFunctionality, editProject, sendMessage, listModels };
};

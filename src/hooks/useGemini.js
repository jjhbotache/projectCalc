import { initialState } from '../slices/projectSlice';
import { useSelector } from 'react-redux';

export default function useGemini() {
    const apiKey = useSelector((state) => state.config.geminiApiKey);

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

    return { generateProjectFromDescription };
};

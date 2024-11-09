import { GoogleGenerativeAI } from '@google/generative-ai';
import { initialState } from '../slices/projectSlice';

export default function useGemini() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const generateTextContent = async (prompt) => {
        try {
            const result = await model.generateContent(prompt);
            return result;
        } catch (error) {
            console.error('Error generating text content with Gemini API:', error);
        }
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
            const result = await model.generateContent(prompt);
            const text = result.response.candidates[0].content.parts[0].text;
            const parsedText = text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1);
            
            const project = JSON.parse( parsedText );
            console.log(project);

            return project
        } catch (error) {
            console.error('Error generating project with Gemini API:', error);
        }
    };


    return { generateTextContent, generateProjectFromDescription };
};

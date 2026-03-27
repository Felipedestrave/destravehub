
import { GoogleGenAI } from '@google/genai';

const geminiKey = "AIzaSyCYue2y-D4g6C5b6WunPlJQY8kpQwROHWk"; // From cat .env

async function listModels() {
    try {
        const ai = new GoogleGenAI({ apiKey: geminiKey });
        // The listModels call in some SDKs is different.
        // Let's assume there is an ai.models.list()
        const models = await ai.models.list();
        console.log('Available models:', JSON.stringify(models, null, 2));
    } catch (err) {
        console.error('ListModels Error:', err);
    }
}

listModels();

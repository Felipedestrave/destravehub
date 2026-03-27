
import { GoogleGenAI } from '@google/genai';

const geminiKey = "AIzaSyCYue2y-D4g6C5b6WunPlJQY8kpQwROHWk"; // From cat .env

async function testGemini() {
    try {
        const ai = new GoogleGenAI({ apiKey: geminiKey });
        const result = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: [{ role: 'user', parts: [{ text: 'Respond with a simple Hello' }] }],
        });
        console.log('Result text property:', result.text);
    } catch (err) {
        console.error('Gemini Error:', err);
    }
}

testGemini();

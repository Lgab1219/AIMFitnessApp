import { GoogleGenAI } from '@google/genai';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import dotenv from 'dotenv';

dotenv.config();

export default async function gemini(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message } = req.body;

    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

    const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: message
    })

    const reply = result?.text;
    
    return res.status(200).json({ reply });
}
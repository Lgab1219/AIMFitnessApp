import type { VercelRequest, VercelResponse } from "@vercel/node";
import dotenv from 'dotenv';

dotenv.config();

export default async function usda(req: VercelRequest, res: VercelResponse) {

    const query = req.query.query;

    const usdaAPI = process.env.USDA_API_KEY;

    if (!query) {
        return res.status(400).json({ error: 'Missing search query parameter' });
    }

    const response = await fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${usdaAPI}&query=${query}`);

    const data = await response.json();

    return res.status(200).json(data);
}
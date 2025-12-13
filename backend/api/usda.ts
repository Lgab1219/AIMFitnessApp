import type { VercelRequest, VercelResponse } from "@vercel/node";
import dotenv from 'dotenv';

dotenv.config();

type USDANutrient = {
    nutrientName: string;
    unitName: string;
    value: number;
}

type USDASearchResponse = {
    foods?: USDAFood[];
}

type USDAFood = {
    fdcId: number;
    description: string;
    foodNutrients?: USDANutrient[];
};

type SimplifiedFood = {
  id: number;
  name: string;
  calories: number | null;
};


export default async function usda(req: VercelRequest, res: VercelResponse) {

    const query = req.query.query;

    const usdaAPI = process.env.USDA_API_KEY;

    if (!query) {
        return res.status(400).json({ error: 'Missing search query parameter' });
    }

    const response = await fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${usdaAPI}&query=${query}`);

    const data: USDASearchResponse = await response.json();

      const filteredData: SimplifiedFood[] = (data.foods ?? [])
    .filter((food: USDAFood) => Array.isArray(food.foodNutrients))
    .map((food: USDAFood): SimplifiedFood => {
      const calories = food.foodNutrients?.find(
        (nutrient: USDANutrient) =>
          nutrient.nutrientName === "Energy" &&
          nutrient.unitName === "KCAL"
      );

      return {
        id: food.fdcId,
        name: food.description,
        calories: calories?.value ?? null,
      };
    })
    .filter((item: SimplifiedFood) => item.calories !== null)
    .slice(0, 10);

    return res.status(200).json(filteredData);
}
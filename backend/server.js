import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

//Search endpoint
app.get('/search', async (req, res) => {

    // Query parameter for the URL's search term
    const query = req.query.query;

    const usdaKey = process.env.USDA_API_KEY;

    if (!query) {
        return res.status(400).json({ error: 'Missing search query parameter.' });
    }

    try {
        // Initializing URL containing the search query
        const url = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${encodeURIComponent(usdaKey)}&query=${encodeURIComponent(query)}`;
        const response = await fetch(url); // Fetch the data in JSON format (ask for the data at the given URL's server)
        const data = await response.json(); // Parse the JSON response

        // Ensure foodNutrients is an array and extract relevant information
        const cleanedData = (data.foods || []).filter((food) => Array.isArray(food.foodNutrients))
        .map((food) => {
            const calories = food.foodNutrients.find(nutrient => nutrient.nutrientName === 'Energy' && nutrient.unitName === 'KCAL');

            return {
                id: food.fdcId,
                name: food.description,
                calories: calories ? calories.value : null
            };
        })
        // Remove entries without calorie information
        .filter(item => item.calories !== null).slice(0, 10); // Limit to top 10 results
        return res.json({ foods: cleanedData }); // Send the data to the client (front-end)
    } catch (error) {
        return res.status(500).json({ error: 'An error has occurred fetching data from the URL' });
    }
});

// Server starts and listens on port 3000 for incoming requests from the client
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
})

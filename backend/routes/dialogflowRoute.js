import express from "express";
import Food from "../models/foodModel.js"; // Import Food model
import Restaurant from "../models/restaurantModel.js"; // Import Restaurant model
import fs from "fs"; // To read response data dynamically

const router = express.Router();

// Load dynamic responses from a JSON file
const loadResponses = () => {
    const data = fs.readFileSync("responses.json");
    return JSON.parse(data);
};

// Webhook route for Dialogflow
router.post("/webhook", async (req, res) => {
    try {
        const intentName = req.body.queryResult.intent.displayName; // Get intent name
        const userQuery = req.body.queryResult.queryText.toLowerCase(); // Get user query
        const responses = loadResponses(); // Load latest responses

        let responseText = "Sorry, I don't understand.";

        // Intent: Get Restaurants
        if (intentName === "GetRestaurants") {
            const restaurants = await Restaurant.find();
            if (restaurants.length === 0) {
                responseText = "Sorry, no restaurants are available right now.";
            } else {
                responseText = "Here are some available restaurants: " + restaurants.map(r => r.name).join(", ") + ". Please select one.";
            }
        }

        // Intent: Get Food Items from a Restaurant
        else if (intentName === "GetFoodItems") {
            const restaurantName = req.body.queryResult.parameters.restaurant;
            const foodItems = await Food.find({ restaurant: restaurantName });

            if (foodItems.length === 0) {
                responseText = `Sorry, no food items are available at ${restaurantName}.`;
            } else {
                responseText = `Here are the available food items at ${restaurantName}: ` + foodItems.map(f => f.name).join(", ") + ".";
            }
        }

        // Handle static responses from JSON file
        else {
            for (let key in responses) {
                if (userQuery.includes(key)) {
                    responseText = responses[key];
                    break;
                }
            }
        }

        // Send response back to Dialogflow
        return res.json({ fulfillmentMessages: [{ text: { text: [responseText] } }] });

    } catch (error) {
        console.error("Error in webhook:", error);
        return res.json({ fulfillmentMessages: [{ text: { text: ["Something went wrong. Please try again later."] } }] });
    }
});

export default router;

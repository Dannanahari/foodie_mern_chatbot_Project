import express from "express";
import Food from "../models/FoodItem.js"; // Import your Food model

const router = express.Router();

router.post("/", async (req, res) => {
    console.log("Webhook received:", req.body);

    const intentName = req.body.queryResult?.intent?.displayName;
    const restaurantName = req.body.queryResult?.parameters?.restaurant; // Extract restaurant name from Dialogflow

    if (!intentName) {
        return res.json({ fulfillmentText: "I couldn't understand your request." });
    }

    try {
        if (intentName === "get_lowest_price") {
            if (!restaurantName) {
                return res.json({ fulfillmentText: "Please specify a restaurant name." });
            }

            // 🔹 Query MongoDB to get the lowest priced food item at the specified restaurant
            const cheapestItem = await Food.findOne({ restaurant: restaurantName }).sort({ price: 1 });

            if (cheapestItem) {
                return res.json({ fulfillmentText: `The lowest priced item at ${restaurantName} is ${cheapestItem.name} for ₹${cheapestItem.price}.` });
            } else {
                return res.json({ fulfillmentText: `I couldn't find any food items for ${restaurantName}.` });
            }
        } else {
            return res.json({ fulfillmentText: "I am not sure how to handle this request yet." });
        }
    } catch (error) {
        console.error("Error handling webhook:", error);
        return res.json({ fulfillmentText: "An error occurred while processing your request." });
    }
});

export default router;

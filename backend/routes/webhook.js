import express from "express";
import FoodItem from "../models/FoodItem.js";
import Order from "../models/Order.js";

const router = express.Router();

// Handle Dialogflow Webhook requests
router.post("/dialogflow-webhook", async (req, res) => {
    const intent = req.body.queryResult.intent.displayName;

    if (intent === "LowestPrice") {
        const restaurant = req.body.queryResult.parameters.restaurant;
        
        try {
            const lowestPrice = await FoodItem.findOne({ restaurant })
                .sort({ price: 1 })
                .select("name price")
                .lean();

            if (lowestPrice) {
                res.json({ fulfillmentText: `The lowest priced item in ${restaurant} is ${lowestPrice.name} for ₹${lowestPrice.price}.` });
            } else {
                res.json({ fulfillmentText: `Sorry, I couldn't find any food items for ${restaurant}.` });
            }
        } catch (error) {
            console.error("Error fetching price details:", error);
            res.json({ fulfillmentText: "There was an issue fetching price details. Please try again later." });
        }
    } else if (intent === "OrderFood") {
        const { food_item, restaurant } = req.body.queryResult.parameters;

        try {
            // Check if the food item exists in the selected restaurant
            const foodExists = await FoodItem.findOne({ name: food_item, restaurant });

            if (!foodExists) {
                return res.json({ fulfillmentText: `Sorry, ${food_item} is not available at ${restaurant}.` });
            }

            // Save order to database
            const newOrder = new Order({ foodItem: food_item, restaurant });
            await newOrder.save();

            res.json({ fulfillmentText: `Your order for ${food_item} at ${restaurant} has been placed successfully!` });
        } catch (error) {
            console.error("Error placing order:", error);
            res.json({ fulfillmentText: "There was an issue placing your order. Please try again later." });
        }
    } else {
        res.json({ fulfillmentText: "I didn't understand your request. Can you please repeat?" });
    }
});
export default router;


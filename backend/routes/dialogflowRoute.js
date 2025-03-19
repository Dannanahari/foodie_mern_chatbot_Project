import express from "express";
import fs from "fs"; // To read response data dynamically

const router = express.Router();

// Load dynamic responses from a JSON file
const loadResponses = () => {
    const data = fs.readFileSync("responses.json");
    return JSON.parse(data);
};

// Webhook route for Dialogflow
router.post("/webhook", (req, res) => {
    const responses = loadResponses(); // Load the latest responses

    // Extract the user query
    const userQuery = req.body.queryResult.queryText.toLowerCase();

    // Find the best matching response (default fallback)
    let responseText = "Sorry, I don't understand.";

    for (let key in responses) {
        if (userQuery.includes(key)) {
            responseText = responses[key];
            break;
        }
    }

    // Send the response to Dialogflow
    res.json({ fulfillmentMessages: [{ text: { text: [responseText] } }] });
});

export default router;

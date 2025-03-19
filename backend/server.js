import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import foodRouter from './routes/foodRoute.js';
import userRouter from './routes/userRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import Food from './models/foodModel.js';  // Import food model
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors());

// Database connection
connectDB();

// API endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static('uploads'));
app.use('/api/user', userRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

// Dialogflow Webhook Endpoint
app.post("/api/dialogflow/webhook", async (req, res) => {
    try {
        const intentName = req.body.queryResult.intent.displayName;

        if (intentName === "HungryIntent") {  // Replace with your intent name
            const foods = await Food.find(); // Fetch all restaurants/food items from DB
            
            if (foods.length === 0) {
                return res.json({
                    fulfillmentText: "Sorry, no restaurants are available right now."
                });
            }

            const foodList = foods.map(food => food.name).join(", ");
            return res.json({
                fulfillmentText: `I see you're hungry! Here are some available restaurants: ${foodList}. Please select one.`
            });
        }

        // Default response for unknown intents
        return res.json({
            fulfillmentText: "Sorry, I didn't understand that."
        });

    } catch (error) {
        console.error("Error in webhook:", error);
        return res.json({
            fulfillmentText: "Something went wrong. Please try again later."
        });
    }
});

app.get("/", (req, res) => {
    res.send("API working");
});

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});

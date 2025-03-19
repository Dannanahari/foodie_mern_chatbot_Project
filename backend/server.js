import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import Food from "./models/foodModel.js";
import "dotenv/config";

const app = express();
const port = process.env.PORT || 4000;

// ✅ Middleware
app.use(express.json());
app.use(cors());

// ✅ Database Connection
connectDB()
  .then(() => console.log("✅ Database Connected Successfully"))
  .catch((err) => {
    console.error("❌ Database Connection Failed:", err);
    process.exit(1);
  });

// ✅ API Endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// ✅ Dialogflow Webhook
app.post("/api/dialogflow/webhook", async (req, res) => {
    try {
        const intentName = req.body.queryResult.intent.displayName;

        if (intentName === "HungryIntent") {
            const foods = await Food.find();

            if (foods.length === 0) {
                return res.json({ fulfillmentText: "Sorry, no restaurants are available right now." });
            }

            const foodList = foods.map(food => food.name).join(", ");
            return res.json({ fulfillmentText: `Here are some available restaurants: ${foodList}.` });
        }

        // Default Response
        return res.json({ fulfillmentText: "Sorry, I didn’t understand that." });

    } catch (error) {
        console.error("❌ Error in webhook:", error);
        return res.json({ fulfillmentText: "Something went wrong. Please try again later." });
    }
});

// ✅ Home Route
app.get("/", (req, res) => {
    res.send("✅ API is working!");
});

// ✅ Start Server
app.listen(port, () => {
    console.log(`🚀 Server started on http://localhost:${port}`);
});

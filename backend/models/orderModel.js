import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    foodItem: { type: String, required: true },
    restaurant: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Order", OrderSchema);

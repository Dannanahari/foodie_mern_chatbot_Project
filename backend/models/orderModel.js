import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // ID of the user placing the order
    items: { type: Array, required: true },  // List of items in the order
    amount: { type: Number, required: true }, // Total order amount (optional if not needed)
    address: { type: Object, required: true }, // Delivery address
    status: { type: String, default: "Order Placed" }, // Default status for orders
    date: { type: Date, default: Date.now }, // Timestamp for the order
    payment: { type: Boolean, default: false }, // Retain this if payment tracking is needed later, or remove if unnecessary
});

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;

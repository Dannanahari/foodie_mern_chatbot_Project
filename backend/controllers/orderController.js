import orderModel from './../models/orderModel.js';
import userModel from './../models/userModel.js';

// Placing user order for frontend
const placeOrder = async (req, res) => {
    try {
        // Create a new order
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount, // Optional, keep if you need for displaying
            address: req.body.address,
            payment: false, // Payment is not required, set it to false
            status: "Order Placed", // Default status for the order
        });

        // Save the new order
        await newOrder.save();

        // Clear the user's cart
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        // Send a success response
        res.json({ success: true, message: "Order placed successfully!" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error placing the order" });
    }
};

// Verifying order (Not required if no payment, but keeping it here)
const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success === 'true') {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Order successfully verified!" });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Order verification failed!" });
        }
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error verifying the order" });
    }
};

// User's orders for frontend
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error fetching orders" });
    }
};

// Listing all orders for admin panel
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error fetching all orders" });
    }
};

// Updating order status
const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Order status updated successfully!" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error updating order status" });
    }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };

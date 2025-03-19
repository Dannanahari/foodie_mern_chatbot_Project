import express from "express";
import authMiddleware from './../middleware/auth.js';
import { placeOrder, userOrders, listOrders, updateStatus } from "../controllers/orderController.js";

const orderRouter = express.Router();

// Route to place an order (requires authentication)
orderRouter.post("/place", authMiddleware, placeOrder);

// Route to fetch user-specific orders (requires authentication)
orderRouter.post("/userorders", authMiddleware, userOrders);

// Route to list all orders (for admin, consider adding an admin middleware)
orderRouter.get("/list", authMiddleware, listOrders);

// Route to update the status of an order (requires authentication or admin check)
orderRouter.post("/status", authMiddleware, updateStatus);

export default orderRouter;

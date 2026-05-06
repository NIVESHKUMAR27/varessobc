import express from "express";
import { getMyOrders } from "../controllers/orderController.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/my-orders", verifyToken, getMyOrders);

export default router;
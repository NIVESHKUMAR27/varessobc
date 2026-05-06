import express from "express";
import { createPaymentOrder, verifyPaymentAndPlaceOrder } from "../controllers/paymentController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-order", authMiddleware, createPaymentOrder);
router.post("/verify-payment", authMiddleware, verifyPaymentAndPlaceOrder);

export default router;
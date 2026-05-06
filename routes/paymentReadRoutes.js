import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getPayments } from "../controllers/paymentReadController.js";

const router = express.Router();

router.get("/get", authMiddleware, getPayments);

export default router;
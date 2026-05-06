import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createRazorpayQr,
  fetchRazorpayQr,
} from "../controllers/paymentQrController.js";
import {
  getPayments,
  getPaymentStatus,
} from "../controllers/paymentReadController.js";

const router = express.Router();

router.post("/create-qr", authMiddleware, createRazorpayQr);
router.get("/fetch-qr/:qrId", authMiddleware, fetchRazorpayQr);
router.get("/status/:qrId", authMiddleware, getPaymentStatus);
router.get("/my-payments", authMiddleware, getPayments);

export default router;
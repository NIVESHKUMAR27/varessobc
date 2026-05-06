import express from "express";
import {
  getAdminDashboard,
  updateOrderStatus,
  updateTrackingNumber,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/dashboard", getAdminDashboard);
router.patch("/orders/:orderId/status", updateOrderStatus);
router.patch("/orders/:orderId/tracking", updateTrackingNumber);

export default router;
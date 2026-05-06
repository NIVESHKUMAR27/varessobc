import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

import paymentRoutes from "./paymentRoutes.js";
import orderRoutes from "./orderRoutes.js";
import paymentReadRoutes from "./paymentReadRoutes.js";

import {
  signup,
  verifyOtp,
  login,
  verifyLoginOtp,
  sendResetOtp,
  verifyResetOtp,
  resetPassword,
  getMe,
  updateProfile,
  toggleWishlist,
  getWishlist,
  addToCart,
  getCart,
  removeFromCart,
  resendSignupOtp,
  resendLoginOtp,
  resendResetOtp,
} from "../controllers/authController.js";

const router = express.Router();

/* ================= AUTH ================= */

/* SIGNUP */
router.post("/signup", signup);
router.post("/verify-otp", verifyOtp);
router.post("/resend-signup-otp", resendSignupOtp);

/* LOGIN */
router.post("/login", login);
router.post("/verify-login-otp", verifyLoginOtp);
router.post("/resend-login-otp", resendLoginOtp);

/* USER DATA */
router.get("/me", authMiddleware, getMe);

/* ================= PASSWORD RESET FLOW ================= */

/* Step 1: Send Reset OTP */
router.post("/send-reset-otp", sendResetOtp);

/* Step 2: Verify Reset OTP */
router.post("/verify-reset-otp", verifyResetOtp);

/* Step 3: Reset Password */
router.post("/reset-password", resetPassword);

/* Resend Reset OTP */
router.post("/resend-reset-otp", resendResetOtp);

/* ================= ❤️ WISHLIST ================= */

router.post(
  "/wishlist/toggle",
  authMiddleware,
  toggleWishlist
);

router.get(
  "/wishlist/get",
  authMiddleware,
  getWishlist
);

/* ================= 🛒 CART ================= */

router.post(
  "/cart/add",
  authMiddleware,
  addToCart
);

router.get(
  "/cart/get",
  authMiddleware,
  getCart
);

router.delete(
  "/cart/remove",
  authMiddleware,
  removeFromCart
);

/* ================= 💳 PAYMENT ================= */

router.use("/payment", paymentRoutes);
router.use("/payments", paymentReadRoutes);

/* ================= 📦 ORDERS ================= */

router.use("/orders", orderRoutes);

/* ================= 👤 PROFILE UPDATE ================= */

router.put(
  "/update-profile",
  authMiddleware,
  upload.single("profileImage"),
  updateProfile
);

export default router;
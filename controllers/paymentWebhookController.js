import crypto from "crypto";
import Payment from "../models/Payment.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

const generateOrderNumber = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `VAR-${timestamp}${random}`;
};

export const razorpayWebhook = async (req, res) => {
  try {
    console.log("🔥 WEBHOOK HIT");

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];

    if (!secret) {
      return res.status(500).json({
        success: false,
        message: "Webhook secret missing",
      });
    }

    const expected = crypto
      .createHmac("sha256", secret)
      .update(req.body)
      .digest("hex");

    if (expected !== signature) {
      console.log("❌ SIGNATURE FAILED");
      return res.status(400).json({
        success: false,
        message: "Invalid signature",
      });
    }

    console.log("✅ SIGNATURE VERIFIED");

    const body = JSON.parse(req.body.toString());
    console.log("EVENT:", body.event);

    if (body.event !== "payment.captured") {
      return res.status(200).json({
        success: true,
        message: "Event ignored",
      });
    }

    const entity = body.payload?.payment?.entity;

    if (!entity) {
      console.log("❌ PAYMENT ENTITY MISSING");
      return res.status(400).json({
        success: false,
        message: "Payment entity missing",
      });
    }

    console.log("PAYMENT ENTITY:", entity.id);
    console.log("QR CODE ID:", entity.qr_code_id);
    console.log("NOTES:", entity.notes);

    const paymentDbId = entity?.notes?.paymentDbId;

    let payment = null;

    if (paymentDbId) {
      payment = await Payment.findById(paymentDbId);
    }

    if (!payment && entity?.qr_code_id) {
      payment = await Payment.findOne({
        razorpayQrCodeId: entity.qr_code_id,
      });
    }

    if (!payment && entity?.id) {
      payment = await Payment.findOne({
        razorpayPaymentId: entity.id,
      });
    }

    if (!payment) {
      console.log("⚠️ PAYMENT NOT FOUND");
      return res.status(200).json({
        success: true,
        message: "Payment not found",
      });
    }

    if (payment.status === "success" && payment.orderCreated && payment.orderId) {
      console.log("ℹ️ PAYMENT ALREADY FULLY PROCESSED");
      return res.status(200).json({
        success: true,
        message: "Already processed",
      });
    }

    payment.status = "success";
    payment.razorpayPaymentId = entity.id || "";
    payment.razorpayOrderId = entity.order_id || "";
    payment.paidAt = new Date();

    await payment.save();
    console.log("✅ PAYMENT UPDATED");

    if (!payment.orderCreated) {
      const finalItems = (payment.items || []).map((item) => ({
        productId: Number(item.productId || 0),
        name: item.name || "",
        brand: item.brand || "VARESSO",
        Fragrance: item.Fragrance || item.fragrance || "",
        MRP: Number(item.MRP || item.mrp || 0),
        quantity: Number(item.quantity || 1),
        price: Number(item.price || 0),
        image: item.image || "",
        profileimage: item.profileimage || "",
      }));

      const finalTotalAmount = finalItems.reduce((sum, item) => {
        return sum + Number(item.quantity || 0) * Number(item.price || 0);
      }, 0);

      const order = await Order.create({
        userId: payment.userId,
        orderNumber: generateOrderNumber(),
        name: payment.userName || "",
        email: payment.email || "",
        phone: payment.phone || "",
        address: payment.address || {
          addressLine: "",
          city: "",
          state: "",
          pincode: "",
        },
        items: finalItems,
        totalAmount: Number(finalTotalAmount || 0),
        paymentStatus: "paid",
        orderStatus: "PLACED",
        trackingNumber: "",
        placedAt: new Date(),
      });

      payment.orderCreated = true;
      payment.orderId = order._id;
      payment.orderNumber = order.orderNumber;
      payment.totalAmount = Number(finalTotalAmount || 0);

      await payment.save();
      console.log("✅ ORDER CREATED AND SAVED IN PAYMENT");

      try {
  const cleanNumber = (value) => {
  if (value === undefined || value === null) return 0;
  return Number(String(value).replace(/[₹,\s]/g, "")) || 0;
};

const emailData = {
  name: order.name || payment.userName || "",
  email: order.email || payment.email || "",
  phone: order.phone || payment.phone || "",
  orderNumber: order.orderNumber,
  createdAt: order.placedAt || order.createdAt,

  items: (order.items || []).map((item) => {
    const qty = cleanNumber(item.quantity) || 1;
    const price = cleanNumber(item.price);

    const mrp = cleanNumber(
  item.MRP ||
  item.mrp ||
  item.original ||
  item.originalPrice ||
  item.price
);

const fragrance =
  item.Fragrance ||
  item.fragrance ||
  item.category ||
  "Premium Fragrance";

    return {
      name: item.name || "Product",
      brand: item.brand || "VARESSO",
      quantity: qty,
      price: price,
      Fragrance:
      item.Fragrance ||
      item.fragrance ||
      item.category ||
      "Premium Fragrance",

      MRP: Number(item.MRP || item.mrp || item.originalPrice || item.original || item.price || 0),
      image: item.image || "",
    };
  }),

  totalAmount:
    cleanNumber(order.totalAmount) ||
    (order.items || []).reduce((sum, item) => {
      const qty = cleanNumber(item.quantity) || 1;
      const price = cleanNumber(item.price);
      return sum + price * qty;
    }, 0),

  address: order.address || payment.address || {},

  currency: payment.currency || "INR",
  method: payment.method || "-",
  status: payment.status || "-",
  razorpayQrCodeId: payment.razorpayQrCodeId || "-",
  razorpayPaymentId: payment.razorpayPaymentId || "-",
};

  // ✅ USER MAIL: Order Confirmed
  if (order.email || payment.email) {
    await sendEmail(
      order.email || payment.email,
      "order-confirmation",
      null,
      emailData
    );

    console.log("📩 ORDER CONFIRMATION EMAIL SENT TO CUSTOMER");
  } else {
    console.log("⚠️ CUSTOMER EMAIL NOT SENT: email missing");
  }

  // ✅ ADMIN MAIL: New Order Received
  if (ADMIN_EMAIL) {
    await sendEmail(
      ADMIN_EMAIL,
      "admin-order",
      null,
      emailData
    );

    console.log("📩 NEW ORDER EMAIL SENT TO ADMIN");
  } else {
    console.log("⚠️ ADMIN EMAIL NOT SENT: ADMIN_EMAIL missing in .env");
  }
} catch (emailErr) {
  console.error("❌ ORDER EMAIL ERROR:", emailErr);
}

      await User.findByIdAndUpdate(payment.userId, {
        $set: { cart: [] },
      });

      console.log("🛒 CART CLEARED");
    }

    return res.status(200).json({
      success: true,
      message: "Webhook processed successfully",
      paymentId: payment._id,
      orderId: payment.orderId || null,
      orderNumber: payment.orderNumber || "",
    });
  } catch (err) {
    console.error("❌ WEBHOOK ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Webhook failed",
    });
  }
};
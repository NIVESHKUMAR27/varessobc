import Payment from "../models/Payment.js";

export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.userId }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      payments,
    });
  } catch (err) {
    console.error("GET PAYMENTS ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payments",
    });
  }
};

export const getPaymentStatus = async (req, res) => {
  try {
    const { qrId } = req.params;

    if (!qrId) {
      return res.status(400).json({
        success: false,
        message: "QR id is required",
      });
    }

    const payment = await Payment.findOne({
      razorpayQrCodeId: qrId,
      userId: req.userId,
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    return res.status(200).json({
      success: true,
      status: payment.status,
      orderCreated: payment.orderCreated,
      orderId: payment.orderId || null,
      paymentId: payment.razorpayPaymentId || "",
    });
  } catch (err) {
    console.error("GET PAYMENT STATUS ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to get payment status",
    });
  }
};
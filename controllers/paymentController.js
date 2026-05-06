import "dotenv/config";
import crypto from "crypto";
import Razorpay from "razorpay";
import User from "../models/User.js";
import Order from "../models/Order.js";
import Payment from "../models/Payment.js";
import Product from "../models/Product.js";

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error("Razorpay env keys missing");
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const buildGroupedCart = async (cart = []) => {
  const grouped = {};

  for (const cartItem of cart) {
    const productId = Number(cartItem.id || cartItem.productId);

    if (!productId) continue;

    const product = await Product.findOne({ id: productId });

    if (!product) continue;

    const singlePrice = Number(product.price || 0);

    if (!grouped[productId]) {
      grouped[productId] = {
        productId,
        name: product.name || "",
        brand: product.brand || "VARESSO",
        MRP: Number(product.MRP || product.mrp || product.price || 0),
        Fragrance: product.Fragrance || product.fragrance || "Premium Fragrance",
        productQty: product.quantity || "",
        cartQty: 1,
        price: singlePrice,
        totalPrice: singlePrice,
        image: product.images?.[0] || "",
        profileimage: product.images?.[0] || "",
      };
    } else {
      grouped[productId].cartQty += 1;
      grouped[productId].totalPrice =
        Number(grouped[productId].cartQty) * Number(grouped[productId].price);
    }
  }

  return Object.values(grouped);
};

const getCartTotal = (products = []) => {
  return products.reduce((sum, item) => {
    return sum + Number(item.price || 0) * Number(item.cartQty || 0);
  }, 0);
};

const generateOrderNumber = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `VAR-${timestamp}${random}`;
};

/* CREATE PAYMENT ORDER */
export const createPaymentOrder = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const groupedProducts = await buildGroupedCart(user.cart || []);
    const totalAmount = getCartTotal(groupedProducts);

    console.log("USER CART:", user.cart);
    console.log("GROUPED PRODUCTS:", groupedProducts);
    console.log("TOTAL AMOUNT:", totalAmount);

    if (!groupedProducts.length || totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    const totalAmountPaise = Math.round(Number(totalAmount) * 100);

    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmountPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: String(user._id),
        userName: user.name || "",
      },
    });

    return res.json({
      success: true,
      order: razorpayOrder,
      amount: totalAmount,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("CREATE PAYMENT ORDER ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message || "Failed to create payment order",
      error: err.message,
    });
  }
};

/* VERIFY + SAVE */
export const verifyPaymentAndPlaceOrder = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment details",
      });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const existingPayment = await Payment.findOne({
      razorpayPaymentId: razorpay_payment_id,
    });

    if (existingPayment) {
      const existingOrder = await Order.findOne({
        razorpayPaymentId: razorpay_payment_id,
      });

      return res.json({
        success: true,
        message: "Payment already processed",
        order: existingOrder || null,
      });
    }

    const groupedProducts = await buildGroupedCart(user.cart || []);
    const totalAmount = getCartTotal(groupedProducts);

    console.log("VERIFY GROUPED PRODUCTS:", groupedProducts);
    console.log("VERIFY TOTAL AMOUNT:", totalAmount);

    if (!groupedProducts.length || totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    let paymentDetails = null;

    try {
      paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);
    } catch (fetchErr) {
      console.error("PAYMENT FETCH ERROR:", fetchErr);
    }

    const transactionId =
      paymentDetails?.acquirer_data?.rrn ||
      paymentDetails?.acquirer_data?.upi_transaction_id ||
      razorpay_payment_id;

    const upiId =
      paymentDetails?.vpa ||
      paymentDetails?.acquirer_data?.vpa ||
      "";

    const items = groupedProducts.map((item) => ({
      productId: Number(item.productId),
      name: item.name || "",
      brand: item.brand || "VARESSO",
      MRP: Number(item.MRP || item.price || 0),
      Fragrance: item.Fragrance || "Premium Fragrance",
      quantity: Number(item.cartQty || 1),
      price: Number(item.price || 0),
      image: item.image || "",
      profileimage: item.profileimage || "",
    }));

    const orderRecord = await Order.create({
      userId: user._id,
      orderNumber: generateOrderNumber(),
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: {
        addressLine: user.address?.addressLine || "",
        city: user.address?.city || "",
        state: user.address?.state || "",
        pincode: user.address?.pincode || "",
      },
      items: items.map((item) => ({
        productId: Number(item.productId),
        name: item.name,
        brand: item.brand,
        MRP: Number(item.MRP || item.price || 0),
        Fragrance: item.Fragrance || "Premium Fragrance",
        quantity: Number(item.quantity || 1),
        price: Number(item.price || 0),
        image: item.image || "",
        profileimage: item.profileimage || "",
      })),
      totalAmount: Number(totalAmount || 0),
      paymentStatus: "paid",
      orderStatus: "PLACED",
      placedAt: new Date(),
    });

    const paymentRecord = await Payment.create({
      userId: user._id,
      userName: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: {
        addressLine: user.address?.addressLine || "",
        city: user.address?.city || "",
        state: user.address?.state || "",
        pincode: user.address?.pincode || "",
      },
      items,
      totalAmount: Number(totalAmount || 0),
      currency: "INR",
      method: "upi",
      status: "success",
      upiId,
      transactionId,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      paidAt: new Date(),
      orderCreated: true,
      orderId: orderRecord._id,
      orderNumber: orderRecord.orderNumber,
    });

    user.cart = [];
    await user.save();

    return res.json({
      success: true,
      message: "Order placed successfully",
      order: orderRecord,
      payment: paymentRecord,
    });
  } catch (err) {
    console.error("VERIFY PAYMENT ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: err.message,
    });
  }
};
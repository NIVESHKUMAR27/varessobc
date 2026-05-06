import User from "../models/User.js";
import Payment from "../models/Payment.js";
import Product from "../models/Product.js";

const buildGroupedCart = async (cart = []) => {
  const grouped = {};

  for (const cartItem of cart) {
    const productId = Number(cartItem.id || cartItem.productId);

    if (!productId) continue;

    const product = await Product.findOne({ id: productId });

    if (!product) continue;

    if (!grouped[product.id]) {
      grouped[product.id] = {
        productId: Number(product.id),
        name: product.name || "",
        brand: product.brand || "VARESSO",
        MRP: Number(product.MRP || product.mrp || product.price || 0),

        Fragrance:
        product.Fragrance ||
        product.fragrance ||
        product.category ||
        "Premium Fragrance",
        price: Number(product.price || 0),

        quantity: 1,
        size: product.quantity || "50mL",
        image: product.images?.[0] || "",
      };
    } else {
      grouped[product.id].quantity += 1;
    }
  }

  return Object.values(grouped);
};

const getCartTotal = (items = []) => {
  return items.reduce((sum, item) => {
    return sum + Number(item.price || 0) * Number(item.quantity || 1);
  }, 0);
};

const getCartMrpTotal = (items = []) => {
  return items.reduce((sum, item) => {
    return sum + Number(item.MRP || 0) * Number(item.quantity || 1);
  }, 0);
};

const getBasicAuthHeader = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("Razorpay keys missing");
  }

  const token = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  return `Basic ${token}`;
};

export const createRazorpayQr = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const items = await buildGroupedCart(user.cart || []);
    const totalAmount = getCartTotal(items);
    const totalMrp = getCartMrpTotal(items);

    if (!items.length || totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    const payment = await Payment.create({
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
      totalMRP: totalMrp,
      totalAmount,
      currency: "INR",
      method: "upi",
      status: "pending",
      orderCreated: false,
    });

    const closeBy = Math.floor(Date.now() / 1000) + 30 * 60;

    const payload = {
      type: "upi_qr",
      usage: "single_use",
      fixed_amount: true,
      payment_amount: Math.round(totalAmount * 100),
      name: "VARESSO",
      description: "VARESSO Payment",
      close_by: closeBy,
      notes: {
        userId: String(user._id),
        paymentDbId: String(payment._id),
      },
    };

    const rpRes = await fetch("https://api.razorpay.com/v1/payments/qr_codes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: getBasicAuthHeader(),
      },
      body: JSON.stringify(payload),
    });

    const rpText = await rpRes.text();

    let rpData;
    try {
      rpData = JSON.parse(rpText);
    } catch {
      await Payment.findByIdAndDelete(payment._id);
      throw new Error("Razorpay QR API did not return JSON");
    }

    if (!rpRes.ok) {
      await Payment.findByIdAndDelete(payment._id);

      return res.status(rpRes.status).json({
        success: false,
        message:
          rpData?.error?.description ||
          rpData?.message ||
          "Failed to create Razorpay QR",
        razorpay: rpData,
      });
    }

    payment.razorpayQrCodeId = rpData.id;
    await payment.save();

    return res.status(200).json({
      success: true,
      qr: {
        id: rpData.id,
        image_url: rpData.image_url,
        payment_amount: rpData.payment_amount,
        status: rpData.status,
        close_by: rpData.close_by,
      },
      amount: totalAmount,
      totalMRP: totalMrp,
      paymentId: payment._id,
    });
  } catch (err) {
    console.error("CREATE QR ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to create Razorpay QR",
    });
  }
};

export const fetchRazorpayQr = async (req, res) => {
  try {
    const { qrId } = req.params;

    if (!qrId) {
      return res.status(400).json({
        success: false,
        message: "QR id is required",
      });
    }

    const rpRes = await fetch(
      `https://api.razorpay.com/v1/payments/qr_codes/${qrId}`,
      {
        method: "GET",
        headers: {
          Authorization: getBasicAuthHeader(),
        },
      }
    );

    const rpText = await rpRes.text();

    let rpData;
    try {
      rpData = JSON.parse(rpText);
    } catch {
      throw new Error("Razorpay fetch QR API did not return JSON");
    }

    if (!rpRes.ok) {
      return res.status(rpRes.status).json({
        success: false,
        message:
          rpData?.error?.description ||
          rpData?.message ||
          "Failed to fetch Razorpay QR",
        razorpay: rpData,
      });
    }

    return res.status(200).json({
      success: true,
      qr: {
        id: rpData.id,
        image_url: rpData.image_url,
        status: rpData.status,
        payment_amount: rpData.payment_amount,
        payments_amount_received: rpData.payments_amount_received,
        payments_count_received: rpData.payments_count_received,
      },
    });
  } catch (err) {
    console.error("FETCH QR ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch Razorpay QR",
    });
  }
};
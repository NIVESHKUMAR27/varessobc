import Order from "../models/Order.js";
import Payment from "../models/Payment.js";

const getTodayRange = () => {
  const now = new Date();

  const start = new Date(now);
  start.setHours(0, 0, 0, 0);

  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

export const getAdminDashboard = async (req, res) => {
  try {
    const { start, end } = getTodayRange();

    const [orders, payments] = await Promise.all([
  Order.find({}).sort({ createdAt: -1 }).lean(),

  Payment.find({
    status: {
      $in: ["success"],
    },
  })
    .sort({ createdAt: -1 })
    .lean(),
]);

    const overallAmount = orders.reduce((sum, order) => {
      return sum + Number(order.totalAmount ?? 0);
    }, 0);

    const todayOrders = orders.filter((order) => {
      const orderDate = new Date(order.placedAt || order.createdAt);
      return orderDate >= start && orderDate <= end;
    });

    const todayAmount = todayOrders.reduce((sum, order) => {
      return sum + Number(order.totalAmount ?? 0);
    }, 0);

    console.log(
      "ORDERS:",
      orders.map((o) => ({
        orderNumber: o.orderNumber,
        totalAmount: o.totalAmount,
      }))
    );

    console.log("OVERALL AMOUNT:", overallAmount);
    console.log("TODAY AMOUNT:", todayAmount);

    return res.status(200).json({
      success: true,
      summary: {
        overallAmount,
        todayAmount,
        orderCount: orders.length,
        paymentCount: payments.length,
        todayDate: new Date(),
      },
      orders,
      payments,
    });
  } catch (error) {
    console.error("GET ADMIN DASHBOARD ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin dashboard",
      error: error.message,
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    const allowedStatuses = [
      "PLACED",
      "SHIPPING",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
    ];

    if (!allowedStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      order: updatedOrder,
    });
  } catch (error) {
    console.error("UPDATE ORDER STATUS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message,
    });
  }
};

export const updateTrackingNumber = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { trackingNumber } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { trackingNumber: trackingNumber?.trim() || "" },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      order: updatedOrder,
    });
  } catch (error) {
    console.error("UPDATE TRACKING ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to save tracking number",
      error: error.message,
    });
  }
};
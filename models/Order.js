import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: Number },
    name: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    price: { type: Number, default: 0 },
    MRP: { type: Number, default: 0 },
    Fragrance: { type: String, default: "" },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    name: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },

    address: {
      addressLine: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      pincode: { type: String, default: "" },
    },

    items: [orderItemSchema],

        totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },

orderStatus: {
  type: String,
  enum: ["PLACED", "SHIPPING", "OUT_FOR_DELIVERY", "DELIVERED"],
  default: "PLACED",
},

trackingNumber: {
  type: String,
  default: "",
},

    paymentStatus: { type: String, default: "paid" },

    placedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
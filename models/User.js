import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    addressLine: String,
    city: String,
    state: String,
    pincode: String,
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    phone: String,

    profileImage: {
      type: String,
      default: "",
    },

    lastCartActivity: {
  type: Date,
  default: null,
},

    address: addressSchema,

    wishlist: [
      {
        id: Number,
        name: String,
      },
    ],

    cart: [
      {
        id: Number,
        name: String,
      },
    ],

    otp: String,
    otpExpiry: Date,

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
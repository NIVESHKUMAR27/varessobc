import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";
import Product from "../models/Product.js";

/* ================= SIGNUP ================= */
export const signup = async (req, res) => {
  try {
    const { name, password, phone, address } = req.body;
    const email = req.body.email?.trim().toLowerCase();

    if (!name || !email || !password || !phone || !address) {
      return res.status(400).json({ message: "All fields required" });
    }

    let user = await User.findOne({ email });

    if (user && user.isVerified) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPass = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    if (!user) {
      user = new User({
        name,
        email,
        password: hashedPass,
        phone,
        address,
      });
    } else {
      user.name = name;
      user.password = hashedPass;
      user.phone = phone;
      user.address = address;
    }

    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;
    user.isVerified = false;

    await user.save();

    try {
      await sendEmail(email, "otp", otp);
    } catch (emailErr) {
      console.error("EMAIL ERROR:", emailErr);
      return res.status(500).json({
        success: false,
        message: "OTP email send failed",
      });
    }

    res.json({
      success: true,
      message: "OTP sent to email",
    });
  } catch (err) {
    console.error("SIGNUP ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= RESEND SIGNUP OTP ================= */
export const resendSignupOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;

    await user.save();

    try {
      await sendEmail(email, "otp", otp);
    } catch (err) {
      console.error("EMAIL ERROR:", err);
    }

    res.json({ success: true, message: "Signup OTP resent successfully" });
  } catch (err) {
    console.error("RESEND SIGNUP OTP ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= VERIFY OTP (SIGNUP) ================= */
export const verifyOtp = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const { otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // ✅ VERIFY SUCCESS
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    // 🎉 SEND WELCOME EMAIL (ADD THIS)
    try {
      await sendEmail(email, "welcome");
    } catch (err) {
      console.error("WELCOME EMAIL ERROR:", err);
    }

    // 🔐 TOKEN GENERATE
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "OTP verified",
      token,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= LOGIN ================= */
export const login = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const { password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: "Verify OTP first" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 🔐 Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;

    await user.save();

    // 📩 Send OTP
    try {
      await sendEmail(email, "otp", otp);
    } catch (emailErr) {
      console.error("EMAIL ERROR:", emailErr);
      return res.status(500).json({
        success: false,
        message: "OTP email send failed",
      });
    }

    res.json({
      success: true,
      message: "OTP sent to email",
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= RESEND LOGIN OTP ================= */
export const resendLoginOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: "Verify signup OTP first" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;

    await user.save();

    try {
      await sendEmail(email, "otp", otp);
    } catch (err) {
      console.error("EMAIL ERROR:", err);
    }

    res.json({ success: true, message: "Login OTP resent successfully" });
  } catch (err) {
    console.error("RESEND LOGIN OTP ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= VERIFY LOGIN OTP ================= */
export const verifyLoginOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // 🔥 Clear OTP
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    // 🔥 JWT TOKEN (UPDATED)
    const token = jwt.sign(
      { userId: user._id }, // ✅ CHANGE HERE
      process.env.JWT_SECRET || "secretkey", // ✅ BEST PRACTICE
      { expiresIn: "10y" }
    );

    // ✅ Login mail
    try {
      await sendEmail(email, "login");
    } catch (err) {
      console.error("EMAIL ERROR:", err);
    }

    res.json({
      success: true,
      token,
      user: {                 // 🔥 OPTIONAL BUT USEFUL
        id: user._id,
        name: user.name,
        email: user.email,
      },
      message: "Login successful",
    });

  } catch (err) {
    console.error("VERIFY LOGIN OTP ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= SEND RESET OTP ================= */
export const sendResetOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;

    await user.save();

    try {
      await sendEmail(email, "otp", otp);
    } catch (err) {
      console.error("EMAIL ERROR:", err);
    }

    res.json({ success: true, message: "OTP sent to email" });

  } catch (err) {
    console.error("SEND RESET OTP ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= RESEND RESET PASSWORD OTP ================= */
export const resendResetOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;

    await user.save();

    try {
      await sendEmail(email, "otp", otp);
    } catch (err) {
      console.error("EMAIL ERROR:", err);
    }

    res.json({ success: true, message: "Reset password OTP resent successfully" });
  } catch (err) {
    console.error("RESEND RESET OTP ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= VERIFY RESET OTP ================= */
export const verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    res.json({ success: true, message: "OTP verified" });

  } catch (err) {
    console.error("VERIFY RESET OTP ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= RESET PASSWORD ================= */
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const hashedPass = await bcrypt.hash(newPassword, 10);

    user.password = hashedPass;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    // 🔒 Reset mail
    try {
      await sendEmail(email, "reset");
    } catch (err) {
      console.error("EMAIL ERROR:", err);
    }

    res.json({ success: true, message: "Password updated successfully" });

  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
/* ================= GET USER ================= */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET PHOTO ================= */
export const updateProfile = async (req, res) => {
  try {
    console.log("FILE:", req.file); // 🔥 DEBUG

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;

    user.address = {
      addressLine: req.body.addressLine || user.address?.addressLine || "",
      city: req.body.city || user.address?.city || "",
      state: req.body.state || user.address?.state || "",
      pincode: req.body.pincode || user.address?.pincode || "",
    };

    if (req.file) {
      user.profileImage = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    await user.save();

    res.json({ success: true, user });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= WISHLIST =================
export const toggleWishlist = async (req, res) => {
  try {
    const userId = req.userId; // ✅ middleware se aata hai
    const { productId, name } = req.body;

    const user = await User.findById(userId);

    if (!user.wishlist) user.wishlist = [];

    const index = user.wishlist.findIndex(
      (item) => Number(item.id) === Number(productId)
    );

    if (index === -1) {
      user.wishlist.push({
        id: Number(productId),
        name,
      });
    } else {
      user.wishlist.splice(index, 1);
    }

    await user.save();

    res.json({ success: true });
  } catch (err) {
    console.error("WISHLIST ERROR:", err);
    res.status(500).json({ success: false });
  }
};

// ✅ GET
export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    return res.json({
      success: true,
      wishlist: user.wishlist || [],
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

// ================= CART =================
// ✅ ADD TO CART
export const addToCart = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const { productId } = req.body;

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const product = await Product.findOne({ id: Number(productId) });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (!user.cart) user.cart = [];

    // duplicate allowed
    user.cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      MRP: product.MRP,
      brand: product.brand,
      Fragrance: product.Fragrance,
      image: product.images?.[0] || "",
      quantity: product.quantity,
    });

    // 🕒 Track last cart activity
    user.lastCartActivity = new Date();

    await user.save();

    res.json({
      success: true,
      message: "Added to cart",
      cart: user.cart,
    });
  } catch (err) {
    console.error("CART ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ✅ GET CART
export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      cart: user.cart || [],
    });
  } catch (err) {
    console.error("GET CART ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ REMOVE FROM CART
export const removeFromCart = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const { productId } = req.body;

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const itemIndex = user.cart.findIndex(
      (item) => Number(item.id) === Number(productId)
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    user.cart.splice(itemIndex, 1);

    await user.save();

    res.json({
      success: true,
      message: "Removed from cart",
      cart: user.cart,
    });
  } catch (err) {
    console.error("REMOVE CART ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
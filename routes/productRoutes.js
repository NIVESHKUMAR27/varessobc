import express from "express";
import multer from "multer";
import Product from "../models/Product.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/products",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// GET ALL PRODUCTS
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;

    const filter = {};
    if (category && category !== "all") {
      filter.category = category;
    }

    const products = await Product.find(filter).sort({ id: 1 });

    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch products" });
  }
});

// CART PRODUCTS BY IDS
router.post("/get-by-ids", async (req, res) => {
  try {
    const { ids } = req.body;

    const products = await Product.find({
      id: { $in: ids.map((i) => Number(i)) },
    });

    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch products" });
  }
});

// UPDATE PRODUCT DETAILS
router.put("/:id", async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { id: Number(req.params.id) },
      {
        brand: req.body.brand,
        name: req.body.name,
        price: Number(req.body.price),
        MRP: Number(req.body.MRP),
        original: req.body.original,
        Fragrance: req.body.Fragrance,
        details: req.body.details,
        quantity: req.body.quantity,
        category: req.body.category,
        stock: Number(req.body.stock),
        isNewProduct: req.body.isNewProduct,
        isBestSeller: req.body.isBestSeller,
      },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update product" });
  }
});

// UPDATE PRODUCT IMAGE
router.put("/:id/upload-image", upload.single("image"), async (req, res) => {
  try {
    const { type } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image uploaded" });
    }

    const imageUrl = `http://localhost:5000/uploads/products/${req.file.filename}`;

    const updateData =
      type === "profileimage"
        ? { profileimage: [imageUrl] }
        : { images: [imageUrl] };

    const product = await Product.findOneAndUpdate(
      { id: Number(req.params.id) },
      updateData,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: "Image upload failed" });
  }
});

// GET SINGLE PRODUCT - isko last me hi rakho
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findOne({ id: Number(req.params.id) });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: "Product not found" });
  }
});

export default router;
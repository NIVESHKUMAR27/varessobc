import Product from "../models/Product.js";

/* ================= GET ALL PRODUCTS ================= */
export const getProducts = async (req, res) => {
  try {
    const { category } = req.query;

    const filter = {};

    if (category && category !== "all") {
      filter.category = category;
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      products,
    });
  } catch (err) {
    console.error("GET PRODUCTS ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ================= GET SINGLE PRODUCT ================= */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      id: Number(req.params.id),
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (err) {
    console.error("GET PRODUCT ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ================= UPDATE PRODUCT DETAILS ================= */
export const updateProduct = async (req, res) => {
  try {
    const productId = Number(req.params.id);

    const updatedProduct = await Product.findOneAndUpdate(
      { id: productId },
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

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      product: updatedProduct,
    });
  } catch (err) {
    console.error("UPDATE PRODUCT ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update product",
    });
  }
};

/* ================= UPDATE PRODUCT IMAGE ================= */
export const uploadProductImage = async (req, res) => {
  try {
    const productId = Number(req.params.id);
    const { type } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    const imageUrl = `http://localhost:5000/uploads/products/${req.file.filename}`;

    let updateData = {};

    if (type === "profileimage") {
      updateData = { profileimage: [imageUrl] };
    } else {
      updateData = { images: [imageUrl] };
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { id: productId },
      updateData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      product: updatedProduct,
    });
  } catch (err) {
    console.error("UPLOAD IMAGE ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Image upload failed",
    });
  }
};

/* ================= GET PRODUCTS BY IDS (CART) ================= */
export const getProductsByIds = async (req, res) => {
  try {
    const { ids } = req.body;

    const products = await Product.find({
      id: { $in: ids.map((i) => Number(i)) },
    });

    res.json({
      success: true,
      products,
    });
  } catch (err) {
    console.error("GET PRODUCTS BY IDS ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};
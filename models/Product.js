import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },

    brand: { type: String, default: "VARESSO" },

    name: { type: String, required: true, trim: true },

    price: { type: Number, required: true },

    MRP: { type: Number, default: 0 },
    mrp: { type: Number, default: 0 },

    original: { type: String, default: "" },
    originalPrice: { type: Number, default: 0 },

    Fragrance: { type: String, default: "" },
    fragrance: { type: String, default: "" },

    details: { type: String, default: "" },

    quantity: { type: String, default: "50mL" },

    category: {
      type: String,
      enum: ["men", "women", "all"],
      default: "all",
    },

    images: { type: [String], default: [] },

    profileimage: { type: [String], default: [] },

    stock: { type: Number, default: 0 },

    isNewProduct: { type: Boolean, default: false },

    isBestSeller: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productSchema.pre("save", function (next) {
  if (!this.MRP && this.mrp) this.MRP = this.mrp;
  if (!this.mrp && this.MRP) this.mrp = this.MRP;

  if (!this.Fragrance && this.fragrance) this.Fragrance = this.fragrance;
  if (!this.fragrance && this.Fragrance) this.fragrance = this.Fragrance;

  if (!this.originalPrice && this.original) {
    this.originalPrice = Number(this.original) || 0;
  }

  next();
});

export default mongoose.model("Product", productSchema);
import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Product from "./models/Product.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, "data", "artical.json");

console.log("Reading from:", filePath);

const rawData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
const products = rawData.products;

console.log("Products found:", products.length);

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Product.deleteMany({});
    await Product.insertMany(products);

    console.log("Products imported successfully");
    process.exit(0);
  } catch (err) {
    console.error("Product seed error:", err);
    process.exit(1);
  }
};

seedProducts();
import { Router } from "express";
import data from "./Data.js";
import Product from "./models/Product.js";
import Category from "./models/Category.js";

const router = Router();

router.post("/products", async (req, res) => {
  await Product.deleteMany({});
  const sendProducts = await Product.insertMany(data.products);
  res.send({ sendProducts });
});

router.post("/categories", async (req, res) => {
  await Category.deleteMany({});
  const importCategory = await Category.insertMany(data.categories);
  res.send({ importCategory });
});

export default router;

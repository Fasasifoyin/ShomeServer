import { Router } from "express";
import {
  comment,
  createProduct,
  deleteComment,
  deleteProduct,
  getFeatured,
  getFeaturedCategory,
  getMyProducts,
  getProducts,
  getSingleProduct,
  getTrend,
  getTrendingCategory,
  likeProduct,
} from "../controllers/Products.js";
import { auth } from "../middleware/auth.js";
import {
  createOrder,
  getOrder,
  getUserOrders,
  updateOrder,
} from "../controllers/Order.js";

const router = Router();

router.get("/products/:page", getProducts);

router.get("/products/myproducts/:page", auth, getMyProducts);

router.get("/featured", getFeatured);
router.get("/trend", getTrend);

router.get("/featured/:category", getFeaturedCategory);
router.get("/trending/:category", getTrendingCategory);

router.get("/:slug", getSingleProduct);

router.patch("/like/:id", auth, likeProduct);

router.post("/comments/:id", auth, comment);
router.patch("/deletecomment/:id", auth, deleteComment);

router.delete("/product/delete/:id", deleteProduct);

router.post("/createproduct", createProduct);

router.post("/create/order", auth, createOrder);
router.get("/get/order/:orderId", getOrder);
router.put("/update/:id/pay", auth, updateOrder);
router.get("/get/userOrders", auth, getUserOrders);

export default router;

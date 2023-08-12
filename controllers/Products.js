import Product from "../models/Product.js";
import User from "../models/User.js";
import { shuffle } from "../config/Shuffle.js";
import mongoose from "mongoose";

import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const getProducts = async (req, res) => {
  const { page } = req.params;
  try {
    const LIMIT = 10;
    const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page
    const total = await Product.countDocuments({});

    const getAllProducts = await Product.find()
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex);

    res.status(200).json({
      products: getAllProducts,
      currentPage: Number(page),
      numberOfPage: Math.ceil(total / LIMIT),
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getMyProducts = async (req, res) => {
  const { page } = req.params;
  const id = req.userId;
  try {
    const user = await User.findById(id);

    const creator = user?.email;

    const LIMIT = 5;
    const startIndex = (Number(page) - 1) * LIMIT;

    const product = await Product.find({ creator })
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex);

    res.status(200).json(product);
  } catch (error) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getFeatured = async (req, res) => {
  try {
    const featured = await Product.find({
      isFeatured: true,
    });
    if (featured) {
      const shuffledFeatured = shuffle(featured);
      res.status(200).json(shuffledFeatured);
    } else {
      res.status(404).json({ message: "Featured items not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getTrend = async (req, res) => {
  try {
    const trend = await Product.find({
      trending: true,
    });
    if (trend) {
      res.status(200).json(trend);
    } else {
      res.status(404).json({ message: "Trending items not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getFeaturedCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const Category = await Product.find({ category, isFeatured: true });
    res.status(200).json(Category);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getTrendingCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const Category = await Product.find({ category, trending: true });
    res.status(200).json(Category);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const likeProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.userId) {
      return res.status(400).json({ message: "Unauthenticated" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).send("No product with that id");
    }

    const product = await Product.findById(id);

    const user = await User.findById(req.userId);

    const index = product.like.findIndex((each) => each === user.email);

    if (index === -1 && user) {
      product.like.push(user.email);
    } else {
      product.like = product.like.filter((each) => each !== user.email);
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, product, {
      new: true,
    });
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const comment = async (req, res) => {
  const { id } = req.params;
  const details = req.body;
  try {
    const product = await Product.findById(id);

    product.comments.push(details);

    const updatedProduct = await Product.findByIdAndUpdate(id, product, {
      new: true,
    });
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { commentId } = req.body;

    const product = await Product.findById(id);

    const removeIndex = product.comments
      .map((item) => item.id)
      .indexOf(commentId);

    product.comments.splice(removeIndex, 1);

    const updatedProduct = await Product.findByIdAndUpdate(id, product, {
      new: true,
    });

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPost = await Product.findByIdAndRemove(id);
    res.json(deletedPost);
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const {
      title,
      oldPrice,
      newPrice,
      color,
      category,
      brand,
      trending,
      isFeatured,
      creator,
      desc,
      image,
    } = req.body;

    const photoUrl = await cloudinary.uploader.upload(image);
    const newProduct = await Product.create({
      title,
      oldPrice,
      newPrice,
      color,
      category,
      brand,
      trending,
      isFeatured,
      creator,
      desc,
      image: photoUrl.url,
    });
    res.status(201).json(newProduct);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

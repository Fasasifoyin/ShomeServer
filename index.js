import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import importToMongo from "./SendToMongo.js";
import userRoutes from "./routes/User.js";
import productRoutes from "./routes/Products.js";
import categoryRoutes from "./routes/Category.js";
import searchRoutes from "./routes/Search.js";
import { auth } from "./middleware/auth.js";

const app = express();
app.use(cors());

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

dotenv.config();

app.use("/api/import", importToMongo);
app.use("/api/user", userRoutes);
app.use("/api/import", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api", searchRoutes);

app.use("/api/keys/paypal", auth, (req, res) => {
  try {
    res.status(200).json(process.env.PAYPAL_CLIENT_ID || "sb");
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(5000, () => console.log("Connected to database successfully"))
  )
  .catch((err) => console.log(err));

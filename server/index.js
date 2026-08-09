import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";

// Routers
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import bannerRoutes from "./routes/bannerRoutes.js";
import offerRoutes from "./routes/offerRoutes.js";
import settingRoutes from "./routes/settingRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import realGoldRoutes from "./routes/realGoldRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

// Models for DB Seeding
import Product from "./models/Product.js";
import Category from "./models/Category.js";
import Banner from "./models/Banner.js";
import Offer from "./models/Offer.js";
import Setting from "./models/Setting.js";
import User from "./models/User.js";
import RealGold from "./models/RealGold.js";
import Contact from "./models/Contact.js";
import Review from "./models/Review.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001", "https://swarnikajewellery.vercel.app","swarnikajewellery.vercel.app"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Health check API
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// API Routes Mounting
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/real-gold", realGoldRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/reviews", reviewRoutes);

// Automated MongoDB Seed Initializer
const seedDatabase = async () => {
  try {
    // Seed Sample Reviews
    const reviewCount = await Review.countDocuments();
    if (reviewCount === 0) {
      await Review.create([
        {
          id: "REV_101",
          name: "Priya Sharma",
          city: "Mumbai",
          rating: 5,
          title: "Indistinguishable from real gold!",
          text: "I wore the Royal Temple Choker to my cousin's wedding and received dozens of compliments. The 1-gram polish finish is so authentic!",
          product: "Royal Temple Choker",
          approved: true
        },
        {
          id: "REV_102",
          name: "Sowmya Reddy",
          city: "Hyderabad",
          rating: 5,
          title: "Stunning Craftsmanship & Weight",
          text: "The bridal haram has such impressive micro-gold plating and heavy antique detailing. Fits perfectly for festive functions.",
          product: "Goddess Heritage Haram",
          approved: true
        },
        {
          id: "REV_103",
          name: "Kavita Patel",
          city: "Ahmedabad",
          rating: 5,
          title: "Super fast shipping & premium packaging!",
          text: "Delivered in 2 days in a velvet gift box. The bangles shine bright and have held their polish impeccably.",
          product: "Kundan Kada Bangles",
          approved: true
        }
      ]);
    }
  } catch (err) {
    console.error("MongoDB seed error:", err.message);
  }
};

// Server Initialization
const PORT = process.env.PORT || 7000;
const URL = process.env.MONGOURL || "mongodb://127.0.0.1:27017/goldenshop";

mongoose
  .connect(URL)
  .then(() => {
    console.log("DB connected Successfully to MongoDB database");
    seedDatabase();
    app.listen(PORT, () => console.log(`Server is running on Port:${PORT}`));
  })
  .catch((error) => {
    console.log("MongoDB connection failed:", error.message);
    app.listen(PORT, () => console.log(`Server running on Port:${PORT} (Express standalone mode)`));
  });

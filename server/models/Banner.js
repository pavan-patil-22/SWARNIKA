import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  subtitle: { type: String, default: "" },
  tag: { type: String, default: "" },
  imageUrl: { type: String, required: true },
  buttonText: { type: String, default: "Shop Collection" },
  buttonLink: { type: String, default: "/products" },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Banner", bannerSchema);

import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, default: "" },
  name: { type: String, required: true },
  city: { type: String, default: "Verified Shopper" },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, required: true },
  text: { type: String, required: true },
  product: { type: String, default: "1-Gram Micro Gold Jewellery" },
  approved: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Review", reviewSchema);

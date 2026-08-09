import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  userName: String,
  rating: Number,
  comment: String,
  date: { type: String, default: () => new Date().toISOString().split('T')[0] }
});

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  sku: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, default: "" },
  weight: { type: String, default: "45 grams" },
  material: { type: String, default: "Brass-Copper alloy with 1 Gram Gold Polish (Imitation Jewellery - Not Real Gold)" },
  isImitation: { type: Boolean, default: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number, required: true },
  discountPercent: { type: Number, default: 0 },
  stock: { type: Number, required: true, default: 10 },
  rating: { type: Number, default: 5.0 },
  reviewCount: { type: Number, default: 0 },
  images: [{ type: String }],
  image: { type: String, default: "" },
  featured: { type: Boolean, default: false },
  bestSeller: { type: Boolean, default: false },
  newArrival: { type: Boolean, default: true },
  trending: { type: Boolean, default: false },
  reviews: [reviewSchema],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Product", productSchema);

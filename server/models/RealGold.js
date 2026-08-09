import mongoose from "mongoose";

const realGoldSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  purity: { type: String, default: "22K (916) BIS Hallmarked Gold" },
  weightInGrams: { type: String, required: true, default: "45.0 grams" },
  description: { type: String, default: "" },
  images: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("RealGold", realGoldSchema);

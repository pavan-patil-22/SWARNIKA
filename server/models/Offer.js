import mongoose from "mongoose";

const offerSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  code: { type: String, required: true },
  minQuantity: { type: Number, default: 2 },
  discountPercent: { type: Number, default: 10 },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  description: { type: String, default: "" },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Offer", offerSchema);

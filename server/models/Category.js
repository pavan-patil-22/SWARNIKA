import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  slug: { type: String, required: true },
  description: { type: String, default: "" },
  image: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Category", categorySchema);

import mongoose from 'mongoose';

const uploadSchema = new mongoose.Schema({
  url: { type: String, required: true },
  publicId: { type: String },
  filename: { type: String },
  mimeType: { type: String },
  size: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Upload', uploadSchema);

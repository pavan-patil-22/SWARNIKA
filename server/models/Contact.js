import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: "" },
  subject: { type: String, default: "General Inquiry" },
  message: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["Pending", "Replied_Email", "Replied_WhatsApp"], 
    default: "Pending" 
  },
  adminReply: { type: String, default: "" },
  replyMethod: { type: String, default: "" },
  repliedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Contact", contactSchema);

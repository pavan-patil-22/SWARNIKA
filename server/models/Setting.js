import mongoose from "mongoose";

const settingSchema = new mongoose.Schema({
  websiteName: { type: String, default: "SWARNIKA" },
  slogan: { type: String, default: "LUXURY HERITAGE" },
  returnPolicyDays: { type: Number, default: 7 },
  returnPolicyText: { type: String, default: "Enjoy Hassle-Free Returns & Exchange on all SWARNIKA 1 Gram Replica Jewellery items." },
  deliveryCharge: { type: Number, default: 99 },
  freeDeliveryThreshold: { type: Number, default: 1999 },
  
  // Daily Gold Rates per gram
  goldRate22K: { type: Number, default: 6850 },
  goldRate24K: { type: Number, default: 7470 },
  goldRate18K: { type: Number, default: 5600 },
  goldRateLastUpdated: { type: String, default: "2026-08-08" },

  // Cloudinary credentials stored in DB
  cloudinaryCloudName: { type: String, default: "" },
  cloudinaryApiKey: { type: String, default: "" },
  cloudinaryApiSecret: { type: String, default: "" },

  // Nodemailer credentials stored in DB
  emailUser: { type: String, default: "" },
  emailPass: { type: String, default: "" },

  contactEmail: { type: String, default: "swarnika.luxury@gmail.com" },
  contactPhone: { type: String, default: "94813 04117" }
});

export default mongoose.model("Setting", settingSchema);

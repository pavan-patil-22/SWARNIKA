import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  id: String,
  name: String,
  price: Number,
  quantity: Number,
  image: String,
  sku: String
});

const shippingAddressSchema = new mongoose.Schema({
  fullName: String,
  phone: String,
  street: String,
  city: String,
  state: String,
  pincode: String
});

const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  phone: { type: String, required: true },
  items: [orderItemSchema],
  shippingAddress: shippingAddressSchema,
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  deliveryFee: { type: Number, default: 0 },
  total: { type: Number, required: true },
  paymentMethod: { type: String, default: "Cash on Delivery" },
  paymentStatus: { type: String, default: "Pending COD Collection" },
  orderStatus: { 
    type: String, 
    default: "Confirmed",
    enum: ["Confirmed", "Packed", "Shipped", "Delivered", "Returned", "Cancelled"]
  },
  
  // Enhanced Return Request Lifecycle
  returnStatus: {
    type: String,
    default: "None",
    enum: ["None", "Requested", "Accepted", "Rejected"]
  },
  returnReason: { type: String, default: "" },
  returnImage: { type: String, default: "" },
  adminReturnComment: { type: String, default: "" },
  returnRequestedAt: { type: Date },

  trackingNote: { type: String, default: "COD Order Placed & Confirmed" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Order", orderSchema);

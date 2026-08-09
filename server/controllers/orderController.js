import Order from '../models/Order.js';
import mongoose from 'mongoose';

// Helper to find order by custom string id (e.g. ORD-123) or Mongo _id
const findOrderByIdOrMongoId = async (idParam) => {
  let order = await Order.findOne({ id: idParam });
  if (!order && mongoose.Types.ObjectId.isValid(idParam)) {
    order = await Order.findById(idParam);
  }
  return order;
};

export const getOrders = async (req, res) => {
  try {
    const { userId } = req.query;
    let query = {};
    if (userId) {
      query = { $or: [{ userId: userId }, { userEmail: userId }] };
    }
    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await findOrderByIdOrMongoId(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const orderId = req.body.id || `ORD-${Date.now()}`;
    const newOrder = new Order({
      ...req.body,
      id: orderId
    });
    await newOrder.save();
    console.log(`New Order #${newOrder.id} created in MongoDB!`);
    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Create order DB error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, trackingNote } = req.body;
    const order = await findOrderByIdOrMongoId(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found in database" });

    order.orderStatus = orderStatus;
    if (trackingNote) order.trackingNote = trackingNote;
    await order.save();

    console.log(`Updated Order #${order.id} status to ${orderStatus}`);
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// USER REQUEST RETURN WITH REASON AND IMAGE
export const requestReturn = async (req, res) => {
  try {
    const { returnReason, returnImage } = req.body;
    const order = await findOrderByIdOrMongoId(req.params.id);

    if (!order) {
      console.log(`Order not found for return request: ${req.params.id}`);
      return res.status(404).json({ message: `Order ${req.params.id} not found` });
    }

    if (order.orderStatus !== 'Delivered') {
      return res.status(400).json({ message: "Return can only be requested for Delivered items" });
    }

    order.returnStatus = "Requested";
    order.returnReason = returnReason || "";
    order.returnImage = returnImage || "";
    order.returnRequestedAt = new Date();

    await order.save();
    console.log(`Return request successfully recorded for Order #${order.id}`);
    res.json(order);
  } catch (error) {
    console.error("Request return DB error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ADMIN ACCEPT OR REJECT RETURN REQUEST
export const respondReturn = async (req, res) => {
  try {
    const { action, adminComment } = req.body; // action: 'ACCEPT' or 'REJECT'
    const order = await findOrderByIdOrMongoId(req.params.id);

    if (!order) {
      return res.status(404).json({ message: `Order ${req.params.id} not found` });
    }

    if (action === 'ACCEPT') {
      order.returnStatus = "Accepted";
      order.orderStatus = "Returned";
      order.adminReturnComment = adminComment || "Return request approved by Admin.";
    } else {
      order.returnStatus = "Rejected";
      order.adminReturnComment = adminComment || "Return request rejected by Admin after verification.";
    }

    await order.save();
    console.log(`Admin ${action}ED return request for Order #${order.id}`);
    res.json(order);
  } catch (error) {
    console.error("Respond return DB error:", error);
    res.status(500).json({ message: error.message });
  }
};

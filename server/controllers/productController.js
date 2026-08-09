import Product from '../models/Product.js';

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const body = req.body;
    if (body.images && body.images.length > 0 && !body.image) {
      body.image = body.images[0];
    }
    if (body.image && (!body.images || body.images.length === 0)) {
      body.images = [body.image];
    }

    const newProd = new Product({
      id: `prod-${Date.now()}`,
      ...body
    });
    await newProd.save();
    console.log(`Saved product in MongoDB with Cloudinary image URLs:`, newProd.images);
    res.status(201).json(newProd);
  } catch (error) {
    console.error("Create product DB error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const body = req.body;
    if (body.images && body.images.length > 0 && !body.image) {
      body.image = body.images[0];
    }
    if (body.image && (!body.images || body.images.length === 0)) {
      body.images = [body.image];
    }

    const updated = await Product.findOneAndUpdate({ id: req.params.id }, body, { new: true });
    // console.log(`Updated product in MongoDB with Cloudinary image URLs:`, updated?.images);
    res.json(updated);
  } catch (error) {
    console.error("Update product DB error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await Product.findOneAndDelete({ id: req.params.id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addReview = async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.reviews.unshift(req.body);
    product.reviewCount = product.reviews.length;
    const avg = product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length;
    product.rating = Number(avg.toFixed(1));

    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

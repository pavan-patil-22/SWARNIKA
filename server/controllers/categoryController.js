import Category from '../models/Category.js';

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);
    const newCat = new Category({
      id: `cat-${Date.now()}`,
      slug: req.body.name.toLowerCase().replace(/\s+/g, '-'),
      ...req.body
    });
    await newCat.save();
    console.log("Saved Category in MongoDB with image URL:", newCat.image);
    res.status(201).json(newCat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const updated = await Category.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    console.log("Updated Category in MongoDB with image URL:", updated?.image);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    await Category.findOneAndDelete({ id: req.params.id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

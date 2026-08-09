import RealGold from '../models/RealGold.js';

export const getRealGoldItems = async (req, res) => {
  try {
    const items = await RealGold.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

export const getRealGoldById = async (req, res) => {
  try {
    const item = await RealGold.findOne({ id: req.params.id });
    if (!item) return res.status(404).json({ message: "Real Gold item not found" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createRealGoldItem = async (req, res) => {
  try {
    const newItem = new RealGold({
      id: `gold-${Date.now()}`,
      ...req.body
    });
    await newItem.save();
    console.log(`New Real Gold item created: ${newItem.title}`);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRealGoldItem = async (req, res) => {
  try {
    const updated = await RealGold.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteRealGoldItem = async (req, res) => {
  try {
    await RealGold.findOneAndDelete({ id: req.params.id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

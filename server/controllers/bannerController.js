import Banner from '../models/Banner.js';

export const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createBanner = async (req, res) => {
  try {
    const banner = new Banner({ id: `banner-${Date.now()}`, active: true, ...req.body });
    await banner.save();
    console.log("Saved Banner in MongoDB with image URL:", banner.imageUrl);
    res.status(201).json(banner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBanner = async (req, res) => {
  try {
    const updated = await Banner.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    console.log("Updated Banner in MongoDB with image URL:", updated?.imageUrl);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBanner = async (req, res) => {
  try {
    await Banner.findOneAndDelete({ id: req.params.id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

import Review from '../models/Review.js';

export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ approved: true }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createReview = async (req, res) => {
  try {
    const { name, city, rating, title, text, product } = req.body;

    if (!name || !rating || !title || !text) {
      return res.status(400).json({ message: "Name, rating, title, and feedback text are required." });
    }

    const newReview = await Review.create({
      id: "REV_" + Date.now(),
      userId: req.user ? req.user.id : "",
      name: name.trim(),
      city: city ? city.trim() : "Verified Shopper",
      rating: Number(rating),
      title: title.trim(),
      text: text.trim(),
      product: product ? product.trim() : "1-Gram Micro Gold Jewellery",
      approved: true
    });

    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

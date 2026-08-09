import cloudinary from '../utils/cloudinary.js';

export const uploadImages = async (req, res) => {
  try {
    // If files uploaded via multer buffer/path or simulation fallback
    const files = req.files || [];
    const urls = [];

    for (const file of files) {
      if (process.env.CLOUDINARY_API_SECRET && !process.env.CLOUDINARY_API_SECRET.includes('secret')) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'aureate_luxe_1gram'
        });
        urls.push(result.secure_url);
      } else {
        // Fallback sample high-res preview URL if keys are unset
        urls.push(`https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80`);
      }
    }

    if (urls.length === 0 && req.body.images) {
      // Direct array of URLs or object URLs
      urls.push(...req.body.images);
    }

    res.json({ urls });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};

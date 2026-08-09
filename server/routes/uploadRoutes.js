import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import Setting from '../models/Setting.js';
import Upload from '../models/Upload.js';
dotenv.config();

const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();

router.post('/', upload.array('images', 10), async (req, res) => {
  try {
    const files = req.files || [];
    const urls = [];

    // Try fetching Cloudinary credentials from MongoDB first
    let dbSetting = null;
    try {
      dbSetting = await Setting.findOne();
    } catch (e) {
      console.log("DB settings lookup skipped");
    }

    const cloudName = dbSetting?.cloudinaryCloudName || process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = dbSetting?.cloudinaryApiKey || process.env.CLOUDINARY_API_KEY;
    const apiSecret = dbSetting?.cloudinaryApiSecret || process.env.CLOUDINARY_API_SECRET;

    const hasValidKeys = apiKey && apiSecret && apiSecret.trim().length > 5;

    if (!hasValidKeys) {
      return res.status(400).json({ message: 'Cloudinary credentials are missing. Please configure Cloudinary in Admin Settings or .env.' });
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret
    });

    const savedUploads = [];
    for (const file of files) {
      try {
        const uploadPromise = new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'aureate_luxe_1gram' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(file.buffer);
        });

        const result = await uploadPromise;
        const url = result.secure_url;
        urls.push(url);

        // persist upload metadata in DB
        try {
          const saved = await Upload.create({
            url,
            publicId: result.public_id,
            filename: file.originalname,
            mimeType: file.mimetype,
            size: result.bytes || file.size
          });
          savedUploads.push(saved);
          // console.log('Upload saved to DB:', saved._id, url);
        } catch (dbErr) {
          console.error('Failed to save upload record to DB:', dbErr.message);
        }
      } catch (err) {
        console.error('Cloudinary upload failed for file', file.originalname, err.message);
        return res.status(500).json({ message: 'Cloudinary upload failed', error: err.message });
      }
    }

    res.json({ urls, uploads: savedUploads });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
});

// Admin: list recent uploads
router.get('/', async (req, res) => {
  try {
    const uploads = await Upload.find().sort({ createdAt: -1 }).limit(100);
    res.json(uploads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

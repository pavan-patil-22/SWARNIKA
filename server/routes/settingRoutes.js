import express from 'express';
import { getSettings, updateSettings, getGoldHistory } from '../controllers/settingController.js';

const router = express.Router();

router.get('/', getSettings);
router.put('/', updateSettings);
router.get('/gold-history', getGoldHistory);

export default router;

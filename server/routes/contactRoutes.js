import express from 'express';
import { 
  submitInquiry, 
  getInquiries, 
  replyInquiry 
} from '../controllers/contactController.js';

const router = express.Router();

router.post('/', submitInquiry);
router.get('/', getInquiries);
router.post('/reply/:id', replyInquiry);

export default router;

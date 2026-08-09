import express from 'express';
import { 
  getOrders, 
  getOrderById,
  createOrder, 
  updateOrderStatus, 
  requestReturn, 
  respondReturn 
} from '../controllers/orderController.js';

const router = express.Router();

router.get('/', getOrders);
router.post('/', createOrder);
router.post('/return-request/:id', requestReturn);
router.post('/return-respond/:id', respondReturn);
router.get('/:id', getOrderById);
router.put('/:id', updateOrderStatus);

export default router;

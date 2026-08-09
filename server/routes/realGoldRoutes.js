import express from 'express';
import { 
  getRealGoldItems, 
  getRealGoldById, 
  createRealGoldItem, 
  updateRealGoldItem, 
  deleteRealGoldItem 
} from '../controllers/realGoldController.js';

const router = express.Router();

router.get('/', getRealGoldItems);
router.get('/:id', getRealGoldById);
router.post('/', createRealGoldItem);
router.put('/:id', updateRealGoldItem);
router.delete('/:id', deleteRealGoldItem);

export default router;

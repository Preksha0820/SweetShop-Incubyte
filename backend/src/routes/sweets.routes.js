import { Router } from 'express';
import {
  createSweet,
  listSweets,
  searchSweets,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet,
  getUserOrders
} from '../controllers/sweets.controller.js';
import { protect, admin } from '../middlewares/auth.middleware.js';
import upload from '../config/upload.js';

const router = Router();

router.get('/', listSweets);
router.get('/search', searchSweets);
router.get('/my-orders', protect, getUserOrders); // New route
router.post('/', protect, admin, upload.single('image'), createSweet);
router.put('/:id', protect, admin, upload.single('image'), updateSweet);
router.delete('/:id', protect, admin, deleteSweet);
router.post('/:id/purchase', protect, purchaseSweet);
router.post('/:id/restock', protect, admin, restockSweet);

export default router;
import { Router } from 'express';
import { body } from 'express-validator';
import {
  createSweet,
  getAllSweets,
  searchSweets,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet
} from '../controllers/sweet.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.post(
  '/',
  authenticate,
  authorize('admin'),
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer')
  ],
  createSweet
);

router.get('/', authenticate, getAllSweets);

router.get('/search', authenticate, searchSweets);

router.put('/:id', authenticate, authorize('admin'), updateSweet);

router.delete('/:id', authenticate, authorize('admin'), deleteSweet);

router.post(
  '/:id/purchase',
  authenticate,
  [
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
  ],
  purchaseSweet
);

router.post(
  '/:id/restock',
  authenticate,
  authorize('admin'),
  [
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
  ],
  restockSweet
);

export default router;
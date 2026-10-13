import express from 'express'
import {
  validateCoupon,
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  generateUniqueCouponCode,
} from '../controllers/couponController.js'
import { protect, optionalAuth, requireAdmin } from '../middleware/auth.js'

const router = express.Router()

// Customer validates coupon at checkout
router.post('/validate', optionalAuth, validateCoupon)

// Admin coupon management
router.get('/', protect, requireAdmin, getCoupons)
router.get('/generate-code', protect, requireAdmin, generateUniqueCouponCode)
router.post('/', protect, requireAdmin, createCoupon)
router.put('/:id', protect, requireAdmin, updateCoupon)
router.delete('/:id', protect, requireAdmin, deleteCoupon)

export default router

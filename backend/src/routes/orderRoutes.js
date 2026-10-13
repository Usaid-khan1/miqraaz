import express from 'express'
import {
  createOrder,
  getMyOrders,
  getOrderById,
  requestCancellation,
  getAllOrders,
  updateOrderStatus,
  updateOrderTracking,
  approveOrderCancellation,
} from '../controllers/orderController.js'
import { protect, requireAdmin } from '../middleware/auth.js'

const router = express.Router()

// Customer endpoints (all require authentication!)
router.post('/', protect, createOrder)
router.get('/my', protect, getMyOrders)
router.get('/:id', protect, getOrderById)
router.post('/:id/cancel-request', protect, requestCancellation)

// Admin endpoints
router.get('/admin/all', protect, requireAdmin, getAllOrders)
router.put('/admin/:id/status', protect, requireAdmin, updateOrderStatus)
router.put('/admin/:id/tracking', protect, requireAdmin, updateOrderTracking)
router.post('/admin/:id/cancellation', protect, requireAdmin, approveOrderCancellation)

export default router

import express from 'express'
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  syncCart,
} from '../controllers/cartController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// All cart routes require user authentication
router.use(protect)

router.get('/', getCart)
router.post('/add', addToCart)
router.post('/sync', syncCart)
router.put('/items/:itemId', updateCartItem)
router.delete('/items/:itemId', removeCartItem)
router.delete('/clear', clearCart)

export default router

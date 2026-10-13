import express from 'express'
import {
  getProducts,
  getProductBySlugOrId,
  getFeaturedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js'
import { protect, requireAdmin } from '../middleware/auth.js'

const router = express.Router()

router.get('/', getProducts)
router.get('/featured', getFeaturedProducts)
router.get('/:identifier', getProductBySlugOrId)

// Admin routes
router.post('/', protect, requireAdmin, createProduct)
router.put('/:id', protect, requireAdmin, updateProduct)
router.delete('/:id', protect, requireAdmin, deleteProduct)

export default router

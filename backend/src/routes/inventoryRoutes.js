import express from 'express'
import {
  getInventoryOverview,
  adjustStock,
  getInventoryLogs,
} from '../controllers/inventoryController.js'
import { protect, requireAdmin } from '../middleware/auth.js'

const router = express.Router()

router.use(protect, requireAdmin)

router.get('/overview', getInventoryOverview)
router.get('/logs', getInventoryLogs)
router.post('/adjust/:productId', adjustStock)

export default router

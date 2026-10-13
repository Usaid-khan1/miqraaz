import express from 'express'
import { getDashboardStats } from '../controllers/dashboardController.js'
import { protect, requireAdmin } from '../middleware/auth.js'

const router = express.Router()

router.get('/stats', protect, requireAdmin, getDashboardStats)

export default router

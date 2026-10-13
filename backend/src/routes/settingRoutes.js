import express from 'express'
import { getSettings, updateSettings } from '../controllers/settingController.js'
import { protect, requireAdmin } from '../middleware/auth.js'

const router = express.Router()

// Public can view store settings (currency, shipping fees, announcements)
router.get('/', getSettings)

// Admin can update
router.put('/', protect, requireAdmin, updateSettings)

export default router

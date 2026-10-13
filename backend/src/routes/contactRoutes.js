import express from 'express'
import { submitContactMessage, getContactMessages } from '../controllers/contactController.js'
import { protect, requireAdmin } from '../middleware/auth.js'

const router = express.Router()

router.post('/', submitContactMessage)
router.get('/', protect, requireAdmin, getContactMessages)

export default router

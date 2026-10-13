import express from 'express'
import { upload, handleImageUpload } from '../controllers/uploadController.js'
import { protect, requireAdmin } from '../middleware/auth.js'

const router = express.Router()

router.post('/', protect, requireAdmin, upload.single('image'), handleImageUpload)

export default router

import express from 'express'
import {
  register,
  login,
  googleLogin,
  getMe,
  updateProfile,
  updatePassword,
  forgotPassword,
  resetPassword,
  addAddress,
  updateAddress,
  deleteAddress,
} from '../controllers/authController.js'
import { protect } from '../middleware/auth.js'
import { authLimiter } from '../middleware/rateLimiter.js'

const router = express.Router()

router.post('/register', authLimiter, register)
router.post('/login', authLimiter, login)
router.post('/google', authLimiter, googleLogin)
router.post('/forgot-password', authLimiter, forgotPassword)
router.post('/reset-password/:token', resetPassword)

router.get('/me', protect, getMe)
router.put('/profile', protect, updateProfile)
router.put('/password', protect, updatePassword)

// Address management
router.post('/addresses', protect, addAddress)
router.put('/addresses/:addressId', protect, updateAddress)
router.delete('/addresses/:addressId', protect, deleteAddress)

export default router

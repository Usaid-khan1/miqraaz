import express from 'express'
import {
  getCustomers,
  getCustomerDetails,
  toggleCustomerStatus,
} from '../controllers/userController.js'
import { protect, requireAdmin } from '../middleware/auth.js'

const router = express.Router()

router.use(protect, requireAdmin)

router.get('/', getCustomers)
router.get('/:id', getCustomerDetails)
router.patch('/:id/status', toggleCustomerStatus)

export default router

import { Coupon } from '../models/Coupon.js'
import { Order } from '../models/Order.js'

export const validateCouponHelper = async ({ code, userId, subtotal }) => {
  if (!code || !code.trim()) {
    throw new Error('Please enter a coupon code')
  }

  const cleanCode = code.trim().toUpperCase()
  const coupon = await Coupon.findOne({ code: cleanCode })

  if (!coupon) {
    throw new Error('Invalid coupon code')
  }

  if (!coupon.isActive) {
    throw new Error('This coupon is no longer active')
  }

  const now = new Date()
  if (coupon.startDate && new Date(coupon.startDate) > now) {
    throw new Error('This coupon is not active yet')
  }

  if (coupon.expiryDate && new Date(coupon.expiryDate) < now) {
    throw new Error('This coupon has expired')
  }

  if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
    throw new Error('This coupon has reached its maximum total usage limit')
  }

  const orderSubtotal = Number(subtotal) || 0
  if (coupon.minOrderValue > 0 && orderSubtotal < coupon.minOrderValue) {
    throw new Error(
      `Minimum order value of Rs. ${coupon.minOrderValue.toLocaleString('en-PK')} is required to apply this coupon`
    )
  }

  if (userId) {
    // Check first-order restriction based on actual DB order history
    if (coupon.isFirstOrderOnly) {
      const priorOrdersCount = await Order.countDocuments({
        user: userId,
        orderStatus: { $ne: 'cancelled' },
      })

      if (priorOrdersCount > 0) {
        throw new Error('This coupon is valid only for first-time orders')
      }
    }

    // Check per-user limit
    const userUsages = coupon.usedBy.filter(
      (u) => u.user && u.user.toString() === userId.toString()
    ).length

    if (userUsages >= coupon.perUserLimit) {
      throw new Error('You have already used this coupon the maximum allowed times')
    }
  }

  // Calculate discount amount
  let discountAmount = 0
  if (coupon.discountType === 'percentage') {
    discountAmount = Math.round((orderSubtotal * coupon.discountValue) / 100)
    if (coupon.maxDiscount !== null && coupon.maxDiscount > 0) {
      discountAmount = Math.min(discountAmount, coupon.maxDiscount)
    }
  } else {
    // fixed
    discountAmount = Math.min(coupon.discountValue, orderSubtotal)
  }

  return {
    coupon,
    discountAmount,
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    isFirstOrderOnly: coupon.isFirstOrderOnly,
  }
}

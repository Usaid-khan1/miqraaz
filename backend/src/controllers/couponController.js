import crypto from 'crypto'
import { Coupon } from '../models/Coupon.js'
import { validateCouponHelper } from '../services/couponService.js'

export const validateCoupon = async (req, res, next) => {
  try {
    const { code, subtotal } = req.body

    const result = await validateCouponHelper({
      code,
      userId: req.user ? req.user._id : null,
      subtotal,
    })

    res.json({
      success: true,
      message: 'Coupon applied successfully',
      data: {
        code: result.code,
        discountType: result.discountType,
        discountValue: result.discountValue,
        discountAmount: result.discountAmount,
        isFirstOrderOnly: result.isFirstOrderOnly,
      },
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    })
  }
}

export const getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 })
    res.json({
      success: true,
      coupons,
    })
  } catch (error) {
    next(error)
  }
}

export const createCoupon = async (req, res, next) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      minOrderValue,
      maxDiscount,
      isFirstOrderOnly,
      startDate,
      expiryDate,
      usageLimit,
      perUserLimit,
      isActive,
    } = req.body

    if (!code || !discountValue) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code and discount value are required',
      })
    }

    const cleanCode = code.trim().toUpperCase()
    const existing = await Coupon.findOne({ code: cleanCode })
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A coupon with this code already exists',
      })
    }

    const coupon = await Coupon.create({
      code: cleanCode,
      description: description || '',
      discountType: discountType || 'percentage',
      discountValue: Number(discountValue),
      minOrderValue: Number(minOrderValue) || 0,
      maxDiscount: maxDiscount ? Number(maxDiscount) : null,
      isFirstOrderOnly: Boolean(isFirstOrderOnly),
      startDate: startDate ? new Date(startDate) : new Date(),
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      usageLimit: usageLimit ? Number(usageLimit) : null,
      perUserLimit: Number(perUserLimit) || 1,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    })

    res.status(201).json({
      success: true,
      message: 'Coupon created successfully',
      coupon,
    })
  } catch (error) {
    next(error)
  }
}

export const updateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id)
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' })
    }

    const {
      code,
      description,
      discountType,
      discountValue,
      minOrderValue,
      maxDiscount,
      isFirstOrderOnly,
      startDate,
      expiryDate,
      usageLimit,
      perUserLimit,
      isActive,
    } = req.body

    if (code && code.trim().toUpperCase() !== coupon.code) {
      const cleanCode = code.trim().toUpperCase()
      const duplicate = await Coupon.findOne({ code: cleanCode, _id: { $ne: coupon._id } })
      if (duplicate) {
        return res.status(400).json({ success: false, message: 'Code already in use by another coupon' })
      }
      coupon.code = cleanCode
    }

    if (description !== undefined) coupon.description = description
    if (discountType !== undefined) coupon.discountType = discountType
    if (discountValue !== undefined) coupon.discountValue = Number(discountValue)
    if (minOrderValue !== undefined) coupon.minOrderValue = Number(minOrderValue)
    if (maxDiscount !== undefined) coupon.maxDiscount = maxDiscount ? Number(maxDiscount) : null
    if (isFirstOrderOnly !== undefined) coupon.isFirstOrderOnly = Boolean(isFirstOrderOnly)
    if (startDate !== undefined) coupon.startDate = startDate ? new Date(startDate) : new Date()
    if (expiryDate !== undefined) coupon.expiryDate = expiryDate ? new Date(expiryDate) : null
    if (usageLimit !== undefined) coupon.usageLimit = usageLimit ? Number(usageLimit) : null
    if (perUserLimit !== undefined) coupon.perUserLimit = Number(perUserLimit)
    if (isActive !== undefined) coupon.isActive = Boolean(isActive)

    await coupon.save()

    res.json({
      success: true,
      message: 'Coupon updated successfully',
      coupon,
    })
  } catch (error) {
    next(error)
  }
}

export const deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id)
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' })
    }

    await Coupon.findByIdAndDelete(coupon._id)

    res.json({
      success: true,
      message: 'Coupon deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}

export const generateUniqueCouponCode = async (req, res, next) => {
  try {
    const prefix = (req.query.prefix || 'MK').toUpperCase()
    const randomSuffix = crypto.randomBytes(3).toString('hex').toUpperCase()
    const code = `${prefix}-${randomSuffix}`

    res.json({
      success: true,
      code,
    })
  } catch (error) {
    next(error)
  }
}

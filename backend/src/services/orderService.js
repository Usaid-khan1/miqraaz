import { Order } from '../models/Order.js'
import { Product } from '../models/Product.js'
import { Cart } from '../models/Cart.js'
import { Coupon } from '../models/Coupon.js'
import { Setting } from '../models/Setting.js'
import { InventoryLog } from '../models/InventoryLog.js'
import { validateCouponHelper } from './couponService.js'

export const createOrderService = async ({
  userId,
  items,
  shippingAddress,
  paymentMethod = 'cod',
  couponCode = null,
}) => {
  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new Error('Your order must contain at least one item')
  }

  if (
    !shippingAddress ||
    !shippingAddress.fullName ||
    !shippingAddress.phone ||
    !shippingAddress.address ||
    !shippingAddress.city
  ) {
    throw new Error('Please provide a complete shipping address (Full Name, Phone, Address, City)')
  }

  // 1. Fetch store settings for shipping & tax rules
  let storeSettings = await Setting.findOne()
  if (!storeSettings) {
    storeSettings = {
      shippingMode: 'location_based',
      karachiShippingFee: 0,
      standardShippingFee: 250,
      freeShippingThreshold: 8000,
      taxRatePercent: 0,
      codEnabled: true,
    }
  }

  // Validate COD payment method against store settings
  if (paymentMethod === 'cod' && storeSettings.codEnabled === false) {
    throw new Error('Cash on Delivery (COD) is currently disabled. Please select Bank Deposit.')
  }

  // 2. Fetch fresh products from DB, validate availability, calculate subtotal
  const orderItems = []
  let calculatedSubtotal = 0
  const stockDeductionPlan = []

  for (const item of items) {
    const product = await Product.findById(item.product || item.productId || item._id)
    if (!product || !product.isPublished) {
      throw new Error(`Product "${item.name || 'item'}" is currently unavailable`)
    }

    const requestedQty = Math.max(1, Number(item.qty) || 1)
    const selectedSize = item.size || 'M'

    // Validate size stock
    const sizeStockObj = product.sizes.find((s) => s.size === selectedSize)
    const availableStock = sizeStockObj ? sizeStockObj.stock : product.totalStock

    if (requestedQty > availableStock) {
      throw new Error(
        `Insufficient stock for "${product.name}" in size ${selectedSize}. Only ${availableStock} available.`
      )
    }

    // Server-side price: use current database price
    const unitPrice = product.salePrice && product.salePrice < product.price
      ? product.salePrice
      : product.price

    calculatedSubtotal += unitPrice * requestedQty

    orderItems.push({
      product: product._id,
      name: product.name,
      slug: product.slug,
      size: selectedSize,
      price: unitPrice,
      qty: requestedQty,
      image: product.images && product.images[0] ? product.images[0] : '',
      sku: product.sku || '',
    })

    stockDeductionPlan.push({
      product,
      size: selectedSize,
      qty: requestedQty,
    })
  }

  // 3. Validate coupon if provided
  let discountAmount = 0
  let couponDetails = null
  let couponDoc = null

  if (couponCode && couponCode.trim()) {
    const couponResult = await validateCouponHelper({
      code: couponCode,
      userId,
      subtotal: calculatedSubtotal,
    })

    discountAmount = couponResult.discountAmount
    couponDoc = couponResult.coupon
    couponDetails = {
      code: couponResult.code,
      discountType: couponResult.discountType,
      discountValue: couponResult.discountValue,
      discountAmount,
    }
  }

  // 4. Calculate Shipping and Taxes dynamically from store settings
  const shippingMode = storeSettings.shippingMode || 'location_based'
  const standardFee = Number(storeSettings.standardShippingFee ?? 250)
  const karachiFee = Number(storeSettings.karachiShippingFee ?? 0)
  const threshold = Number(storeSettings.freeShippingThreshold ?? 0)

  let shippingFee = 0

  if (shippingMode === 'free') {
    // Mode B: Global Free Shipping everywhere
    shippingFee = 0
  } else {
    // Mode A: Location-Based Shipping
    const cityStr = String(shippingAddress.city || '').trim().toLowerCase()
    const isKarachi = cityStr === 'karachi' || cityStr === 'khi' || cityStr.includes('karachi')

    if (isKarachi) {
      shippingFee = karachiFee // Free (Rs. 0) for Karachi
    } else {
      if (threshold > 0 && calculatedSubtotal >= threshold) {
        shippingFee = 0
      } else {
        shippingFee = standardFee // Rs. 250 for outside Karachi
      }
    }
  }

  const taxableAmount = Math.max(0, calculatedSubtotal - discountAmount)
  const tax = Number(storeSettings.taxRatePercent) > 0
    ? Math.round((taxableAmount * Number(storeSettings.taxRatePercent)) / 100)
    : 0

  const grandTotal = Math.max(0, calculatedSubtotal - discountAmount + shippingFee + tax)

  // 5. Deduct inventory safely
  for (const plan of stockDeductionPlan) {
    const { product, size, qty } = plan
    const prevStock = product.totalStock

    const sizeObj = product.sizes.find((s) => s.size === size)
    if (sizeObj) {
      sizeObj.stock = Math.max(0, sizeObj.stock - qty)
    }
    product.totalStock = product.sizes.reduce((acc, curr) => acc + (curr.stock || 0), 0)
    await product.save()

    // Record inventory log
    await InventoryLog.create({
      product: product._id,
      productName: product.name,
      size,
      changeType: 'order_deduct',
      quantityChange: -qty,
      previousStock: prevStock,
      newStock: product.totalStock,
      reason: 'Stock deducted for new order placement',
      orderNumber: 'PENDING',
    })
  }

  // 6. Generate unique order number
  const timestamp = Date.now().toString().slice(-6)
  const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase()
  const orderNumber = `MK-${timestamp}-${randomChars}`

  // 7. Create Order document
  const order = await Order.create({
    orderNumber,
    user: userId,
    items: orderItems,
    shippingAddress,
    subtotal: calculatedSubtotal,
    discount: discountAmount,
    shippingFee,
    tax,
    total: grandTotal,
    coupon: couponDetails,
    paymentMethod,
    paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
    orderStatus: 'pending',
    statusHistory: [
      {
        status: 'pending',
        changedAt: new Date(),
        note: 'Order successfully placed by customer',
      },
    ],
  })

  // Update InventoryLog orderNumber
  await InventoryLog.updateMany(
    { orderNumber: 'PENDING' },
    { $set: { orderNumber } }
  )

  // 8. Record coupon usage
  if (couponDoc) {
    couponDoc.usedCount += 1
    couponDoc.usedBy.push({
      user: userId,
      orderId: order._id,
      usedAt: new Date(),
    })
    await couponDoc.save()
  }

  // 9. Clear purchased cart items for user
  await Cart.findOneAndUpdate({ user: userId }, { items: [] })

  return order
}

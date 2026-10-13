import { Order } from '../models/Order.js'
import { Product } from '../models/Product.js'
import { InventoryLog } from '../models/InventoryLog.js'
import { createOrderService } from '../services/orderService.js'

export const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod, couponCode } = req.body

    const order = await createOrderService({
      userId: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      couponCode,
    })

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    })
  }
}

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.json({
      success: true,
      orders,
    })
  } catch (error) {
    next(error)
  }
}

export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params
    let order

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(id).populate('user', 'name email phone')
    } else {
      order = await Order.findOne({ orderNumber: id.toUpperCase() }).populate('user', 'name email phone')
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' })
    }

    // Security check: non-admin can only view their own order
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this order',
      })
    }

    res.json({
      success: true,
      order,
    })
  } catch (error) {
    next(error)
  }
}

export const requestCancellation = async (req, res, next) => {
  try {
    const { id } = req.params
    const { reason } = req.body

    const order = await Order.findById(id)
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' })
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' })
    }

    if (['shipped', 'delivered', 'cancelled'].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled as it is already ${order.orderStatus}`,
      })
    }

    order.cancellationRequested = true
    order.cancellationReason = reason || 'Customer requested cancellation'
    order.statusHistory.push({
      status: order.orderStatus,
      changedAt: new Date(),
      note: `Customer cancellation requested: ${order.cancellationReason}`,
      changedBy: req.user._id,
    })

    await order.save()

    res.json({
      success: true,
      message: 'Cancellation request submitted to store administrator',
      order,
    })
  } catch (error) {
    next(error)
  }
}

// Admin Order Endpoints
export const getAllOrders = async (req, res, next) => {
  try {
    const { status, paymentStatus, search, page = 1, limit = 20 } = req.query
    const filter = {}

    if (status && status !== 'all') {
      filter.orderStatus = status
    }

    if (paymentStatus && paymentStatus !== 'all') {
      filter.paymentStatus = paymentStatus
    }

    if (search && search.trim()) {
      filter.$or = [
        { orderNumber: { $regex: search.trim(), $options: 'i' } },
        { 'shippingAddress.fullName': { $regex: search.trim(), $options: 'i' } },
        { 'shippingAddress.phone': { $regex: search.trim(), $options: 'i' } },
      ]
    }

    const pageNum = Math.max(1, Number(page))
    const limitNum = Math.max(1, Number(limit))
    const skip = (pageNum - 1) * limitNum

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('user', 'name email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Order.countDocuments(filter),
    ])

    res.json({
      success: true,
      orders,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params
    const { orderStatus, paymentStatus, note } = req.body

    const order = await Order.findById(id)
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' })
    }

    const prevStatus = order.orderStatus

    // Validate status transition
    const validTransitions = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['processing', 'cancelled'],
      processing: ['shipped', 'cancelled'],
      shipped: ['delivered', 'cancelled'],
      delivered: [], // Cannot revert
      cancelled: [], // Cannot revert
    }

    if (orderStatus && orderStatus !== prevStatus) {
      if (!validTransitions[prevStatus] || !validTransitions[prevStatus].includes(orderStatus)) {
        return res.status(400).json({
          success: false,
          message: `Cannot transition order status from "${prevStatus}" to "${orderStatus}"`,
        })
      }

      order.orderStatus = orderStatus

      // If cancelled, restore stock!
      if (orderStatus === 'cancelled') {
        for (const item of order.items) {
          const product = await Product.findById(item.product)
          if (product) {
            const prevStock = product.totalStock
            const sizeObj = product.sizes.find((s) => s.size === item.size)
            if (sizeObj) {
              sizeObj.stock += item.qty
            }
            product.totalStock = product.sizes.reduce((acc, curr) => acc + (curr.stock || 0), 0)
            await product.save()

            await InventoryLog.create({
              product: product._id,
              productName: product.name,
              size: item.size,
              changeType: 'order_cancel_restore',
              quantityChange: item.qty,
              previousStock: prevStock,
              newStock: product.totalStock,
              reason: `Order ${order.orderNumber} cancelled; inventory restored`,
              orderNumber: order.orderNumber,
              createdBy: req.user._id,
            })
          }
        }
      }

      order.statusHistory.push({
        status: orderStatus,
        changedAt: new Date(),
        note: note || `Status changed from ${prevStatus} to ${orderStatus} by administrator`,
        changedBy: req.user._id,
      })
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus
    }

    await order.save()

    res.json({
      success: true,
      message: 'Order updated successfully',
      order,
    })
  } catch (error) {
    next(error)
  }
}

export const updateOrderTracking = async (req, res, next) => {
  try {
    const { id } = req.params
    const { trackingNumber, trackingCarrier } = req.body

    const order = await Order.findById(id)
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' })
    }

    order.trackingNumber = trackingNumber || ''
    order.trackingCarrier = trackingCarrier || ''
    await order.save()

    res.json({
      success: true,
      message: 'Tracking details updated',
      order,
    })
  } catch (error) {
    next(error)
  }
}

export const approveOrderCancellation = async (req, res, next) => {
  try {
    const { id } = req.params
    const { approved } = req.body

    const order = await Order.findById(id)
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' })
    }

    if (approved) {
      // Re-use cancellation logic
      return updateOrderStatus(
        {
          ...req,
          body: {
            orderStatus: 'cancelled',
            note: 'Cancellation request approved by administrator',
          },
        },
        res,
        next
      )
    } else {
      order.cancellationRequested = false
      order.cancellationApproved = false
      order.statusHistory.push({
        status: order.orderStatus,
        changedAt: new Date(),
        note: 'Cancellation request rejected by administrator',
        changedBy: req.user._id,
      })
      await order.save()

      return res.json({
        success: true,
        message: 'Cancellation request rejected',
        order,
      })
    }
  } catch (error) {
    next(error)
  }
}

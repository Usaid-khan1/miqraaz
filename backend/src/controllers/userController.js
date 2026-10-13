import { User } from '../models/User.js'
import { Order } from '../models/Order.js'

export const getCustomers = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 20 } = req.query
    const filter = { role: 'user' }

    if (search && search.trim()) {
      filter.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } },
        { phone: { $regex: search.trim(), $options: 'i' } },
      ]
    }

    const pageNum = Math.max(1, Number(page))
    const limitNum = Math.max(1, Number(limit))
    const skip = (pageNum - 1) * limitNum

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-resetPasswordToken -resetPasswordExpires')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      User.countDocuments(filter),
    ])

    // Fetch order counts and total spent for these customers
    const userIds = users.map((u) => u._id)
    const userStats = await Order.aggregate([
      {
        $match: {
          user: { $in: userIds },
          orderStatus: { $ne: 'cancelled' },
        },
      },
      {
        $group: {
          _id: '$user',
          orderCount: { $sum: 1 },
          totalSpent: { $sum: '$total' },
        },
      },
    ])

    const statsMap = {}
    userStats.forEach((s) => {
      statsMap[s._id.toString()] = s
    })

    const enrichedUsers = users.map((u) => {
      const uObj = u.toJSON()
      const stats = statsMap[u._id.toString()] || { orderCount: 0, totalSpent: 0 }
      return {
        ...uObj,
        orderCount: stats.orderCount,
        totalSpent: stats.totalSpent,
      }
    })

    res.json({
      success: true,
      customers: enrichedUsers,
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

export const getCustomerDetails = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ success: false, message: 'Customer not found' })
    }

    const orders = await Order.find({ user: user._id }).sort({ createdAt: -1 })

    res.json({
      success: true,
      customer: user,
      orders,
    })
  } catch (error) {
    next(error)
  }
}

export const toggleCustomerStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ success: false, message: 'Customer not found' })
    }

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot suspend an administrator account' })
    }

    user.accountStatus = user.accountStatus === 'active' ? 'suspended' : 'active'
    await user.save()

    res.json({
      success: true,
      message: `Customer account is now ${user.accountStatus}`,
      accountStatus: user.accountStatus,
    })
  } catch (error) {
    next(error)
  }
}

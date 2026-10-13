import { Order } from '../models/Order.js'
import { Product } from '../models/Product.js'
import { User } from '../models/User.js'
import { Category } from '../models/Category.js'

export const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalOrders,
      ordersByStatus,
      revenueResult,
      totalCustomers,
      totalProducts,
      lowStockProducts,
      recentOrders,
    ] = await Promise.all([
      // Total orders
      Order.countDocuments(),

      // Orders grouped by status
      Order.aggregate([
        {
          $group: {
            _id: '$orderStatus',
            count: { $sum: 1 },
          },
        },
      ]),

      // Total revenue (non-cancelled orders)
      Order.aggregate([
        {
          $match: {
            orderStatus: { $ne: 'cancelled' },
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$total' },
          },
        },
      ]),

      // Customers
      User.countDocuments({ role: 'user' }),

      // Products
      Product.countDocuments({ isPublished: true }),

      // Low stock products
      Product.find({
        $expr: { $lte: ['$totalStock', '$lowStockThreshold'] },
      })
        .select('name slug sku totalStock lowStockThreshold price images')
        .limit(10),

      // Recent orders
      Order.find()
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .limit(8),
    ])

    const statusCounts = {
      pending: 0,
      confirmed: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    }

    ordersByStatus.forEach((item) => {
      if (statusCounts[item._id] !== undefined) {
        statusCounts[item._id] = item.count
      }
    })

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0

    // Recent 7 days sales aggregation
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const salesTrend = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
          orderStatus: { $ne: 'cancelled' },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$total' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ])

    res.json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        statusCounts,
        totalCustomers,
        totalProducts,
        lowStockCount: lowStockProducts.length,
        lowStockProducts,
        recentOrders,
        salesTrend,
      },
    })
  } catch (error) {
    next(error)
  }
}

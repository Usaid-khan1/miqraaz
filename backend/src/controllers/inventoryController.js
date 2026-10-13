import { Product } from '../models/Product.js'
import { InventoryLog } from '../models/InventoryLog.js'

export const getInventoryOverview = async (req, res, next) => {
  try {
    const { lowStockOnly, search } = req.query
    const filter = {}

    if (lowStockOnly === 'true') {
      filter.$expr = { $lte: ['$totalStock', '$lowStockThreshold'] }
    }

    if (search && search.trim()) {
      filter.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { sku: { $regex: search.trim(), $options: 'i' } },
      ]
    }

    const products = await Product.find(filter)
      .select('name slug sku sizes totalStock lowStockThreshold price images isPublished')
      .sort({ totalStock: 1 })

    res.json({
      success: true,
      products,
    })
  } catch (error) {
    next(error)
  }
}

export const adjustStock = async (req, res, next) => {
  try {
    const { productId } = req.params
    const { size, quantityChange, reason } = req.body

    const change = Number(quantityChange)
    if (isNaN(change) || change === 0) {
      return res.status(400).json({ success: false, message: 'Valid quantity change required' })
    }

    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }

    const prevStock = product.totalStock
    let targetSize = size

    if (size) {
      const sizeObj = product.sizes.find((s) => s.size === size)
      if (sizeObj) {
        sizeObj.stock = Math.max(0, sizeObj.stock + change)
      } else {
        product.sizes.push({ size, stock: Math.max(0, change) })
      }
    } else {
      // Adjust across first size or default M
      if (product.sizes.length > 0) {
        product.sizes[0].stock = Math.max(0, product.sizes[0].stock + change)
        targetSize = product.sizes[0].size
      } else {
        product.sizes.push({ size: 'M', stock: Math.max(0, change) })
        targetSize = 'M'
      }
    }

    product.totalStock = product.sizes.reduce((acc, curr) => acc + (curr.stock || 0), 0)
    await product.save()

    const log = await InventoryLog.create({
      product: product._id,
      productName: product.name,
      size: targetSize || 'General',
      changeType: change > 0 ? 'restock' : 'adjustment',
      quantityChange: change,
      previousStock: prevStock,
      newStock: product.totalStock,
      reason: reason || 'Manual stock adjustment by administrator',
      createdBy: req.user._id,
    })

    res.json({
      success: true,
      message: 'Stock adjusted successfully',
      product,
      log,
    })
  } catch (error) {
    next(error)
  }
}

export const getInventoryLogs = async (req, res, next) => {
  try {
    const { productId, limit = 50 } = req.query
    const filter = {}
    if (productId) filter.product = productId

    const logs = await InventoryLog.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(Number(limit))

    res.json({
      success: true,
      logs,
    })
  } catch (error) {
    next(error)
  }
}

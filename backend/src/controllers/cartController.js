import { Cart } from '../models/Cart.js'
import { Product } from '../models/Product.js'

export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'name slug price salePrice images sizes totalStock isPublished',
    })

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] })
    }

    // Filter out deleted/unpublished products if any
    const validItems = cart.items.filter((item) => item.product && item.product.isPublished)

    res.json({
      success: true,
      items: validItems,
    })
  } catch (error) {
    next(error)
  }
}

export const addToCart = async (req, res, next) => {
  try {
    const { productId, slug, size = 'M', qty = 1 } = req.body

    const quantityToAdd = Math.max(1, Number(qty))

    let product
    if (productId) {
      product = await Product.findById(productId)
    } else if (slug) {
      product = await Product.findOne({ slug })
    }

    if (!product || !product.isPublished) {
      return res.status(404).json({ success: false, message: 'Product not found or unavailable' })
    }

    // Check size stock
    const sizeStock = product.sizes.find((s) => s.size === size)
    const available = sizeStock ? sizeStock.stock : product.totalStock

    let cart = await Cart.findOne({ user: req.user._id })
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] })
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === product._id.toString() && item.size === size
    )

    const currentQtyInCart = existingItemIndex > -1 ? cart.items[existingItemIndex].qty : 0
    if (currentQtyInCart + quantityToAdd > available) {
      return res.status(400).json({
        success: false,
        message: `Only ${available} items available in size ${size}`,
      })
    }

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].qty += quantityToAdd
    } else {
      cart.items.push({
        product: product._id,
        size,
        qty: quantityToAdd,
      })
    }

    await cart.save()

    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name slug price salePrice images sizes totalStock isPublished',
    })

    res.json({
      success: true,
      message: 'Product added to cart',
      items: populatedCart.items,
    })
  } catch (error) {
    next(error)
  }
}

export const updateCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params
    const { qty } = req.body
    const newQty = Number(qty)

    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' })
    }

    const item = cart.items.id(itemId)
    if (!item) {
      return res.status(404).json({ success: false, message: 'Cart item not found' })
    }

    if (newQty <= 0) {
      cart.items.pull(itemId)
    } else {
      const product = await Product.findById(item.product)
      if (product) {
        const sizeStock = product.sizes.find((s) => s.size === item.size)
        const available = sizeStock ? sizeStock.stock : product.totalStock
        if (newQty > available) {
          return res.status(400).json({
            success: false,
            message: `Cannot increase quantity. Only ${available} in stock for size ${item.size}`,
          })
        }
      }
      item.qty = newQty
    }

    await cart.save()

    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name slug price salePrice images sizes totalStock isPublished',
    })

    res.json({
      success: true,
      items: populatedCart.items,
    })
  } catch (error) {
    next(error)
  }
}

export const removeCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params
    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' })
    }

    cart.items.pull(itemId)
    await cart.save()

    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name slug price salePrice images sizes totalStock isPublished',
    })

    res.json({
      success: true,
      message: 'Item removed from cart',
      items: populatedCart.items,
    })
  } catch (error) {
    next(error)
  }
}

export const clearCart = async (req, res, next) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] })
    res.json({
      success: true,
      message: 'Cart cleared',
      items: [],
    })
  } catch (error) {
    next(error)
  }
}

export const syncCart = async (req, res, next) => {
  try {
    const { guestItems = [] } = req.body
    if (!Array.isArray(guestItems) || guestItems.length === 0) {
      return getCart(req, res, next)
    }

    let cart = await Cart.findOne({ user: req.user._id })
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] })
    }

    for (const gItem of guestItems) {
      const product = await Product.findOne({
        $or: [
          ...(gItem.slug ? [{ slug: gItem.slug }] : []),
          ...(gItem.productId ? [{ _id: gItem.productId }] : []),
        ],
      })

      if (!product || !product.isPublished) continue

      const size = gItem.size || 'M'
      const qty = Math.max(1, Number(gItem.qty) || 1)
      const sizeStock = product.sizes.find((s) => s.size === size)
      const maxAvailable = sizeStock ? sizeStock.stock : product.totalStock

      const existingIndex = cart.items.findIndex(
        (i) => i.product.toString() === product._id.toString() && i.size === size
      )

      if (existingIndex > -1) {
        cart.items[existingIndex].qty = Math.min(cart.items[existingIndex].qty + qty, maxAvailable)
      } else {
        cart.items.push({
          product: product._id,
          size,
          qty: Math.min(qty, maxAvailable),
        })
      }
    }

    await cart.save()

    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name slug price salePrice images sizes totalStock isPublished',
    })

    res.json({
      success: true,
      items: populatedCart.items,
    })
  } catch (error) {
    next(error)
  }
}

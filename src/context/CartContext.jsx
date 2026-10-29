import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { cartAPI, couponsAPI } from '../services/api.js'
import { formatImageUrl } from '../data.js'
import { useAuth } from './AuthContext.jsx'
import { useToast } from './ToastContext.jsx'

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

export function CartProvider({ children }) {
  const { user, isAuthenticated } = useAuth()
  const { showToast } = useToast()

  const [items, setItems] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [coupon, setCoupon] = useState(null)

  // Load cart from MongoDB for logged-in users, or from localStorage for guests
  const loadCart = useCallback(async () => {
    if (isAuthenticated) {
      try {
        setLoading(true)
        // Check if there are any guest items stored before login to sync
        const savedGuest = localStorage.getItem('miqraaz_guest_cart')
        const guestItems = savedGuest ? JSON.parse(savedGuest) : []

        if (guestItems.length > 0) {
          const res = await cartAPI.sync(guestItems)
          setItems(formatCartItems(res.items))
          localStorage.removeItem('miqraaz_guest_cart')
        } else {
          const res = await cartAPI.get()
          setItems(formatCartItems(res.items))
        }
      } catch (err) {
        console.warn('Failed to load user cart:', err.message)
      } finally {
        setLoading(false)
      }
    } else {
      // Guest cart from localStorage
      try {
        const savedGuest = localStorage.getItem('miqraaz_guest_cart')
        setItems(savedGuest ? JSON.parse(savedGuest) : [])
      } catch {
        setItems([])
      }
    }
  }, [isAuthenticated])

  useEffect(() => {
    loadCart()
  }, [loadCart])

  // Helper to normalize items from server populate
  const formatCartItems = (serverItems = []) => {
    return serverItems.map((item) => {
      const p = item.product || {}
      return {
        _id: item._id,
        key: (p.slug || item._id) + '-' + item.size,
        productId: p._id,
        name: p.name,
        slug: p.slug,
        size: item.size,
        price: p.salePrice && p.salePrice < p.price ? p.salePrice : p.price,
        img: formatImageUrl(p.images?.[0]),
        qty: item.qty,
        totalStock: p.totalStock,
      }
    })
  }

  // Save guest cart to localStorage whenever items change while logged out
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('miqraaz_guest_cart', JSON.stringify(items))
    }
  }, [items, isAuthenticated])

  const add = async (product, size = 'M', qty = 1) => {
    const sizeStock = product.sizes?.find((s) => s.size === size)
    const available = sizeStock ? sizeStock.stock : (product.totalStock ?? 10)

    if (available <= 0) {
      showToast(`Sorry, "${product.name}" is sold out in size ${size}`, 'error')
      return
    }

    const itemPrice = product.salePrice && product.salePrice < product.price
      ? product.salePrice
      : product.price

    const key = (product.slug || product._id) + '-' + size

    if (isAuthenticated) {
      try {
        const res = await cartAPI.add({
          productId: product._id,
          slug: product.slug,
          size,
          qty,
        })
        setItems(formatCartItems(res.items))
        showToast(`Added ${product.name} (${size}) to your cart`, 'success')
        setCartOpen(true)
      } catch (err) {
        showToast(err.message || 'Could not add to cart', 'error')
      }
    } else {
      // Guest local addition
      setItems((prev) => {
        const existing = prev.find((i) => i.key === key)
        if (existing) {
          const newQty = Math.min(existing.qty + qty, available)
          return prev.map((i) => (i.key === key ? { ...i, qty: newQty } : i))
        }
        return [
          ...prev,
          {
            key,
            productId: product._id,
            name: product.name,
            slug: product.slug,
            price: itemPrice,
            size,
            img: formatImageUrl(product.images?.[0]),
            qty: Math.min(qty, available),
            totalStock: available,
          },
        ]
      })
      showToast(`Added ${product.name} (${size}) to cart`, 'success')
      setCartOpen(true)
    }
  }

  const update = async (itemKeyOrId, newQty) => {
    if (newQty < 1) {
      return remove(itemKeyOrId)
    }

    if (isAuthenticated) {
      // If server cart, find item._id
      const item = items.find((i) => i._id === itemKeyOrId || i.key === itemKeyOrId)
      if (!item || !item._id) return

      try {
        const res = await cartAPI.update(item._id, newQty)
        setItems(formatCartItems(res.items))
      } catch (err) {
        showToast(err.message || 'Could not update quantity', 'error')
      }
    } else {
      setItems((prev) =>
        prev.map((i) => {
          if (i.key === itemKeyOrId || i._id === itemKeyOrId) {
            return { ...i, qty: newQty }
          }
          return i
        })
      )
    }
  }

  const remove = async (itemKeyOrId) => {
    if (isAuthenticated) {
      const item = items.find((i) => i._id === itemKeyOrId || i.key === itemKeyOrId)
      if (!item || !item._id) return

      try {
        const res = await cartAPI.remove(item._id)
        setItems(formatCartItems(res.items))
        showToast('Item removed from cart', 'info')
      } catch (err) {
        showToast(err.message || 'Could not remove item', 'error')
      }
    } else {
      setItems((prev) => prev.filter((i) => i.key !== itemKeyOrId && i._id !== itemKeyOrId))
      showToast('Item removed from cart', 'info')
    }
  }

  const clear = async () => {
    if (isAuthenticated) {
      try {
        await cartAPI.clear()
        setItems([])
      } catch (err) {
        console.warn('Failed to clear cart:', err.message)
      }
    } else {
      setItems([])
      localStorage.removeItem('miqraaz_guest_cart')
    }
    setCoupon(null)
  }

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.qty) || 0), 0)
  }, [items])

  const count = useMemo(() => {
    return items.reduce((sum, item) => sum + (Number(item.qty) || 0), 0)
  }, [items])

  const applyCoupon = async (code) => {
    if (!code || !code.trim()) {
      showToast('Please enter a coupon code', 'error')
      return
    }

    try {
      const res = await couponsAPI.validate(code.trim(), subtotal)
      setCoupon(res.data)
      showToast(`Coupon "${res.data.code}" applied!`, 'success')
      return res.data
    } catch (err) {
      setCoupon(null)
      showToast(err.message || 'Invalid coupon code', 'error')
      throw err
    }
  }

  const removeCoupon = () => {
    setCoupon(null)
    showToast('Coupon removed', 'info')
  }

  const value = {
    items,
    loading,
    cartOpen,
    openCart: () => setCartOpen(true),
    closeCart: () => setCartOpen(false),
    add,
    update,
    remove,
    clear,
    subtotal,
    count,
    coupon,
    applyCoupon,
    removeCoupon,
    refreshCart: loadCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

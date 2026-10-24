import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { money } from '../data.js'
import { Sparkles, ArrowLeft } from 'lucide-react'

export function CartPage() {
  const { items, update, remove, subtotal, coupon, applyCoupon, removeCoupon } = useCart()
  const { isAuthenticated } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [couponInput, setCouponInput] = useState('')
  const [applying, setApplying] = useState(false)

  const FREE_SHIPPING_THRESHOLD = 8000
  const STANDARD_SHIPPING = 250
  const qualifiesForFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD
  const amountNeeded = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
  const shippingFee = qualifiesForFreeShipping ? 0 : STANDARD_SHIPPING
  const discountAmount = coupon?.discountAmount || 0
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee)

  const handleApplyCoupon = async (e) => {
    e.preventDefault()
    if (!couponInput.trim()) return
    setApplying(true)
    try {
      await applyCoupon(couponInput.trim())
      setCouponInput('')
    } catch {
      // Error handled by CartContext toast
    } finally {
      setApplying(false)
    }
  }

  const handleCheckout = () => {
    if (!isAuthenticated) {
      showToast('Please log in or register before completing your order', 'info')
      navigate('/login?redirect=/checkout')
    } else {
      navigate('/checkout')
    }
  }

  if (items.length === 0) {
    return (
      <div className="cart-page-wrap center">
        <h1 className="page-title">Your Cart is Empty</h1>
        <p className="muted" style={{ marginBottom: '24px' }}>
          Discover our latest chapters and handcrafted silhouettes.
        </p>
        <Link to="/collections/all" className="btn">
          Start Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="cart-page-wrap">
      <h1 className="page-title">Shopping Cart</h1>

      {/* Free Shipping Motivator Progress */}
      <div className="free-shipping-bar-wrap">
        {qualifiesForFreeShipping ? (
          <div className="free-shipping-success flex-center-row">
            <Sparkles size={16} />
            <span>Congratulations! Your order qualifies for <strong>FREE SHIPPING</strong>.</span>
          </div>
        ) : (
          <div className="free-shipping-hint">
            Add <strong>{money(amountNeeded)}</strong> more to unlock <strong>FREE SHIPPING</strong>.
            <div className="free-shipping-track">
              <div
                className="free-shipping-fill"
                style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="cart-layout-grid">
        {/* Items List */}
        <div className="cart-items-table-wrap">
          <table className="cart-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th className="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.key || item._id}>
                  <td className="cart-item-col">
                    <div className="cart-item-info-flex">
                      {item.img ? (
                        <img src={item.img} alt={item.name} className="cart-row-thumb" />
                      ) : (
                        <div className="ph small cart-row-thumb">MIQRAAZ</div>
                      )}
                      <div>
                        <Link to={`/products/${item.slug}`} className="cart-row-title">
                          {item.name}
                        </Link>
                        <div className="muted font-sm">Size: {item.size}</div>
                        <button
                          type="button"
                          className="cart-row-remove"
                          onClick={() => remove(item._id || item.key)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </td>
                  <td>{money(item.price)}</td>
                  <td>
                    <div className="cart-qty-ctrl">
                      <button
                        type="button"
                        onClick={() => update(item._id || item.key, item.qty - 1)}
                      >
                        −
                      </button>
                      <span>{item.qty}</span>
                      <button
                        type="button"
                        onClick={() => update(item._id || item.key, item.qty + 1)}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="text-right font-medium">
                    {money(item.price * item.qty)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cart Summary */}
        <div className="cart-summary-card">
          <h3>Order Summary</h3>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>{money(subtotal)}</span>
          </div>

          {/* Coupon Input or Applied Tag */}
          <div className="coupon-card-section">
            {coupon ? (
              <div className="coupon-applied-badge">
                <div>
                  <strong>{coupon.code}</strong>
                  <div className="muted font-sm">
                    {coupon.discountType === 'percentage'
                      ? `${coupon.discountValue}% discount applied`
                      : `Rs. ${coupon.discountValue} discount applied`}
                  </div>
                </div>
                <button
                  type="button"
                  className="coupon-remove-btn"
                  onClick={removeCoupon}
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="coupon-form-inline">
                <input
                  type="text"
                  placeholder="Coupon Code (e.g. FIRST10)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                />
                <button type="submit" className="btn sm" disabled={applying}>
                  {applying ? 'Applying...' : 'Apply'}
                </button>
              </form>
            )}
          </div>

          {discountAmount > 0 && (
            <div className="summary-row text-discount">
              <span>Discount</span>
              <span>−{money(discountAmount)}</span>
            </div>
          )}

          <div className="summary-row">
            <span>Estimated Shipping</span>
            <span>
              {qualifiesForFreeShipping ? (
                <span className="text-free">FREE</span>
              ) : (
                money(shippingFee)
              )}
            </span>
          </div>

          <hr className="summary-sep" />

          <div className="summary-row total-row">
            <strong>Estimated Total</strong>
            <strong>{money(grandTotal)}</strong>
          </div>

          <button
            type="button"
            className="btn full checkout-big-btn"
            onClick={handleCheckout}
          >
            {isAuthenticated ? 'Proceed to Checkout' : 'Sign In & Check Out'}
          </button>

          <Link to="/collections/all" className="continue-shopping-link flex-center-row">
            <ArrowLeft size={14} />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

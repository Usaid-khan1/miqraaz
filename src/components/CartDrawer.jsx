import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { useSettings } from '../context/SettingsContext.jsx'
import { money, formatImageUrl } from '../data.js'
import { X, Sparkles } from 'lucide-react'

export function CartDrawer() {
  const { cartOpen, closeCart, items, update, remove, subtotal } = useCart()
  const { isAuthenticated } = useAuth()
  const { showToast } = useToast()
  const { calculateShipping, freeShippingThreshold, standardShippingFee, karachiShippingFee, shippingMode } = useSettings()
  const navigate = useNavigate()

  const shippingFee = calculateShipping(subtotal)
  const isFreeDelivery = shippingMode === 'free' || (freeShippingThreshold > 0 && subtotal >= freeShippingThreshold)
  const hasThreshold = shippingMode !== 'free' && freeShippingThreshold > 0
  const amountNeeded = hasThreshold ? Math.max(0, freeShippingThreshold - subtotal) : 0

  const handleCheckoutClick = () => {
    closeCart()
    if (!isAuthenticated) {
      showToast('Please sign in or create an account to proceed to checkout', 'info')
      navigate('/login?redirect=/checkout')
    } else {
      navigate('/checkout')
    }
  }

  return (
    <>
      <div className={`overlay ${cartOpen ? 'show' : ''}`} onClick={closeCart} />
      <aside className={`drawer ${cartOpen ? 'open' : ''}`}>
        <div className="drawer-head">
          <h3>Shopping Cart</h3>
          <button className="icon-btn" onClick={closeCart} aria-label="Close cart">
            <X size={18} />
          </button>
        </div>

        {items.length > 0 && (
          <div className={`drawer-shipping-notice ${isFreeDelivery ? 'unlocked' : ''}`}>
            {shippingMode === 'free' ? (
              <div className="drawer-shipping-unlocked">
                <Sparkles size={14} />
                <span>You've unlocked <strong>FREE Shipping Nationwide!</strong></span>
              </div>
            ) : isFreeDelivery ? (
              <div className="drawer-shipping-unlocked">
                <Sparkles size={14} />
                <span>You've unlocked <strong>FREE Shipping!</strong></span>
              </div>
            ) : (
              <div className="drawer-shipping-progress">
                {hasThreshold && amountNeeded > 0 ? (
                  <span>Add <strong>Rs. {amountNeeded.toLocaleString()}</strong> more for <strong>FREE Shipping</strong></span>
                ) : (
                  <span>
                    {Number(karachiShippingFee || 0) === 0 ? 'Free delivery in Karachi' : `Rs. ${karachiShippingFee} in Karachi`}{' '}
                    &bull; Rs. {standardShippingFee || 250} flat outside
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {items.length === 0 ? (
          <div className="empty">
            <h3>Your cart is empty</h3>
            <p>
              {!isAuthenticated ? (
                <>
                  Have an account?{' '}
                  <Link
                    to="/login"
                    onClick={closeCart}
                    style={{ textDecoration: 'underline' }}
                  >
                    Log in
                  </Link>{' '}
                  to check out faster.
                </>
              ) : (
                'Discover our latest chapters and handcrafted silhouettes.'
              )}
            </p>
            <Link className="btn" to="/collections/all" onClick={closeCart}>
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <ul className="cart-list">
              {items.map((i) => (
                <li key={i.key || i._id}>
                  {i.img ? (
                    <img src={formatImageUrl(i.img)} alt={i.name} />
                  ) : (
                    <div className="ph small">MIQRAAZ</div>
                  )}
                  <div className="grow">
                    <strong>
                      <Link
                        to={`/products/${i.slug}`}
                        onClick={closeCart}
                        className="cart-item-title-link"
                      >
                        {i.name}
                      </Link>
                    </strong>
                    <div className="muted">Size: {i.size}</div>
                    <div className="qty">
                      <button
                        type="button"
                        onClick={() => update(i._id || i.key, i.qty - 1)}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span>{i.qty}</span>
                      <button
                        type="button"
                        onClick={() => update(i._id || i.key, i.qty + 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        className="link"
                        onClick={() => remove(i._id || i.key)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="cart-item-price-col">
                    {money(i.price * i.qty)}
                  </div>
                </li>
              ))}
            </ul>

            <div className="drawer-foot">
              <div className="row">
                <span>Subtotal</span>
                <strong>{money(subtotal)}</strong>
              </div>
              <p className="muted">
                Taxes, shipping, and promotional discounts calculated at checkout.
              </p>
              <div className="drawer-actions">
                <button
                  type="button"
                  className="btn full"
                  onClick={handleCheckoutClick}
                >
                  Proceed to Checkout
                </button>
                <Link
                  to="/cart"
                  className="btn full light"
                  onClick={closeCart}
                >
                  View Full Cart
                </Link>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  )
}

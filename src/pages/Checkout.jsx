import { useState, useEffect } from 'react'
import { useNavigate, Navigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { useSettings } from '../context/SettingsContext.jsx'
import { ordersAPI, couponsAPI } from '../services/api.js'
import { PageLoader } from '../components/PageLoader.jsx'
import { money, formatImageUrl } from '../data.js'

export function Checkout() {
  const { items, subtotal, coupon, applyCoupon, removeCoupon, clear } = useCart()
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  // Shipping form state
  const [selectedAddressId, setSelectedAddressId] = useState('new')
  const [shippingForm, setShippingForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Pakistan',
  })

  // Coupon state
  const [couponInput, setCouponInput] = useState('')
  const [validatingCoupon, setValidatingCoupon] = useState(false)

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer')
  const [agreedTerms, setAgreedTerms] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Populate address from saved default if available
  useEffect(() => {
    if (user?.addresses && user.addresses.length > 0) {
      const defaultAddr = user.addresses.find((a) => a.isDefault) || user.addresses[0]
      setSelectedAddressId(defaultAddr._id)
      setShippingForm({
        fullName: defaultAddr.fullName || user.name || '',
        phone: defaultAddr.phone || user.phone || '',
        address: defaultAddr.address || '',
        city: defaultAddr.city || '',
        state: defaultAddr.state || '',
        postalCode: defaultAddr.postalCode || '',
        country: defaultAddr.country || 'Pakistan',
      })
    } else if (user) {
      setShippingForm((prev) => ({
        ...prev,
        fullName: user.name || '',
        phone: user.phone || '',
      }))
    }
  }, [user])

  // Handle selecting an address from saved addresses
  const handleSelectAddress = (id) => {
    setSelectedAddressId(id)
    if (id === 'new') {
      setShippingForm({
        fullName: user?.name || '',
        phone: user?.phone || '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'Pakistan',
      })
    } else {
      const addr = user?.addresses?.find((a) => a._id === id)
      if (addr) {
        setShippingForm({
          fullName: addr.fullName,
          phone: addr.phone,
          address: addr.address,
          city: addr.city,
          state: addr.state || '',
          postalCode: addr.postalCode || '',
          country: addr.country || 'Pakistan',
        })
      }
    }
  }

  const {
    calculateShipping,
    calculateTax,
    taxRatePercent,
    shippingMode,
    karachiShippingFee,
    codEnabled,
    contactPhone,
  } = useSettings()

  // Fallback to bank transfer if COD is disabled by admin settings
  useEffect(() => {
    if (!codEnabled && paymentMethod === 'cod') {
      setPaymentMethod('bank_transfer')
    }
  }, [codEnabled, paymentMethod])

  // Calculate pricing breakdown dynamically from admin settings & entered delivery city
  const discountAmount = coupon?.discountAmount || 0
  const taxableAmount = Math.max(0, subtotal - discountAmount)
  const shippingFee = calculateShipping(subtotal, shippingForm.city)
  const tax = calculateTax(taxableAmount)
  const grandTotal = Math.max(0, taxableAmount + shippingFee + tax)

  const handleApplyCoupon = async (e) => {
    e.preventDefault()
    if (!couponInput.trim()) return
    setValidatingCoupon(true)
    try {
      await applyCoupon(couponInput.trim())
      setCouponInput('')
    } catch {
      // Toast already shown
    } finally {
      setValidatingCoupon(false)
    }
  }

  // Guard: if checking auth session on reload, show luxury preloader
  if (authLoading) {
    return <PageLoader text="VERIFYING SESSION" />
  }

  // Guard: if user is not authenticated, redirect to login with redirect param
  if (!isAuthenticated) {
    return <Navigate to="/login?redirect=/checkout" replace />
  }

  // Guard: if cart is empty, redirect to collections
  if (items.length === 0) {
    return (
      <div className="section center narrow">
        <h2>Your Cart is Empty</h2>
        <p className="muted">Please add products to your cart before proceeding to checkout.</p>
        <Link to="/collections/all" className="btn" style={{ marginTop: '16px' }}>
          Explore Products
        </Link>
      </div>
    )
  }

  const handleSubmitOrder = async (e) => {
    e.preventDefault()

    if (!shippingForm.fullName || !shippingForm.phone || !shippingForm.address || !shippingForm.city) {
      showToast('Please fill in all required shipping address fields', 'error')
      return
    }

    if (!agreedTerms) {
      showToast('Please agree to the terms and conditions to place your order', 'error')
      return
    }

    setSubmitting(true)

    try {
      const orderPayload = {
        items: items.map((i) => ({
          product: i.productId,
          size: i.size,
          qty: i.qty,
        })),
        shippingAddress: shippingForm,
        paymentMethod,
        couponCode: coupon?.code || null,
      }

      const res = await ordersAPI.create(orderPayload)
      showToast(`Order #${res.order.orderNumber} placed successfully!`, 'success')

      // Clear cart
      await clear()

      // Redirect to confirmation page
      navigate(`/orders/${res.order.orderNumber}/success`, { state: { order: res.order } })
    } catch (err) {
      showToast(err.message || 'Failed to place order. Please check item stock and details.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="checkout-page-container">
      <div className="checkout-grid">
        {/* Left Column: Customer & Shipping Details */}
        <div className="checkout-main-col">
          <div className="checkout-section-header">
            <span className="checkout-step-num">1</span>
            <h2>Contact &amp; Shipping Details</h2>
          </div>

          <div className="checkout-user-box">
            <span>Signed in as: <strong>{user?.name}</strong> ({user?.email})</span>
          </div>

          {/* Saved Addresses Selector */}
          {user?.addresses && user.addresses.length > 0 && (
            <div className="saved-addresses-row">
              <label className="field-label">Select Shipping Address</label>
              <div className="address-options-list">
                {user.addresses.map((a) => (
                  <label
                    key={a._id}
                    className={`address-option-card ${selectedAddressId === a._id ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="selectedAddress"
                      checked={selectedAddressId === a._id}
                      onChange={() => handleSelectAddress(a._id)}
                    />
                    <div className="address-card-content">
                      <strong>{a.fullName}</strong> ({a.phone})
                      <p>{a.address}, {a.city}, {a.country}</p>
                    </div>
                  </label>
                ))}
                <label className={`address-option-card ${selectedAddressId === 'new' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="selectedAddress"
                    checked={selectedAddressId === 'new'}
                    onChange={() => handleSelectAddress('new')}
                  />
                  <div className="address-card-content">
                    <strong>+ Enter a new address</strong>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Address Fields Form */}
          <form onSubmit={handleSubmitOrder} id="checkout-form" className="checkout-form">
            <div className="form-row-2">
              <div className="field-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  required
                  value={shippingForm.fullName}
                  onChange={(e) => setShippingForm({ ...shippingForm, fullName: e.target.value })}
                  placeholder="e.g. Usaid Khan"
                />
              </div>
              <div className="field-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={shippingForm.phone}
                  onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                  placeholder="e.g. 0300 1234567"
                />
              </div>
            </div>

            <div className="field-group">
              <label>Street Address / Apartment *</label>
              <input
                type="text"
                required
                value={shippingForm.address}
                onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })}
                placeholder="House / Flat / Street address"
              />
            </div>

            <div className="form-row-3">
              <div className="field-group">
                <label>City *</label>
                <input
                  type="text"
                  required
                  value={shippingForm.city}
                  onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                  placeholder="Karachi, Lahore, etc."
                />
              </div>
              <div className="field-group">
                <label>State / Province</label>
                <input
                  type="text"
                  value={shippingForm.state}
                  onChange={(e) => setShippingForm({ ...shippingForm, state: e.target.value })}
                  placeholder="Sindh, Punjab..."
                />
              </div>
              <div className="field-group">
                <label>Postal Code</label>
                <input
                  type="text"
                  value={shippingForm.postalCode}
                  onChange={(e) => setShippingForm({ ...shippingForm, postalCode: e.target.value })}
                  placeholder="75600"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="checkout-section-header" style={{ marginTop: '36px' }}>
              <span className="checkout-step-num">2</span>
              <div>
                <h2>Payment</h2>
                <p className="muted font-xs" style={{ marginTop: '2px' }}>
                  All transactions are secure and encrypted.
                </p>
              </div>
            </div>

            <div className="payment-options-box">
              {/* Option 1: Bank Deposit */}
              <div className={`payment-option-group ${paymentMethod === 'bank_transfer' ? 'active' : ''}`}>
                <label className="payment-option-header" onClick={() => setPaymentMethod('bank_transfer')}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank_transfer"
                    checked={paymentMethod === 'bank_transfer'}
                    onChange={() => setPaymentMethod('bank_transfer')}
                  />
                  <span className="payment-title">Bank Deposit</span>
                </label>

                {paymentMethod === 'bank_transfer' && (
                  <div className="payment-option-details bank-details-box">
                    <p className="bank-account-name">MUHAMMAD SHAHEER ALI</p>
                    <p className="bank-branch-name">BANK AL HABIB</p>
                    <p className="bank-row">Account Number : <span>50050081007758012</span></p>
                    <p className="bank-row">IBAN : <span>PK67BAHL5005008100775801</span></p>
                    
                    <p className="bank-note">Please send us the payment screenshot for confirmation.</p>
                    <p className="bank-contact">
                      Whatsapp : <a href={`https://wa.me/${(contactPhone || '0339 7837586').replace(/[^0-9]/g, '').startsWith('92') ? (contactPhone || '0339 7837586').replace(/[^0-9]/g, '') : '92' + (contactPhone || '0339 7837586').replace(/[^0-9]/g, '').replace(/^0/, '')}`} target="_blank" rel="noreferrer">{contactPhone || '0339 7837586'}</a>
                    </p>
                  </div>
                )}
              </div>

              {/* Option 2: Cash on Delivery (COD) - only shown when enabled in Admin Settings */}
              {codEnabled && (
                <div className={`payment-option-group ${paymentMethod === 'cod' ? 'active' : ''}`}>
                  <label className="payment-option-header" onClick={() => setPaymentMethod('cod')}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                    />
                    <span className="payment-title">Cash on Delivery (COD)</span>
                  </label>
                </div>
              )}
            </div>

            {/* Terms and conditions acceptance */}
            <div className="terms-check-wrap">
              <label className="filter-checkbox-label">
                <input
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                />
                <span>
                  I have read and agree to the website{' '}
                  <Link to="/policies/terms-of-service" target="_blank" style={{ textDecoration: 'underline' }}>
                    terms and conditions
                  </Link>{' '}
                  and shipping policy.
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="btn full place-order-btn"
              disabled={submitting}
            >
              {submitting ? 'Placing Order...' : `Place Order — ${money(grandTotal)}`}
            </button>
          </form>
        </div>

        {/* Right Column: Order Summary & Coupon */}
        <div className="checkout-sidebar-col">
          <div className="checkout-summary-box">
            <h3>Order Summary ({items.length} items)</h3>

            <div className="checkout-items-list">
              {items.map((i) => (
                <div key={i.key || i._id} className="checkout-item-row">
                  <div className="checkout-item-thumb-wrap">
                    {i.img ? (
                      <img src={formatImageUrl(i.img)} alt={i.name} />
                    ) : (
                      <div className="ph small">MIQRAAZ</div>
                    )}
                    <span className="checkout-item-qty-badge">{i.qty}</span>
                  </div>
                  <div className="checkout-item-meta">
                    <strong>{i.name}</strong>
                    <div className="muted font-sm">Size: {i.size}</div>
                  </div>
                  <div className="checkout-item-price font-medium">
                    {money(i.price * i.qty)}
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon Application Box */}
            <div className="checkout-coupon-box">
              {coupon ? (
                <div className="coupon-applied-badge">
                  <div>
                    <strong>{coupon.code}</strong>
                    <div className="muted font-sm">
                      {coupon.discountType === 'percentage'
                        ? `${coupon.discountValue}% discount applied`
                        : `Rs. ${coupon.discountValue} discount applied`}
                      {coupon.isFirstOrderOnly && ' (First-Order Welcome Offer)'}
                    </div>
                  </div>
                  <button type="button" className="coupon-remove-btn" onClick={removeCoupon}>
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="coupon-form-inline">
                  <input
                    type="text"
                    placeholder="Discount code (e.g. FIRST10)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                  />
                  <button type="submit" className="btn sm" disabled={validatingCoupon}>
                    {validatingCoupon ? 'Validating...' : 'Apply'}
                  </button>
                </form>
              )}
            </div>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>{money(subtotal)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="summary-row text-discount">
                <span>Discount</span>
                <span>−{money(discountAmount)}</span>
              </div>
            )}

            <div className="summary-row">
              <span>Shipping</span>
              <span>
                {shippingFee === 0 ? (
                  <span className="text-free">
                    FREE {shippingMode === 'free' ? '(Nationwide)' : (shippingForm.city && shippingForm.city.toLowerCase().includes('karachi') && Number(karachiShippingFee || 0) === 0) ? '(Karachi Free)' : ''}
                  </span>
                ) : (
                  money(shippingFee)
                )}
              </span>
            </div>

            {tax > 0 && (
              <div className="summary-row">
                <span>Tax ({taxRatePercent}%)</span>
                <span>{money(tax)}</span>
              </div>
            )}

            <hr className="summary-sep" />

            <div className="summary-row total-row">
              <strong>Total Payable</strong>
              <strong>{money(grandTotal)}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

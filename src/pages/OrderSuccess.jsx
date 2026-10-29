import { useEffect, useState } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import { ordersAPI } from '../services/api.js'
import { money } from '../data.js'
import { CheckCircle2 } from 'lucide-react'

export function OrderSuccess() {
  const { orderNumber } = useParams()
  const location = useLocation()
  const [order, setOrder] = useState(location.state?.order || null)
  const [loading, setLoading] = useState(!order)

  useEffect(() => {
    if (!order && orderNumber) {
      ordersAPI
        .getById(orderNumber)
        .then((res) => setOrder(res.order))
        .catch((err) => console.warn('Could not fetch order confirmation:', err))
        .finally(() => setLoading(false))
    }
  }, [orderNumber, order])

  if (loading) {
    return (
      <div className="section center narrow">
        <h2>Loading your order confirmation...</h2>
      </div>
    )
  }

  return (
    <div className="order-success-page">
      <div className="order-success-card">
        <div className="success-icon-badge">
          <CheckCircle2 size={36} strokeWidth={2} />
        </div>
        <h1 className="success-title">Thank You For Your Order!</h1>
        <p className="success-subtitle">
          Your order has been received and is being processed by our team.
        </p>

        <div className="order-number-banner">
          Order Reference: <strong>{order?.orderNumber || orderNumber}</strong>
        </div>

        {order && (
          <div className="order-receipt-details">
            <div className="receipt-section">
              <h4>Shipping Information</h4>
              <p><strong>{order.shippingAddress?.fullName}</strong></p>
              <p>{order.shippingAddress?.address}, {order.shippingAddress?.city}</p>
              <p>Phone: {order.shippingAddress?.phone}</p>
            </div>

            <div className="receipt-section">
              <h4>Payment &amp; Status</h4>
              <p>Payment Method: <span className="uppercase font-medium">{order.paymentMethod === 'bank_transfer' ? 'Bank Deposit (Direct Bank Transfer)' : 'Cash on Delivery'}</span></p>
              <p>Order Status: <span className="uppercase font-medium">{order.orderStatus}</span></p>
              <p>Payment Status: <span className="uppercase font-medium">{order.paymentStatus}</span></p>
            </div>

            {order.paymentMethod === 'bank_transfer' && (
              <div className="receipt-section bank-deposit-success-card">
                <h4>Bank Transfer Instructions</h4>
                <p className="bank-account-name">MUHAMMAD SHAHEER ALI</p>
                <p className="bank-branch-name">BANK AL HABIB</p>
                <p className="bank-row">Account Number : <span>50050081007758012</span></p>
                <p className="bank-row">IBAN : <span>PK67BAHL5005008100775801</span></p>
                <p className="bank-note">Please send us the payment screenshot for confirmation.</p>
                <p className="bank-contact">
                  Whatsapp : <a href="https://wa.me/923397837586" target="_blank" rel="noreferrer">0339 7837586</a>
                </p>
              </div>
            )}

            <div className="receipt-items-list">
              <h4>Items Ordered</h4>
              {order.items?.map((item, idx) => (
                <div key={idx} className="receipt-item-row">
                  <div className="receipt-item-info">
                    <strong>{item.name}</strong>
                    <div className="muted font-sm">Size: {item.size} × {item.qty}</div>
                  </div>
                  <div className="receipt-item-price font-medium">
                    {money(item.price * item.qty)}
                  </div>
                </div>
              ))}

              <div className="receipt-totals-table">
                <div className="receipt-total-row">
                  <span>Subtotal</span>
                  <span>{money(order.subtotal)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="receipt-total-row text-discount">
                    <span>Discount ({order.coupon?.code || 'Coupon'})</span>
                    <span>−{money(order.discount)}</span>
                  </div>
                )}
                <div className="receipt-total-row">
                  <span>Shipping Fee</span>
                  <span>{order.shippingFee === 0 ? 'FREE' : money(order.shippingFee)}</span>
                </div>
                <hr className="summary-sep" />
                <div className="receipt-total-row total font-lg">
                  <strong>Total Paid / Payable</strong>
                  <strong>{money(order.total)}</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="order-success-actions">
          <Link to="/account?tab=orders" className="btn">
            View in My Orders
          </Link>
          <Link to="/collections/all" className="btn light">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}

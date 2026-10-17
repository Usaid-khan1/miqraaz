import { useState, useEffect } from 'react'
import {
  Search,
  Eye,
  X,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Package,
  Truck,
  CreditCard,
  User,
  MapPin,
  Clock,
  CheckCircle2,
} from 'lucide-react'
import { ordersAPI } from '../services/api.js'
import { useToast } from '../context/ToastContext.jsx'
import { money } from '../data.js'

export function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 })

  // Order Details Modal
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [newStatus, setNewStatus] = useState('')
  const [newPaymentStatus, setNewPaymentStatus] = useState('')
  const [statusNote, setStatusNote] = useState('')
  const [carrier, setCarrier] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [updating, setUpdating] = useState(false)
  const { showToast } = useToast()

  const loadOrders = () => {
    setLoading(true)
    ordersAPI
      .getAllAdmin({ status: statusFilter, search, page, limit: 15 })
      .then((res) => {
        setOrders(res.orders || [])
        if (res.pagination) setPagination(res.pagination)
      })
      .catch((err) => showToast(err.message, 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadOrders()
  }, [statusFilter, search, page])

  const handleOpenOrder = (o) => {
    setSelectedOrder(o)
    setNewStatus(o.orderStatus)
    setNewPaymentStatus(o.paymentStatus)
    setStatusNote('')
    setCarrier(o.trackingCarrier || '')
    setTrackingNumber(o.trackingNumber || '')
  }

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return
    setUpdating(true)
    try {
      const res = await ordersAPI.updateStatusAdmin(selectedOrder._id, {
        orderStatus: newStatus,
        paymentStatus: newPaymentStatus,
        note: statusNote,
      })
      showToast('Order fulfillment status updated', 'success')
      setSelectedOrder(res.order)
      loadOrders()
    } catch (err) {
      showToast(err.message || 'Failed to update order status', 'error')
    } finally {
      setUpdating(false)
    }
  }

  const handleUpdateTracking = async () => {
    if (!selectedOrder) return
    setUpdating(true)
    try {
      const res = await ordersAPI.updateTrackingAdmin(selectedOrder._id, {
        trackingNumber,
        trackingCarrier: carrier,
      })
      showToast('Tracking credentials saved', 'success')
      setSelectedOrder(res.order)
      loadOrders()
    } catch (err) {
      showToast(err.message || 'Failed to save tracking', 'error')
    } finally {
      setUpdating(false)
    }
  }

  const handleCancellationDecision = async (approved) => {
    if (!selectedOrder) return
    setUpdating(true)
    try {
      const res = await ordersAPI.approveCancellationAdmin(selectedOrder._id, approved)
      showToast(res.message, 'success')
      setSelectedOrder(res.order)
      loadOrders()
    } catch (err) {
      showToast(err.message || 'Error processing cancellation', 'error')
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Orders Management</h1>
          <p className="admin-page-subtitle">Inspect client orders, manage fulfillment stages, and allocate logistics tracking</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="admin-toolbar-row">
        <div className="admin-search-box">
          <Search size={16} className="admin-search-icon" />
          <input
            type="text"
            placeholder="Search by order number (MK-...), customer name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
        </div>

        <div className="admin-filter-pills-row">
          {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((st) => (
            <button
              key={st}
              type="button"
              className={`filter-pill-btn ${statusFilter === st ? 'active' : ''}`}
              onClick={() => {
                setStatusFilter(st)
                setPage(1)
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="admin-card">
        {loading ? (
          <div className="admin-loading-spinner-wrap">
            <div className="admin-spinner-ring" />
            <span>Loading customer orders...</span>
          </div>
        ) : orders.length > 0 ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Units</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id}>
                    <td>
                      <button
                        type="button"
                        className="admin-table-key-link"
                        onClick={() => handleOpenOrder(o)}
                      >
                        {o.orderNumber}
                      </button>
                    </td>
                    <td>
                      <div className="font-medium">{o.shippingAddress?.fullName}</div>
                      <div className="muted font-xs">{o.shippingAddress?.phone}</div>
                    </td>
                    <td><span className="font-xs muted">{new Date(o.createdAt).toLocaleDateString()}</span></td>
                    <td><span className="font-sm">{o.items?.reduce((s, i) => s + i.qty, 0)} pcs</span></td>
                    <td>
                      <div className="font-xs font-medium uppercase">{o.paymentMethod}</div>
                      <span className={`status-pill pill-sm status-${o.paymentStatus}`}>
                        {o.paymentStatus}
                      </span>
                    </td>
                    <td>
                      <span className={`status-pill status-${o.orderStatus}`}>
                        {o.orderStatus}
                      </span>
                      {o.cancellationRequested && !o.cancellationApproved && (
                        <div className="pill-sub-notice">Cancel Requested</div>
                      )}
                    </td>
                    <td><strong>{money(o.total)}</strong></td>
                    <td className="text-right">
                      <button
                        type="button"
                        className="admin-btn-secondary admin-btn-xs"
                        onClick={() => handleOpenOrder(o)}
                      >
                        <Eye size={13} />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-empty-state-box">
            <Package size={32} strokeWidth={1.5} className="muted" />
            <p>No orders found matching the filter criteria.</p>
          </div>
        )}
      </div>

      {/* Pagination Bar */}
      {pagination.totalPages > 1 && (
        <div className="pagination-bar">
          <button
            type="button"
            className="page-btn"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft size={15} />
            <span>Previous</span>
          </button>
          <span className="page-indicator">
            Page {page} of {pagination.totalPages}
          </span>
          <button
            type="button"
            className="page-btn"
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
          >
            <span>Next</span>
            <ChevronRight size={15} />
          </button>
        </div>
      )}

      {/* ORDER INSPECTION MODAL */}
      {selectedOrder && (
        <div className="admin-modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="admin-modal-card admin-modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <h3 className="admin-modal-title">Order #{selectedOrder.orderNumber}</h3>
                <p className="admin-modal-subtitle">
                  Recorded on {new Date(selectedOrder.createdAt).toLocaleString()} • Client: {selectedOrder.shippingAddress?.fullName}
                </p>
              </div>
              <button
                type="button"
                className="admin-modal-close-btn"
                onClick={() => setSelectedOrder(null)}
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            <div className="admin-modal-body">
              {/* Cancellation Request Warning */}
              {selectedOrder.cancellationRequested && !selectedOrder.cancellationApproved && (
                <div className="admin-alert-box alert-warning">
                  <div className="admin-alert-icon-wrap">
                    <AlertTriangle size={18} />
                  </div>
                  <div className="admin-alert-text">
                    <strong>Cancellation Request Pending</strong>
                    <p className="font-sm">
                      Customer requested cancellation. Reason: &ldquo;{selectedOrder.cancellationReason}&rdquo;
                    </p>
                  </div>
                  <div className="admin-alert-buttons">
                    <button
                      type="button"
                      className="admin-btn-primary admin-btn-xs"
                      onClick={() => handleCancellationDecision(true)}
                      disabled={updating}
                    >
                      Approve &amp; Restore Stock
                    </button>
                    <button
                      type="button"
                      className="admin-btn-secondary admin-btn-xs"
                      onClick={() => handleCancellationDecision(false)}
                      disabled={updating}
                    >
                      Reject Request
                    </button>
                  </div>
                </div>
              )}

              {/* Status Update & Tracking Controls */}
              <div className="form-row-2" style={{ marginBottom: '24px' }}>
                <div className="admin-subcard">
                  <div className="admin-subcard-header">
                    <Clock size={16} strokeWidth={1.8} />
                    <h4>Fulfillment &amp; Payment Lifecycle</h4>
                  </div>
                  <div className="form-row-2">
                    <div className="field-group">
                      <label>Fulfillment Stage</label>
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled (Restores Stock)</option>
                      </select>
                    </div>
                    <div className="field-group">
                      <label>Payment Status</label>
                      <select
                        value={newPaymentStatus}
                        onChange={(e) => setNewPaymentStatus(e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </div>
                  </div>
                  <div className="field-group" style={{ marginTop: '10px' }}>
                    <label>Audit Memo / Reason</label>
                    <input
                      type="text"
                      placeholder="e.g. Dispatched via TCS Express Karachi Hub"
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value)}
                    />
                  </div>
                  <div style={{ marginTop: '14px' }}>
                    <button
                      type="button"
                      className="admin-btn-primary admin-btn-xs"
                      onClick={handleUpdateStatus}
                      disabled={updating}
                    >
                      Apply Status Change
                    </button>
                  </div>
                </div>

                <div className="admin-subcard">
                  <div className="admin-subcard-header">
                    <Truck size={16} strokeWidth={1.8} />
                    <h4>Courier &amp; Logistics Tracking</h4>
                  </div>
                  <div className="field-group">
                    <label>Courier Carrier</label>
                    <input
                      type="text"
                      placeholder="e.g. TCS Express, Leopards, CallCourier"
                      value={carrier}
                      onChange={(e) => setCarrier(e.target.value)}
                    />
                  </div>
                  <div className="field-group" style={{ marginTop: '10px' }}>
                    <label>Tracking Number / Waybill</label>
                    <input
                      type="text"
                      placeholder="e.g. TCS-77291034"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                    />
                  </div>
                  <div style={{ marginTop: '14px' }}>
                    <button
                      type="button"
                      className="admin-btn-primary admin-btn-xs"
                      onClick={handleUpdateTracking}
                      disabled={updating}
                    >
                      Save Tracking
                    </button>
                  </div>
                </div>
              </div>

              {/* Customer and Shipping Snapshot */}
              <div className="form-row-2" style={{ marginBottom: '24px' }}>
                <div className="admin-subcard">
                  <div className="admin-subcard-header">
                    <User size={16} strokeWidth={1.8} />
                    <h4>Customer Profile</h4>
                  </div>
                  <p className="admin-meta-row"><strong>Name:</strong> {selectedOrder.shippingAddress?.fullName}</p>
                  <p className="admin-meta-row"><strong>Phone:</strong> {selectedOrder.shippingAddress?.phone}</p>
                  <p className="admin-meta-row"><strong>User Email:</strong> {selectedOrder.user?.email || 'Guest'}</p>
                </div>

                <div className="admin-subcard">
                  <div className="admin-subcard-header">
                    <MapPin size={16} strokeWidth={1.8} />
                    <h4>Shipping Destination</h4>
                  </div>
                  <p className="admin-meta-row">{selectedOrder.shippingAddress?.address}</p>
                  <p className="admin-meta-row">{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}</p>
                  <p className="admin-meta-row">{selectedOrder.shippingAddress?.country || 'Pakistan'} • Postal: {selectedOrder.shippingAddress?.postalCode || '—'}</p>
                </div>
              </div>

              {/* Ordered Items Table */}
              <div className="admin-subcard" style={{ marginBottom: '24px' }}>
                <div className="admin-subcard-header">
                  <Package size={16} strokeWidth={1.8} />
                  <h4>Ordered Articles ({selectedOrder.items?.length || 0})</h4>
                </div>
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Article</th>
                        <th>Variant Size</th>
                        <th>Unit Price</th>
                        <th>Quantity</th>
                        <th className="text-right">Line Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items?.map((item, idx) => (
                        <tr key={idx}>
                          <td>
                            <div className="admin-prod-cell">
                              {item.image ? (
                                <img src={item.image} alt={item.name} className="admin-thumb" />
                              ) : (
                                <div className="admin-thumb-empty">
                                  <Package size={16} strokeWidth={1.5} />
                                </div>
                              )}
                              <strong className="admin-prod-title">{item.name}</strong>
                            </div>
                          </td>
                          <td><span className="variant-chip">{item.size}</span></td>
                          <td>{money(item.price)}</td>
                          <td>{item.qty}</td>
                          <td className="text-right font-medium">
                            {money(item.price * item.qty)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="order-totals-summary-box">
                  <div className="summary-calc-row font-sm">
                    <span>Subtotal</span>
                    <span>{money(selectedOrder.subtotal)}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="summary-calc-row font-sm text-discount">
                      <span>Discount ({selectedOrder.coupon?.code || 'Promo'})</span>
                      <span>−{money(selectedOrder.discount)}</span>
                    </div>
                  )}
                  <div className="summary-calc-row font-sm">
                    <span>Shipping Fee</span>
                    <span>{selectedOrder.shippingFee === 0 ? 'FREE' : money(selectedOrder.shippingFee)}</span>
                  </div>
                  <div className="summary-calc-divider" />
                  <div className="summary-calc-row grand-total font-medium">
                    <span>Grand Total</span>
                    <span>{money(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>

              {/* Status Audit Timeline */}
              {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 && (
                <div className="admin-subcard">
                  <div className="admin-subcard-header">
                    <Clock size={16} strokeWidth={1.8} />
                    <h4>Lifecycle Audit Trail</h4>
                  </div>
                  <ul className="timeline-list">
                    {selectedOrder.statusHistory.map((sh, idx) => (
                      <li key={idx} className="timeline-item">
                        <span className="timeline-dot" />
                        <div className="timeline-content">
                          <span className="timeline-status uppercase font-medium">{sh.status}</span>
                          <span className="timeline-date font-xs muted">
                            {new Date(sh.changedAt).toLocaleString()}
                          </span>
                          {sh.note && <p className="timeline-note font-sm">{sh.note}</p>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="admin-modal-footer">
              <button
                type="button"
                className="admin-btn-secondary"
                onClick={() => setSelectedOrder(null)}
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

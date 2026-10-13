import { useState, useEffect } from 'react'
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
      showToast('Order status updated', 'success')
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
      showToast('Tracking details saved', 'success')
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
          <p className="muted font-sm">Inspect orders, update fulfillment lifecycles, and dispatch tracking</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="admin-toolbar-row">
        <div className="admin-search-input-wrap">
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
          <div className="admin-loading-spinner">Loading orders...</div>
        ) : orders.length > 0 ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id}>
                    <td>
                      <button
                        type="button"
                        className="link font-medium"
                        onClick={() => handleOpenOrder(o)}
                      >
                        {o.orderNumber}
                      </button>
                    </td>
                    <td>
                      <div><strong>{o.shippingAddress?.fullName}</strong></div>
                      <div className="muted font-xs">{o.shippingAddress?.phone}</div>
                    </td>
                    <td><span className="font-xs">{new Date(o.createdAt).toLocaleDateString()}</span></td>
                    <td>{o.items?.reduce((s, i) => s + i.qty, 0)} pcs</td>
                    <td>
                      <div className="uppercase font-xs"><strong>{o.paymentMethod}</strong></div>
                      <span className={`status-pill pill-sm status-${o.paymentStatus}`}>
                        {o.paymentStatus}
                      </span>
                    </td>
                    <td>
                      <span className={`status-pill status-${o.orderStatus}`}>
                        {o.orderStatus}
                      </span>
                      {o.cancellationRequested && !o.cancellationApproved && (
                        <div className="pill-sub-notice">Cancel Req.</div>
                      )}
                    </td>
                    <td><strong>{money(o.total)}</strong></td>
                    <td className="text-right">
                      <button
                        type="button"
                        className="btn sm light"
                        onClick={() => handleOpenOrder(o)}
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-empty-pane">
            <p className="muted">No orders found.</p>
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
            ← Previous
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
            Next →
          </button>
        </div>
      )}

      {/* ORDER INSPECTION MODAL */}
      {selectedOrder && (
        <div className="search-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-dialog-card xl" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>Order #{selectedOrder.orderNumber}</h3>
                <span className="muted font-xs">
                  Placed {new Date(selectedOrder.createdAt).toLocaleString()}
                </span>
              </div>
              <button
                type="button"
                className="icon-btn"
                onClick={() => setSelectedOrder(null)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body-scroll">
              {/* Cancellation Request Warning */}
              {selectedOrder.cancellationRequested && !selectedOrder.cancellationApproved && (
                <div className="admin-alert-banner alert-warning">
                  <div>
                    <strong>⚠️ Cancellation Request Pending</strong>
                    <p className="font-sm">
                      Customer requested cancellation. Reason: &ldquo;{selectedOrder.cancellationReason}&rdquo;
                    </p>
                  </div>
                  <div className="alert-actions">
                    <button
                      type="button"
                      className="btn sm"
                      onClick={() => handleCancellationDecision(true)}
                      disabled={updating}
                    >
                      Approve &amp; Restore Stock
                    </button>
                    <button
                      type="button"
                      className="btn sm light"
                      onClick={() => handleCancellationDecision(false)}
                      disabled={updating}
                    >
                      Reject Request
                    </button>
                  </div>
                </div>
              )}

              {/* Status Update & Tracking Controls */}
              <div className="order-manage-controls-grid">
                <div className="manage-box">
                  <h4>Update Order Lifecycle</h4>
                  <div className="form-row-2">
                    <div className="field-group">
                      <label>Fulfillment Status</label>
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
                  <div className="field-group">
                    <label>Status Note / Reason</label>
                    <input
                      type="text"
                      placeholder="e.g. Dispatched with CallCourier"
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    className="btn sm"
                    onClick={handleUpdateStatus}
                    disabled={updating}
                  >
                    Save Status
                  </button>
                </div>

                <div className="manage-box">
                  <h4>Courier Tracking Details</h4>
                  <div className="field-group">
                    <label>Carrier Name</label>
                    <input
                      type="text"
                      placeholder="e.g. TCS, Leopards, Call Courier"
                      value={carrier}
                      onChange={(e) => setCarrier(e.target.value)}
                    />
                  </div>
                  <div className="field-group">
                    <label>Tracking Number</label>
                    <input
                      type="text"
                      placeholder="e.g. 7891234567"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    className="btn sm"
                    onClick={handleUpdateTracking}
                    disabled={updating}
                  >
                    Save Tracking Info
                  </button>
                </div>
              </div>

              {/* Customer and Shipping Snapshot */}
              <div className="overview-two-col-grid" style={{ margin: '20px 0' }}>
                <div className="admin-subcard">
                  <h4>Customer Info</h4>
                  <p><strong>Name:</strong> {selectedOrder.shippingAddress?.fullName}</p>
                  <p><strong>Phone:</strong> {selectedOrder.shippingAddress?.phone}</p>
                  <p><strong>User Email:</strong> {selectedOrder.user?.email || 'N/A'}</p>
                </div>
                <div className="admin-subcard">
                  <h4>Shipping Address</h4>
                  <p>{selectedOrder.shippingAddress?.address}</p>
                  <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}</p>
                  <p>{selectedOrder.shippingAddress?.country}</p>
                </div>
              </div>

              {/* Items Table Snapshot */}
              <div className="admin-subcard">
                <h4>Ordered Items</h4>
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Size</th>
                        <th>Unit Price</th>
                        <th>Qty</th>
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
                                <div className="ph small admin-thumb">KESHK</div>
                              )}
                              <strong>{item.name}</strong>
                            </div>
                          </td>
                          <td>{item.size}</td>
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

                <div className="order-totals-snapshot-box">
                  <div className="row font-sm">
                    <span>Subtotal</span>
                    <span>{money(selectedOrder.subtotal)}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="row font-sm text-discount">
                      <span>Discount ({selectedOrder.coupon?.code || 'Coupon'})</span>
                      <span>−{money(selectedOrder.discount)}</span>
                    </div>
                  )}
                  <div className="row font-sm">
                    <span>Shipping Fee</span>
                    <span>{selectedOrder.shippingFee === 0 ? 'FREE' : money(selectedOrder.shippingFee)}</span>
                  </div>
                  <hr className="summary-sep" />
                  <div className="row font-medium font-lg">
                    <span>Grand Total</span>
                    <span>{money(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>

              {/* Status History Timeline */}
              {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 && (
                <div className="admin-subcard" style={{ marginTop: '20px' }}>
                  <h4>Audit Timeline</h4>
                  <ul className="timeline-list">
                    {selectedOrder.statusHistory.map((sh, idx) => (
                      <li key={idx} className="timeline-item">
                        <span className="timeline-dot" />
                        <div className="timeline-content">
                          <span className="timeline-status uppercase font-medium">{sh.status}</span>
                          <span className="timeline-date font-sm muted">
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
          </div>
        </div>
      )}
    </div>
  )
}

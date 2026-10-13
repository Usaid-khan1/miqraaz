import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { ordersAPI } from '../services/api.js'
import { money } from '../data.js'

export function Account() {
  const {
    user,
    isAuthenticated,
    loading: authLoading,
    logout,
    updateProfile,
    changePassword,
    addAddress,
    deleteAddress,
  } = useAuth()

  const { showToast } = useToast()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const activeTab = searchParams.get('tab') || 'overview'

  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [cancelModalOrder, setCancelModalOrder] = useState(null)
  const [cancelReason, setCancelReason] = useState('')
  const [cancelling, setCancelling] = useState(false)

  // Profile Form state
  const [profileName, setProfileName] = useState(user?.name || '')
  const [profilePhone, setProfilePhone] = useState(user?.phone || '')
  const [profileUpdating, setProfileUpdating] = useState(false)

  // Password Change state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [passwordUpdating, setPasswordUpdating] = useState(false)

  // Address Modal state
  const [addressModalOpen, setAddressModalOpen] = useState(false)
  const [addressForm, setAddressForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Pakistan',
    isDefault: false,
  })

  useEffect(() => {
    if (user) {
      setProfileName(user.name || '')
      setProfilePhone(user.phone || '')
    }
  }, [user])

  // Load orders when on orders or overview tab
  useEffect(() => {
    if (isAuthenticated) {
      setOrdersLoading(true)
      ordersAPI
        .getMyOrders()
        .then((res) => setOrders(res.orders || []))
        .catch((err) => console.warn('Could not load orders:', err))
        .finally(() => setOrdersLoading(false))
    }
  }, [isAuthenticated])

  if (!authLoading && !isAuthenticated) {
    navigate('/login')
    return null
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setProfileUpdating(true)
    try {
      await updateProfile({ name: profileName, phone: profilePhone })
    } finally {
      setProfileUpdating(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmNewPassword) {
      showToast('New passwords do not match', 'error')
      return
    }
    setPasswordUpdating(true)
    try {
      await changePassword(currentPassword, newPassword)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmNewPassword('')
    } finally {
      setPasswordUpdating(false)
    }
  }

  const handleAddAddress = async (e) => {
    e.preventDefault()
    try {
      await addAddress(addressForm)
      setAddressModalOpen(false)
      setAddressForm({
        fullName: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'Pakistan',
        isDefault: false,
      })
    } catch {
      // Toast handled by AuthContext
    }
  }

  const handleRequestCancellation = async (e) => {
    e.preventDefault()
    if (!cancelModalOrder) return

    setCancelling(true)
    try {
      const res = await ordersAPI.requestCancellation(cancelModalOrder._id, cancelReason)
      showToast(res.message, 'success')
      // Update local orders list
      setOrders((prev) =>
        prev.map((o) => (o._id === cancelModalOrder._id ? res.order : o))
      )
      if (selectedOrder?._id === cancelModalOrder._id) {
        setSelectedOrder(res.order)
      }
      setCancelModalOrder(null)
      setCancelReason('')
    } catch (err) {
      showToast(err.message || 'Cancellation request failed', 'error')
    } finally {
      setCancelling(false)
    }
  }

  return (
    <div className="account-page-container">
      <div className="account-header">
        <h1 className="account-welcome-title">My Account</h1>
        <p className="muted">
          Logged in as <strong>{user?.name}</strong> ({user?.email})
        </p>
      </div>

      <div className="account-layout">
        {/* Navigation Sidebar */}
        <aside className="account-nav-aside">
          <button
            type="button"
            className={`account-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setSearchParams({ tab: 'overview' })}
          >
            Overview
          </button>
          <button
            type="button"
            className={`account-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setSearchParams({ tab: 'orders' })}
          >
            My Orders ({orders.length})
          </button>
          <button
            type="button"
            className={`account-nav-item ${activeTab === 'addresses' ? 'active' : ''}`}
            onClick={() => setSearchParams({ tab: 'addresses' })}
          >
            Saved Addresses ({user?.addresses?.length || 0})
          </button>
          <button
            type="button"
            className={`account-nav-item ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setSearchParams({ tab: 'security' })}
          >
            Profile &amp; Security
          </button>
          <hr className="account-nav-sep" />
          <button
            type="button"
            className="account-nav-item logout-nav-item"
            onClick={() => {
              logout()
              navigate('/')
            }}
          >
            Sign Out
          </button>
        </aside>

        {/* Tab Content Area */}
        <div className="account-content-main">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="account-tab-pane">
              <h2>Account Overview</h2>

              <div className="overview-cards-grid">
                <div className="overview-card">
                  <h4>Account Details</h4>
                  <p><strong>{user?.name}</strong></p>
                  <p>{user?.email}</p>
                  <p>{user?.phone || 'No phone number provided'}</p>
                  <button
                    type="button"
                    className="link font-sm"
                    onClick={() => setSearchParams({ tab: 'security' })}
                  >
                    Edit details →
                  </button>
                </div>

                <div className="overview-card">
                  <h4>Default Shipping Address</h4>
                  {user?.addresses && user.addresses.length > 0 ? (
                    (() => {
                      const def = user.addresses.find((a) => a.isDefault) || user.addresses[0]
                      return (
                        <>
                          <p><strong>{def.fullName}</strong> ({def.phone})</p>
                          <p>{def.address}</p>
                          <p>{def.city}, {def.country}</p>
                          <button
                            type="button"
                            className="link font-sm"
                            onClick={() => setSearchParams({ tab: 'addresses' })}
                          >
                            Manage addresses →
                          </button>
                        </>
                      )
                    })()
                  ) : (
                    <>
                      <p className="muted">No saved addresses yet.</p>
                      <button
                        type="button"
                        className="btn sm light"
                        onClick={() => setAddressModalOpen(true)}
                      >
                        + Add Address
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Recent Orders Snapshot */}
              <div className="account-recent-orders-wrap">
                <div className="section-head-split">
                  <h3>Recent Orders</h3>
                  <button
                    type="button"
                    className="link font-sm"
                    onClick={() => setSearchParams({ tab: 'orders' })}
                  >
                    View all orders ({orders.length}) →
                  </button>
                </div>

                {ordersLoading ? (
                  <p className="muted">Loading recent orders...</p>
                ) : orders.length > 0 ? (
                  <div className="orders-table-wrap">
                    <table className="orders-table">
                      <thead>
                        <tr>
                          <th>Order #</th>
                          <th>Date</th>
                          <th>Status</th>
                          <th>Total</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 3).map((o) => (
                          <tr key={o._id}>
                            <td><strong>{o.orderNumber}</strong></td>
                            <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                            <td>
                              <span className={`status-pill status-${o.orderStatus}`}>
                                {o.orderStatus}
                              </span>
                            </td>
                            <td>{money(o.total)}</td>
                            <td>
                              <button
                                type="button"
                                className="link"
                                onClick={() => setSelectedOrder(o)}
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="empty-orders-note">
                    <p className="muted">You have not placed any orders yet.</p>
                    <Link to="/collections/all" className="btn sm">
                      Start Shopping
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS */}
          {activeTab === 'orders' && (
            <div className="account-tab-pane">
              <h2>My Orders</h2>

              {ordersLoading ? (
                <p className="muted">Loading orders...</p>
              ) : orders.length > 0 ? (
                <div className="orders-table-wrap">
                  <table className="orders-table">
                    <thead>
                      <tr>
                        <th>Order #</th>
                        <th>Date</th>
                        <th>Items</th>
                        <th>Status</th>
                        <th>Payment</th>
                        <th>Total</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((o) => (
                        <tr key={o._id}>
                          <td><strong>{o.orderNumber}</strong></td>
                          <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                          <td>{o.items?.reduce((s, i) => s + i.qty, 0)} items</td>
                          <td>
                            <span className={`status-pill status-${o.orderStatus}`}>
                              {o.orderStatus}
                            </span>
                            {o.cancellationRequested && !o.cancellationApproved && (
                              <span className="pill-sub-notice">Cancel Pending</span>
                            )}
                          </td>
                          <td>
                            <span className="uppercase font-sm">{o.paymentMethod}</span> ({o.paymentStatus})
                          </td>
                          <td><strong>{money(o.total)}</strong></td>
                          <td>
                            <button
                              type="button"
                              className="btn sm light"
                              onClick={() => setSelectedOrder(o)}
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-orders-note">
                  <p className="muted">You have no order history.</p>
                  <Link to="/collections/all" className="btn sm">
                    Discover Collections
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="account-tab-pane">
              <div className="section-head-split">
                <h2>Saved Shipping Addresses</h2>
                <button
                  type="button"
                  className="btn sm"
                  onClick={() => setAddressModalOpen(true)}
                >
                  + Add New Address
                </button>
              </div>

              {user?.addresses && user.addresses.length > 0 ? (
                <div className="addresses-grid">
                  {user.addresses.map((a) => (
                    <div key={a._id} className="address-box-card">
                      {a.isDefault && <span className="default-address-tag">Default</span>}
                      <h4>{a.fullName}</h4>
                      <p>{a.phone}</p>
                      <p>{a.address}</p>
                      <p>{a.city}, {a.state} {a.postalCode}</p>
                      <p>{a.country}</p>
                      <div className="address-box-actions">
                        <button
                          type="button"
                          className="link text-danger font-sm"
                          onClick={() => deleteAddress(a._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-orders-note">
                  <p className="muted">You have no saved addresses.</p>
                  <button
                    type="button"
                    className="btn sm"
                    onClick={() => setAddressModalOpen(true)}
                  >
                    Add Your First Address
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PROFILE & SECURITY */}
          {activeTab === 'security' && (
            <div className="account-tab-pane">
              <h2>Profile &amp; Security</h2>

              <div className="settings-forms-grid">
                {/* Profile Form */}
                <div className="settings-box">
                  <h3>Personal Information</h3>
                  <form onSubmit={handleUpdateProfile}>
                    <div className="field-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="field-group">
                      <label>Email Address</label>
                      <input type="email" value={user?.email || ''} disabled className="disabled-input" />
                      <span className="hint-note">Email cannot be changed directly.</span>
                    </div>
                    <div className="field-group">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        placeholder="0300 1234567"
                      />
                    </div>
                    <button type="submit" className="btn sm" disabled={profileUpdating}>
                      {profileUpdating ? 'Saving...' : 'Save Profile'}
                    </button>
                  </form>
                </div>

                {/* Password Form */}
                <div className="settings-box">
                  <h3>Change Password</h3>
                  <form onSubmit={handleChangePassword}>
                    <div className="field-group">
                      <label>Current Password</label>
                      <input
                        type="password"
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>
                    <div className="field-group">
                      <label>New Password (Min. 6 chars)</label>
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className="field-group">
                      <label>Confirm New Password</label>
                      <input
                        type="password"
                        required
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                      />
                    </div>
                    <button type="submit" className="btn sm" disabled={passwordUpdating}>
                      {passwordUpdating ? 'Updating...' : 'Update Password'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="search-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-dialog-card lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Order #{selectedOrder.orderNumber}</h3>
              <button
                type="button"
                className="icon-btn"
                onClick={() => setSelectedOrder(null)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body-scroll">
              <div className="order-modal-meta-grid">
                <div>
                  <span className="muted font-sm">Order Status:</span>
                  <div>
                    <span className={`status-pill status-${selectedOrder.orderStatus}`}>
                      {selectedOrder.orderStatus}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="muted font-sm">Placed On:</span>
                  <div><strong>{new Date(selectedOrder.createdAt).toLocaleString()}</strong></div>
                </div>
                <div>
                  <span className="muted font-sm">Payment:</span>
                  <div className="uppercase">
                    <strong>{selectedOrder.paymentMethod}</strong> ({selectedOrder.paymentStatus})
                  </div>
                </div>
                <div>
                  <span className="muted font-sm">Tracking Number:</span>
                  <div>
                    {selectedOrder.trackingNumber ? (
                      <strong>
                        {selectedOrder.trackingCarrier && `${selectedOrder.trackingCarrier}: `}
                        {selectedOrder.trackingNumber}
                      </strong>
                    ) : (
                      <span className="muted font-sm">Pending carrier dispatch</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Status History Timeline */}
              {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 && (
                <div className="order-timeline-box">
                  <h4>Status Timeline</h4>
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

              {/* Shipping Address Snapshot */}
              <div className="order-shipping-snapshot">
                <h4>Shipping Address</h4>
                <p><strong>{selectedOrder.shippingAddress?.fullName}</strong> ({selectedOrder.shippingAddress?.phone})</p>
                <p>{selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.city}</p>
              </div>

              {/* Items List */}
              <div className="order-items-snapshot">
                <h4>Purchased Items</h4>
                <div className="order-items-table">
                  {selectedOrder.items?.map((item, i) => (
                    <div key={i} className="order-item-snapshot-row">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="order-snapshot-thumb" />
                      ) : (
                        <div className="ph small">KESHK</div>
                      )}
                      <div className="order-snapshot-info">
                        <strong>{item.name}</strong>
                        <div className="muted font-sm">Size: {item.size} × {item.qty}</div>
                      </div>
                      <div className="order-snapshot-total font-medium">
                        {money(item.price * item.qty)}
                      </div>
                    </div>
                  ))}
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
                    <span>Shipping</span>
                    <span>{selectedOrder.shippingFee === 0 ? 'FREE' : money(selectedOrder.shippingFee)}</span>
                  </div>
                  <hr className="summary-sep" />
                  <div className="row font-medium font-lg">
                    <span>Grand Total</span>
                    <span>{money(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>

              {/* Cancellation Option for Eligible Orders */}
              {['pending', 'confirmed'].includes(selectedOrder.orderStatus) &&
                !selectedOrder.cancellationRequested && (
                  <div className="order-cancel-request-box">
                    <p className="font-sm muted">
                      Need to cancel this order? You can request a cancellation while it is still pending confirmation.
                    </p>
                    <button
                      type="button"
                      className="btn sm light text-danger"
                      onClick={() => setCancelModalOrder(selectedOrder)}
                    >
                      Request Order Cancellation
                    </button>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}

      {/* CANCELLATION REQUEST MODAL */}
      {cancelModalOrder && (
        <div className="search-overlay" onClick={() => setCancelModalOrder(null)}>
          <div className="modal-dialog-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Cancel Order #{cancelModalOrder.orderNumber}</h3>
              <button
                type="button"
                className="icon-btn"
                onClick={() => setCancelModalOrder(null)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleRequestCancellation} className="modal-body">
              <p className="font-sm" style={{ marginBottom: '16px' }}>
                Please provide a reason for cancelling this order:
              </p>
              <textarea
                rows={4}
                required
                placeholder="e.g. Changed my mind, ordered wrong size..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                style={{ width: '100%', padding: '10px', marginBottom: '16px' }}
              />
              <div className="modal-actions-row">
                <button
                  type="button"
                  className="btn sm light"
                  onClick={() => setCancelModalOrder(null)}
                >
                  Close
                </button>
                <button type="submit" className="btn sm" disabled={cancelling}>
                  {cancelling ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD ADDRESS MODAL */}
      {addressModalOpen && (
        <div className="search-overlay" onClick={() => setAddressModalOpen(false)}>
          <div className="modal-dialog-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Shipping Address</h3>
              <button
                type="button"
                className="icon-btn"
                onClick={() => setAddressModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddAddress} className="modal-body">
              <div className="form-row-2">
                <div className="field-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    required
                    value={addressForm.fullName}
                    onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                  />
                </div>
                <div className="field-group">
                  <label>Phone *</label>
                  <input
                    type="tel"
                    required
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="field-group">
                <label>Address *</label>
                <input
                  type="text"
                  required
                  value={addressForm.address}
                  onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                />
              </div>
              <div className="form-row-3">
                <div className="field-group">
                  <label>City *</label>
                  <input
                    type="text"
                    required
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                  />
                </div>
                <div className="field-group">
                  <label>State</label>
                  <input
                    type="text"
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                  />
                </div>
                <div className="field-group">
                  <label>Postal Code</label>
                  <input
                    type="text"
                    value={addressForm.postalCode}
                    onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                  />
                </div>
              </div>
              <div className="terms-check-wrap">
                <label className="filter-checkbox-label">
                  <input
                    type="checkbox"
                    checked={addressForm.isDefault}
                    onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                  />
                  <span>Set as default shipping address</span>
                </label>
              </div>
              <div className="modal-actions-row">
                <button
                  type="button"
                  className="btn sm light"
                  onClick={() => setAddressModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn sm">
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

import { useState, useEffect } from 'react'
import {
  Search,
  Users,
  Eye,
  X,
  User,
  ShoppingBag,
  ShieldAlert,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { usersAPI } from '../services/api.js'
import { useToast } from '../context/ToastContext.jsx'
import { money } from '../data.js'

export function AdminCustomers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 })

  // Customer Orders Modal
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [customerOrders, setCustomerOrders] = useState([])
  const [detailsLoading, setDetailsLoading] = useState(false)
  const { showToast, confirmModal } = useToast()

  const loadCustomers = () => {
    setLoading(true)
    usersAPI
      .getCustomersAdmin({ search, page, limit: 15 })
      .then((res) => {
        setCustomers(res.customers || [])
        if (res.pagination) setPagination(res.pagination)
      })
      .catch((err) => showToast(err.message, 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadCustomers()
  }, [search, page])

  const handleToggleStatus = async (id, currentStatus) => {
    const action = currentStatus === 'active' ? 'suspend' : 'activate'
    const ok = await confirmModal({
      title: `${action === 'suspend' ? 'Suspend' : 'Activate'} Customer Account`,
      message: `Are you sure you want to ${action} this customer profile? ${action === 'suspend' ? 'Suspended clients cannot place orders or sign in.' : 'Active clients will regain account access.'}`,
      confirmText: action === 'suspend' ? 'Suspend Account' : 'Activate Account',
      isDanger: action === 'suspend',
    })
    if (!ok) return

    try {
      const res = await usersAPI.toggleStatusAdmin(id)
      showToast(res.message, 'success')
      setCustomers((prev) =>
        prev.map((c) => (c._id === id ? { ...c, accountStatus: res.accountStatus } : c))
      )
    } catch (err) {
      showToast(err.message || 'Status toggle failed', 'error')
    }
  }

  const handleViewCustomer = (c) => {
    setSelectedCustomer(c)
    setDetailsLoading(true)
    usersAPI
      .getCustomerDetailsAdmin(c._id)
      .then((res) => setCustomerOrders(res.orders || []))
      .catch((err) => showToast(err.message, 'error'))
      .finally(() => setDetailsLoading(false))
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Customer Accounts</h1>
          <p className="admin-page-subtitle">Inspect registered client profiles, purchase history, and account standing</p>
        </div>
      </div>

      <div className="admin-toolbar-row">
        <div className="admin-search-box">
          <Search size={16} className="admin-search-icon" />
          <input
            type="text"
            placeholder="Search by customer name, email, phone..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
        </div>
        <span className="admin-counter-text">{pagination.total} registered accounts</span>
      </div>

      <div className="admin-card">
        {loading ? (
          <div className="admin-loading-spinner-wrap">
            <div className="admin-spinner-ring" />
            <span>Loading customer accounts...</span>
          </div>
        ) : customers.length > 0 ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Contact Details</th>
                  <th>Joined</th>
                  <th>Orders</th>
                  <th>Total Spent</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c._id}>
                    <td>
                      <div className="admin-prod-cell">
                        <div className="admin-avatar-chip">
                          {c.name ? c.name.slice(0, 2).toUpperCase() : 'CU'}
                        </div>
                        <div>
                          <strong className="admin-prod-title">{c.name}</strong>
                          <div className="muted font-xs font-mono">{c._id}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="font-medium font-sm">{c.email}</div>
                      <div className="muted font-xs">{c.phone || 'No phone recorded'}</div>
                    </td>
                    <td><span className="font-xs muted">{new Date(c.createdAt).toLocaleDateString()}</span></td>
                    <td><span className="font-sm font-medium">{c.orderCount || 0} orders</span></td>
                    <td><strong>{money(c.totalSpent || 0)}</strong></td>
                    <td>
                      <span className={`status-pill ${c.accountStatus === 'active' ? 'status-delivered' : 'status-cancelled'}`}>
                        {c.accountStatus}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="admin-action-btn-group">
                        <button
                          type="button"
                          className="admin-btn-secondary admin-btn-xs"
                          onClick={() => handleViewCustomer(c)}
                        >
                          <Eye size={13} />
                          <span>Orders</span>
                        </button>
                        <button
                          type="button"
                          className={`admin-btn-xs ${c.accountStatus === 'active' ? 'admin-btn-outline-danger' : 'admin-btn-outline-success'}`}
                          onClick={() => handleToggleStatus(c._id, c.accountStatus)}
                        >
                          {c.accountStatus === 'active' ? 'Suspend' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-empty-state-box">
            <Users size={32} strokeWidth={1.5} className="muted" />
            <p>No customer profiles found matching your search.</p>
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

      {/* Customer Orders Modal */}
      {selectedCustomer && (
        <div className="admin-modal-overlay" onClick={() => setSelectedCustomer(null)}>
          <div className="admin-modal-card admin-modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <h3 className="admin-modal-title">Client Profile: {selectedCustomer.name}</h3>
                <p className="admin-modal-subtitle">Review profile credentials and purchase order history</p>
              </div>
              <button
                type="button"
                className="admin-modal-close-btn"
                onClick={() => setSelectedCustomer(null)}
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            <div className="admin-modal-body">
              <div className="form-row-2" style={{ marginBottom: '24px' }}>
                <div className="admin-subcard">
                  <div className="admin-subcard-header">
                    <User size={16} strokeWidth={1.8} />
                    <h4>Profile Information</h4>
                  </div>
                  <p className="admin-meta-row"><strong>Email:</strong> {selectedCustomer.email}</p>
                  <p className="admin-meta-row"><strong>Phone:</strong> {selectedCustomer.phone || 'N/A'}</p>
                  <p className="admin-meta-row">
                    <strong>Standing:</strong>{' '}
                    <span className={`status-pill pill-sm ${selectedCustomer.accountStatus === 'active' ? 'status-delivered' : 'status-cancelled'}`}>
                      {selectedCustomer.accountStatus}
                    </span>
                  </p>
                </div>

                <div className="admin-subcard">
                  <div className="admin-subcard-header">
                    <ShoppingBag size={16} strokeWidth={1.8} />
                    <h4>Commercial Activity</h4>
                  </div>
                  <p className="admin-meta-row"><strong>Total Orders:</strong> {customerOrders.length}</p>
                  <p className="admin-meta-row">
                    <strong>Lifetime Value:</strong>{' '}
                    {money(customerOrders.filter((o) => o.orderStatus !== 'cancelled').reduce((s, o) => s + o.total, 0))}
                  </p>
                </div>
              </div>

              <div className="admin-subcard">
                <div className="admin-subcard-header">
                  <ShoppingBag size={16} strokeWidth={1.8} />
                  <h4>Historical Orders</h4>
                </div>

                {detailsLoading ? (
                  <p className="muted font-sm" style={{ padding: '16px 0' }}>Loading client purchase history...</p>
                ) : customerOrders.length > 0 ? (
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Order Number</th>
                          <th>Date</th>
                          <th>Articles</th>
                          <th>Fulfillment</th>
                          <th className="text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customerOrders.map((o) => (
                          <tr key={o._id}>
                            <td><strong className="font-mono">{o.orderNumber}</strong></td>
                            <td><span className="font-xs muted">{new Date(o.createdAt).toLocaleDateString()}</span></td>
                            <td>{o.items?.length} items</td>
                            <td>
                              <span className={`status-pill status-${o.orderStatus}`}>
                                {o.orderStatus}
                              </span>
                            </td>
                            <td className="text-right font-medium">{money(o.total)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="muted font-sm" style={{ padding: '16px 0' }}>This customer has not placed any orders yet.</p>
                )}
              </div>
            </div>

            <div className="admin-modal-footer">
              <button
                type="button"
                className="admin-btn-secondary"
                onClick={() => setSelectedCustomer(null)}
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

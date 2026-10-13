import { useState, useEffect } from 'react'
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
  const { showToast } = useToast()

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
    if (!window.confirm(`Are you sure you want to ${action} this customer account?`)) return

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
          <p className="muted font-sm">Inspect registered customer profiles, purchase history, and account status</p>
        </div>
      </div>

      <div className="admin-toolbar-row">
        <div className="admin-search-input-wrap">
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
        <span className="font-sm muted">Total: {pagination.total} registered users</span>
      </div>

      <div className="admin-card">
        {loading ? (
          <div className="admin-loading-spinner">Loading customers...</div>
        ) : customers.length > 0 ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Contact</th>
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
                      <strong>{c.name}</strong>
                      <div className="muted font-xs">{c._id}</div>
                    </td>
                    <td>
                      <div>{c.email}</div>
                      <div className="muted font-xs">{c.phone || 'No phone'}</div>
                    </td>
                    <td><span className="font-xs">{new Date(c.createdAt).toLocaleDateString()}</span></td>
                    <td>{c.orderCount || 0} orders</td>
                    <td><strong>{money(c.totalSpent || 0)}</strong></td>
                    <td>
                      <span className={`status-pill ${c.accountStatus === 'active' ? 'status-delivered' : 'status-cancelled'}`}>
                        {c.accountStatus}
                      </span>
                    </td>
                    <td className="text-right">
                      <button
                        type="button"
                        className="link font-sm mr-2"
                        onClick={() => handleViewCustomer(c)}
                      >
                        Orders
                      </button>
                      <button
                        type="button"
                        className={`link font-sm ${c.accountStatus === 'active' ? 'text-danger' : 'text-success'}`}
                        onClick={() => handleToggleStatus(c._id, c.accountStatus)}
                      >
                        {c.accountStatus === 'active' ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-empty-pane">
            <p className="muted">No customers found.</p>
          </div>
        )}
      </div>

      {/* Customer Orders Modal */}
      {selectedCustomer && (
        <div className="search-overlay" onClick={() => setSelectedCustomer(null)}>
          <div className="modal-dialog-card lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Customer: {selectedCustomer.name}</h3>
              <button type="button" className="icon-btn" onClick={() => setSelectedCustomer(null)}>
                ✕
              </button>
            </div>

            <div className="modal-body-scroll">
              <div className="overview-two-col-grid" style={{ marginBottom: '20px' }}>
                <div className="admin-subcard">
                  <h4>Profile Info</h4>
                  <p><strong>Email:</strong> {selectedCustomer.email}</p>
                  <p><strong>Phone:</strong> {selectedCustomer.phone || 'N/A'}</p>
                  <p><strong>Status:</strong> {selectedCustomer.accountStatus}</p>
                </div>
                <div className="admin-subcard">
                  <h4>Activity</h4>
                  <p><strong>Total Orders:</strong> {customerOrders.length}</p>
                  <p>
                    <strong>Total Value:</strong>{' '}
                    {money(customerOrders.filter((o) => o.orderStatus !== 'cancelled').reduce((s, o) => s + o.total, 0))}
                  </p>
                </div>
              </div>

              <h4>Order History</h4>
              {detailsLoading ? (
                <p className="muted">Loading customer orders...</p>
              ) : customerOrders.length > 0 ? (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Order #</th>
                        <th>Date</th>
                        <th>Items</th>
                        <th>Status</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customerOrders.map((o) => (
                        <tr key={o._id}>
                          <td><strong>{o.orderNumber}</strong></td>
                          <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                          <td>{o.items?.length} items</td>
                          <td>
                            <span className={`status-pill status-${o.orderStatus}`}>
                              {o.orderStatus}
                            </span>
                          </td>
                          <td>{money(o.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="muted">This customer has not placed any orders yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

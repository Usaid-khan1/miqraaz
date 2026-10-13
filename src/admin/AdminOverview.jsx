import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { dashboardAPI } from '../services/api.js'
import { money } from '../data.js'

export function AdminOverview() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardAPI
      .getStats()
      .then((res) => setStats(res.stats))
      .catch((err) => console.warn('Could not load dashboard stats:', err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="admin-loading-spinner">Loading dashboard analytics...</div>
  }

  const {
    totalRevenue = 0,
    totalOrders = 0,
    statusCounts = {},
    totalCustomers = 0,
    totalProducts = 0,
    lowStockProducts = [],
    recentOrders = [],
  } = stats || {}

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard Overview</h1>
          <p className="muted font-sm">Live metrics and operations from MongoDB Atlas</p>
        </div>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="admin-kpi-grid">
        <div className="admin-kpi-card">
          <div className="kpi-label">Total Revenue</div>
          <div className="kpi-value">{money(totalRevenue)}</div>
          <div className="kpi-sub muted">From completed &amp; active orders</div>
        </div>

        <div className="admin-kpi-card">
          <div className="kpi-label">Total Orders</div>
          <div className="kpi-value">{totalOrders}</div>
          <div className="kpi-sub muted">All-time customer purchases</div>
        </div>

        <div className="admin-kpi-card">
          <div className="kpi-label">Registered Customers</div>
          <div className="kpi-value">{totalCustomers}</div>
          <div className="kpi-sub muted">Active customer accounts</div>
        </div>

        <div className="admin-kpi-card">
          <div className="kpi-label">Active Catalog Products</div>
          <div className="kpi-value">{totalProducts}</div>
          <div className="kpi-sub muted">Published for sale</div>
        </div>
      </div>

      {/* Order Status Counters */}
      <div className="status-counters-bar">
        <div className="status-counter-item">
          <span className="count-dot dot-pending" />
          <span className="count-label">Pending</span>
          <strong className="count-val">{statusCounts.pending || 0}</strong>
        </div>
        <div className="status-counter-item">
          <span className="count-dot dot-confirmed" />
          <span className="count-label">Confirmed</span>
          <strong className="count-val">{statusCounts.confirmed || 0}</strong>
        </div>
        <div className="status-counter-item">
          <span className="count-dot dot-processing" />
          <span className="count-label">Processing</span>
          <strong className="count-val">{statusCounts.processing || 0}</strong>
        </div>
        <div className="status-counter-item">
          <span className="count-dot dot-shipped" />
          <span className="count-label">Shipped</span>
          <strong className="count-val">{statusCounts.shipped || 0}</strong>
        </div>
        <div className="status-counter-item">
          <span className="count-dot dot-delivered" />
          <span className="count-label">Delivered</span>
          <strong className="count-val">{statusCounts.delivered || 0}</strong>
        </div>
        <div className="status-counter-item">
          <span className="count-dot dot-cancelled" />
          <span className="count-label">Cancelled</span>
          <strong className="count-val">{statusCounts.cancelled || 0}</strong>
        </div>
      </div>

      <div className="overview-two-col-grid">
        {/* Recent Orders */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Recent Orders</h3>
            <Link to="/admin/orders" className="link font-sm">
              View all orders →
            </Link>
          </div>

          {recentOrders.length > 0 ? (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((o) => (
                    <tr key={o._id}>
                      <td>
                        <Link to={`/admin/orders?search=${o.orderNumber}`} className="font-medium">
                          {o.orderNumber}
                        </Link>
                      </td>
                      <td>
                        <div>{o.shippingAddress?.fullName || o.user?.name}</div>
                        <div className="muted font-xs">{o.shippingAddress?.city}</div>
                      </td>
                      <td>
                        <span className={`status-pill status-${o.orderStatus}`}>
                          {o.orderStatus}
                        </span>
                      </td>
                      <td><strong>{money(o.total)}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="muted" style={{ padding: '20px' }}>No orders placed yet.</p>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Low Stock Alerts</h3>
            <Link to="/admin/inventory" className="link font-sm">
              Manage inventory →
            </Link>
          </div>

          {lowStockProducts.length > 0 ? (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Stock</th>
                    <th>Threshold</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockProducts.map((p) => (
                    <tr key={p._id}>
                      <td>
                        <Link to="/admin/products" className="font-medium">
                          {p.name}
                        </Link>
                      </td>
                      <td><span className="font-xs font-mono">{p.sku}</span></td>
                      <td>
                        <span className={`stock-badge ${p.totalStock <= 0 ? 'out' : 'low'}`}>
                          {p.totalStock} left
                        </span>
                      </td>
                      <td className="muted">{p.lowStockThreshold}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="all-stocked-note" style={{ padding: '24px', textAlign: 'center' }}>
              <p>✓ All products are currently stocked above their low-stock thresholds.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

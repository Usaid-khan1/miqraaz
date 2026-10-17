import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  DollarSign,
  ShoppingBag,
  Users,
  Layers,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Package,
} from 'lucide-react'
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
    return (
      <div className="admin-loading-spinner-wrap">
        <div className="admin-spinner-ring" />
        <span>Loading live analytics...</span>
      </div>
    )
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
          <h1 className="admin-page-title">Executive Overview</h1>
          <p className="admin-page-subtitle">Real-time commercial analytics, order fulfillment, and stock oversight</p>
        </div>
      </div>

      {/* Top 4 KPI Metric Cards */}
      <div className="admin-kpi-grid">
        <div className="admin-kpi-card">
          <div className="kpi-top-row">
            <span className="kpi-label">Gross Revenue</span>
            <div className="kpi-icon-pill">
              <DollarSign size={16} strokeWidth={2} />
            </div>
          </div>
          <div className="kpi-value">{money(totalRevenue)}</div>
          <div className="kpi-sub">Total revenue from recorded sales</div>
        </div>

        <div className="admin-kpi-card">
          <div className="kpi-top-row">
            <span className="kpi-label">Total Orders</span>
            <div className="kpi-icon-pill">
              <Package size={16} strokeWidth={2} />
            </div>
          </div>
          <div className="kpi-value">{totalOrders}</div>
          <div className="kpi-sub">All-time customer purchases</div>
        </div>

        <div className="admin-kpi-card">
          <div className="kpi-top-row">
            <span className="kpi-label">Customer Accounts</span>
            <div className="kpi-icon-pill">
              <Users size={16} strokeWidth={2} />
            </div>
          </div>
          <div className="kpi-value">{totalCustomers}</div>
          <div className="kpi-sub">Registered client profiles</div>
        </div>

        <div className="admin-kpi-card">
          <div className="kpi-top-row">
            <span className="kpi-label">Active Catalog</span>
            <div className="kpi-icon-pill">
              <Layers size={16} strokeWidth={2} />
            </div>
          </div>
          <div className="kpi-value">{totalProducts}</div>
          <div className="kpi-sub">Available articles in catalog</div>
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
        {/* Recent Orders Card */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3>Recent Orders</h3>
              <p className="admin-card-subtitle">Latest client purchase activity</p>
            </div>
            <Link to="/admin/orders" className="admin-card-link-action">
              <span>View all</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {recentOrders.length > 0 ? (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th className="text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((o) => (
                    <tr key={o._id}>
                      <td>
                        <Link to={`/admin/orders?search=${o.orderNumber}`} className="admin-table-key-link">
                          {o.orderNumber}
                        </Link>
                      </td>
                      <td>
                        <div className="font-medium">{o.shippingAddress?.fullName || o.user?.name || 'Customer'}</div>
                        <div className="muted font-xs">{o.shippingAddress?.city || 'Pakistan'}</div>
                      </td>
                      <td>
                        <span className={`status-pill status-${o.orderStatus}`}>
                          {o.orderStatus}
                        </span>
                      </td>
                      <td className="text-right">
                        <strong>{money(o.total)}</strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="admin-empty-state-box">
              <ShoppingBag size={28} strokeWidth={1.5} className="muted" />
              <p>No orders recorded yet.</p>
            </div>
          )}
        </div>

        {/* Low Stock Alerts Card */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3>Stock Alerts</h3>
              <p className="admin-card-subtitle">Variants approaching replenishment threshold</p>
            </div>
            <Link to="/admin/inventory" className="admin-card-link-action">
              <span>Manage stock</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {lowStockProducts.length > 0 ? (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Article</th>
                    <th>SKU</th>
                    <th>Stock</th>
                    <th className="text-right">Threshold</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockProducts.map((p) => (
                    <tr key={p._id}>
                      <td>
                        <Link to="/admin/products" className="admin-table-key-link">
                          {p.name}
                        </Link>
                      </td>
                      <td><span className="font-xs font-mono">{p.sku}</span></td>
                      <td>
                        <span className={`stock-badge ${p.totalStock <= 0 ? 'out' : 'low'}`}>
                          {p.totalStock} units
                        </span>
                      </td>
                      <td className="text-right muted font-sm">{p.lowStockThreshold} units</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="admin-empty-state-box">
              <CheckCircle2 size={28} strokeWidth={1.5} className="text-success" />
              <p>All catalog articles are stocked above threshold.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

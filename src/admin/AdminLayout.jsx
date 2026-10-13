import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { LOGO_WHITE } from '../data.js'

export function AdminLayout() {
  const { user, isAuthenticated, isAdmin, loading, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  if (loading) {
    return <div className="admin-loading-screen">Verifying administrator authorization...</div>
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="section center narrow" style={{ padding: '80px 20px' }}>
        <h2>Access Restricted</h2>
        <p className="muted" style={{ margin: '16px 0 24px' }}>
          You must be signed in with administrator privileges to access this control panel.
        </p>
        <Link to="/login?redirect=/admin" className="btn">
          Sign In as Administrator
        </Link>
      </div>
    )
  }

  return (
    <div className="admin-dashboard-root">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <Link to="/" target="_blank" title="View Store">
            <img src={LOGO_WHITE} alt="مِقْرَاض" height="28" />
          </Link>
          <span className="admin-badge">Admin Panel</span>
        </div>

        <nav className="admin-nav-menu">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="admin-nav-icon">📊</span> Overview
          </NavLink>
          <NavLink
            to="/admin/products"
            className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="admin-nav-icon">🏷️</span> Products
          </NavLink>
          <NavLink
            to="/admin/categories"
            className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="admin-nav-icon">📁</span> Categories
          </NavLink>
          <NavLink
            to="/admin/orders"
            className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="admin-nav-icon">📦</span> Orders
          </NavLink>
          <NavLink
            to="/admin/customers"
            className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="admin-nav-icon">👥</span> Customers
          </NavLink>
          <NavLink
            to="/admin/coupons"
            className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="admin-nav-icon">🎟️</span> Coupons
          </NavLink>
          <NavLink
            to="/admin/inventory"
            className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="admin-nav-icon">📋</span> Inventory
          </NavLink>
          <NavLink
            to="/admin/settings"
            className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="admin-nav-icon">⚙️</span> Settings
          </NavLink>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <strong>{user?.name}</strong>
            <span className="muted font-xs">{user?.email}</span>
          </div>
          <button
            type="button"
            className="admin-logout-btn"
            onClick={() => {
              logout()
              navigate('/')
            }}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <div className="admin-main-wrap">
        <header className="admin-topbar">
          <div className="admin-topbar-title">
            <span>Control Center</span>
          </div>
          <div className="admin-topbar-actions">
            <Link to="/" target="_blank" className="admin-preview-store-btn">
              View Live Store ↗
            </Link>
          </div>
        </header>

        <main className="admin-content-body">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  ShoppingBag,
  FolderTree,
  PackageCheck,
  Users,
  TicketPercent,
  Boxes,
  SlidersHorizontal,
  ArrowUpRight,
  LogOut,
  ShieldCheck,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { LOGO_WHITE } from '../data.js'

export function AdminLayout() {
  const { user, isAuthenticated, isAdmin, loading, logout } = useAuth()
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="admin-loading-screen">
        <div className="admin-spinner-ring" />
        <span>Verifying administrator authorization...</span>
      </div>
    )
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="admin-access-restricted-wrap">
        <div className="admin-access-restricted-card">
          <div className="admin-restricted-icon-wrap">
            <ShieldCheck size={32} strokeWidth={1.5} />
          </div>
          <h2>Access Restricted</h2>
          <p className="muted">
            You must be signed in with administrator privileges to access this control center.
          </p>
          <Link to="/login?redirect=/admin" className="btn sm">
            Sign In as Administrator
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard-root">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <Link to="/" target="_blank" title="Open Storefront" className="admin-brand-logo-link">
            <img src={LOGO_WHITE} alt="مِقْرَاض" height="26" />
          </Link>
          <span className="admin-badge">Admin</span>
        </div>

        <nav className="admin-nav-menu">
          <div className="admin-nav-group-title">Main Navigation</div>

          <NavLink
            to="/admin"
            end
            className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
          >
            <LayoutDashboard size={17} strokeWidth={1.8} className="admin-nav-icon" />
            <span>Overview</span>
          </NavLink>

          <NavLink
            to="/admin/products"
            className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
          >
            <ShoppingBag size={17} strokeWidth={1.8} className="admin-nav-icon" />
            <span>Products</span>
          </NavLink>

          <NavLink
            to="/admin/categories"
            className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
          >
            <FolderTree size={17} strokeWidth={1.8} className="admin-nav-icon" />
            <span>Categories</span>
          </NavLink>

          <NavLink
            to="/admin/orders"
            className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
          >
            <PackageCheck size={17} strokeWidth={1.8} className="admin-nav-icon" />
            <span>Orders</span>
          </NavLink>

          <NavLink
            to="/admin/customers"
            className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
          >
            <Users size={17} strokeWidth={1.8} className="admin-nav-icon" />
            <span>Customers</span>
          </NavLink>

          <div className="admin-nav-group-title" style={{ marginTop: '16px' }}>Operations</div>

          <NavLink
            to="/admin/coupons"
            className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
          >
            <TicketPercent size={17} strokeWidth={1.8} className="admin-nav-icon" />
            <span>Coupons</span>
          </NavLink>

          <NavLink
            to="/admin/inventory"
            className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
          >
            <Boxes size={17} strokeWidth={1.8} className="admin-nav-icon" />
            <span>Inventory</span>
          </NavLink>

          <NavLink
            to="/admin/settings"
            className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
          >
            <SlidersHorizontal size={17} strokeWidth={1.8} className="admin-nav-icon" />
            <span>Settings</span>
          </NavLink>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-profile">
            <div className="admin-avatar-initials">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AD'}
            </div>
            <div className="admin-user-details">
              <span className="admin-user-name">{user?.name}</span>
              <span className="admin-user-email">{user?.email}</span>
            </div>
          </div>
          <button
            type="button"
            className="admin-logout-btn"
            title="Sign out of Admin"
            onClick={() => {
              logout()
              navigate('/')
            }}
          >
            <LogOut size={16} strokeWidth={1.8} />
          </button>
        </div>
      </aside>

      {/* Main Content Wrap */}
      <div className="admin-main-wrap">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <span className="admin-topbar-breadcrumb">Management Console</span>
          </div>
          <div className="admin-topbar-actions">
            <Link to="/" target="_blank" className="admin-preview-store-btn">
              <span>View Live Store</span>
              <ArrowUpRight size={14} strokeWidth={2} />
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

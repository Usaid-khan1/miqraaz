import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LOGO_WHITE, LOGO_BLACK, formatImageUrl } from '../data.js'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { categoriesAPI } from '../services/api.js'

export function Header({ onOpenSearch }) {
  const [menu, setMenu] = useState(false)
  const [chap, setChap] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [accountDropdown, setAccountDropdown] = useState(false)
  const [categories, setCategories] = useState([])
  const [loadingCats, setLoadingCats] = useState(true)

  const { openCart, count } = useCart()
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const loc = useLocation()
  const navigate = useNavigate()
  const dropdownRef = useRef(null)

  const isHome = loc.pathname === '/'

  // Load categories dynamically from backend
  useEffect(() => {
    setLoadingCats(true)
    categoriesAPI
      .getAll()
      .then((res) => {
        if (res.categories) setCategories(res.categories)
      })
      .catch((err) => console.warn('Could not load categories:', err.message))
      .finally(() => setLoadingCats(false))
  }, [])

  // Close menus on route change
  useEffect(() => {
    setMenu(false)
    setChap(false)
    setAccountDropdown(false)
  }, [loc.pathname])

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Click outside account dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setAccountDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const isTransparent = isHome && !scrolled && !chap

  return (
    <header className={`header ${isTransparent ? 'header-transparent' : 'header-solid'}`}>
      {/* Navigation Menu / Mobile Drawer */}
      <nav className={`nav ${menu ? 'open' : ''}`}>
        <Link to="/" className={loc.pathname === '/' ? 'active' : ''}>
          HOME
        </Link>
        <Link
          to="/collections/all"
          className={loc.pathname.startsWith('/collections/all') ? 'active' : ''}
        >
          EXPLORE ALL
        </Link>
        <div
          className="has-sub"
          onMouseEnter={() => setChap(true)}
          onMouseLeave={() => setChap(false)}
        >
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              setChap(!chap)
            }}
            className={
              chap ||
              (loc.pathname.startsWith('/collections/') &&
                !loc.pathname.startsWith('/collections/all'))
                ? 'active'
                : ''
            }
          >
            ALL CHAPTER
          </a>
          <div className={`mega ${chap ? 'show' : ''}`}>
            {loadingCats ? (
              <div style={{ padding: '24px', textAlign: 'center', color: '#888', fontSize: '13px', width: '100%' }}>
                Loading collections...
              </div>
            ) : categories.length > 0 ? (
              categories.map((c) => (
                <Link
                  key={c.slug}
                  to={`/collections/${c.slug}`}
                  className="mega-item"
                  onClick={() => setChap(false)}
                >
                  {c.image ? (
                    <img src={formatImageUrl(c.image)} alt={c.name} loading="lazy" />
                  ) : (
                    <div className="ph mega-ph">{c.name}</div>
                  )}
                  <span>{c.name}</span>
                </Link>
              ))
            ) : (
              <div style={{ padding: '24px', textAlign: 'center', color: '#888', fontSize: '13px', width: '100%' }}>
                No collections available yet.
              </div>
            )}
          </div>
        </div>
        <Link
          to="/pages/contact"
          className={loc.pathname === '/pages/contact' ? 'active' : ''}
        >
          CONTACT
        </Link>

        {/* Mobile Navigation Drawer Account Section */}
        <div className="mobile-nav-user-section">
          {isAuthenticated ? (
            <>
              <div className="mobile-nav-user-info">
                <span>Signed in as: <strong>{user?.name}</strong></span>
              </div>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="mobile-nav-sublink"
                  onClick={() => setMenu(false)}
                >
                  Admin Dashboard
                </Link>
              )}
              <Link
                to="/account"
                className="mobile-nav-sublink"
                onClick={() => setMenu(false)}
              >
                My Account
              </Link>
              <button
                type="button"
                className="mobile-nav-logout"
                onClick={() => {
                  setMenu(false)
                  logout()
                  navigate('/')
                }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="mobile-nav-auth-buttons">
              <Link
                to="/login"
                className="mobile-nav-auth-btn"
                onClick={() => setMenu(false)}
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="mobile-nav-auth-btn mobile-nav-auth-btn-alt"
                onClick={() => setMenu(false)}
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Brand / Logo */}
      <Link to="/" className="logo" aria-label="Miqraaz Home">
        <img src={LOGO_WHITE} alt="مِقْرَاض" height="38" />
      </Link>

      <div className="header-actions">
        {/* Search trigger */}
        <button
          type="button"
          className="nav-icon-btn"
          onClick={onOpenSearch}
          aria-label="Search"
          title="Search"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>

        {/* Account Dropdown */}
        <div className="account-dropdown-wrap" ref={dropdownRef}>
          <button
            type="button"
            className="nav-icon-btn"
            onClick={() => setAccountDropdown(!accountDropdown)}
            aria-label="Account"
            title="Account"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>

          {accountDropdown && (
            <div className="account-dropdown-menu">
              {isAuthenticated ? (
                <>
                  <div className="dropdown-user-header">
                    <span className="dropdown-user-name">{user?.name}</span>
                    <span className="dropdown-user-email">{user?.email}</span>
                  </div>
                  <hr className="dropdown-sep" />
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="dropdown-link admin-highlight-link"
                      onClick={() => setAccountDropdown(false)}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                      Admin Dashboard
                    </Link>
                  )}
                  <Link
                    to="/account"
                    className="dropdown-link"
                    onClick={() => setAccountDropdown(false)}
                  >
                    My Account
                  </Link>
                  <Link
                    to="/account?tab=orders"
                    className="dropdown-link"
                    onClick={() => setAccountDropdown(false)}
                  >
                    My Orders
                  </Link>
                  <hr className="dropdown-sep" />
                  <button
                    type="button"
                    className="dropdown-link logout-btn"
                    onClick={() => {
                      setAccountDropdown(false)
                      logout()
                      navigate('/')
                    }}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <div className="dropdown-user-header">
                    <span className="dropdown-user-name">Welcome to Miqraaz</span>
                    <span className="dropdown-user-email">Sign in to your account</span>
                  </div>
                  <hr className="dropdown-sep" />
                  <Link
                    to="/login"
                    className="dropdown-link"
                    onClick={() => setAccountDropdown(false)}
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="dropdown-link"
                    onClick={() => setAccountDropdown(false)}
                  >
                    Create Account
                  </Link>
                </>
              )}
            </div>
          )}
        </div>

        {/* Cart Icon with Live Count */}
        <button
          type="button"
          className="nav-icon-btn cart-btn"
          onClick={openCart}
          aria-label="Cart"
          title="Shopping Cart"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="5" y="7.5" width="14" height="13.5" rx="1.5" />
            <path d="M8.5 7.5V5a3.5 3.5 0 0 1 7 0v2.5" />
          </svg>
          {count > 0 && <span className="cart-badge">{count}</span>}
        </button>

        {/* Mobile Burger Menu Button (positioned on the right) */}
        <button
          className={`icon-btn burger ${menu ? 'active' : ''}`}
          onClick={() => setMenu(!menu)}
          aria-label="Toggle navigation menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile nav backdrop */}
      {menu && (
        <div
          className="mobile-nav-backdrop"
          onClick={() => setMenu(false)}
          aria-hidden="true"
        />
      )}
    </header>
  )
}

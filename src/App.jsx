import { useState, useEffect, createContext, useContext } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { collections, products, SEARCH_RECOMMENDED, LOGO_WHITE, LOGO_BLACK, money } from './data.js'
import { Home, Collection, Product, About, Contact, Policy } from './pages.jsx'

export const CartCtx = createContext()
export const useCart = () => useContext(CartCtx)

function Header({ openCart, count }) {
  const [menu, setMenu] = useState(false)
  const [chap, setChap] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [accountOpen, setAccountOpen] = useState(false)
  const loc = useLocation()
  const isHome = loc.pathname === '/'

  useEffect(() => {
    setMenu(false)
    setChap(false)
    setSearchOpen(false)
    setAccountOpen(false)
  }, [loc.pathname])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSearchOpen(false)
        setSearchQuery('')
      }
    }
    if (searchOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [searchOpen])

  const displayProducts = searchQuery.trim()
    ? products.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 4)
    : SEARCH_RECOMMENDED

  const isTransparent = isHome && !scrolled && !chap && !searchOpen

  return (
    <>
      <header className={`header ${isTransparent ? 'header-transparent' : 'header-solid'}`}>
        <button className="icon-btn burger" onClick={() => setMenu(!menu)} aria-label="Menu">
          <span /><span /><span />
        </button>

        <nav className={'nav ' + (menu ? 'open' : '')}>
          <Link to="/" className={loc.pathname === '/' ? 'active' : ''}>HOME</Link>
          <Link to="/collections/all" className={loc.pathname.startsWith('/collections/all') ? 'active' : ''}>EXPLORE ALL</Link>
          <div className="has-sub" onMouseEnter={() => setChap(true)} onMouseLeave={() => setChap(false)}>
            <a href="#" onClick={(e) => { e.preventDefault(); setChap(!chap) }} className={chap || (loc.pathname.startsWith('/collections/') && !loc.pathname.startsWith('/collections/all')) ? 'active' : ''}>ALL CHAPTER</a>
            <div className={'mega ' + (chap ? 'show' : '')}>
              {collections.map((c) => (
                <Link key={c.slug} to={`/collections/${c.slug}`} className="mega-item" onClick={() => setChap(false)}>
                  <img src={c.img} alt={c.name} loading="lazy" /><span>{c.name}</span>
                </Link>
              ))}
            </div>
          </div>
          <Link to="/pages/contact" className={loc.pathname === '/pages/contact' ? 'active' : ''}>CONTACT</Link>
        </nav>

        <Link to="/" className="logo" aria-label="Home">
          <img src={LOGO_WHITE} alt="مِقْرَاض" height="38" />
        </Link>

        <div className="header-actions">
          <button className="nav-icon-btn" onClick={() => setSearchOpen(!searchOpen)} aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
          <button className="nav-icon-btn" onClick={() => setAccountOpen(true)} aria-label="Account">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
          <button className="nav-icon-btn cart-btn" onClick={openCart} aria-label="Cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="7.5" width="14" height="13.5" rx="1.5" />
              <path d="M8.5 7.5V5a3.5 3.5 0 0 1 7 0v2.5" />
            </svg>
            {count > 0 && <span className="cart-badge">{count}</span>}
          </button>
        </div>
      </header>

      {/* Search popup modal matching reference image */}
      {searchOpen && (
        <div className="search-overlay" onClick={() => { setSearchOpen(false); setSearchQuery(''); }}>
          <div className="search-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="search-input-wrap">
              <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                autoFocus
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="button"
                className="search-close-btn"
                onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                aria-label="Close search"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="search-products-section">
              <h4 className="search-section-title">Products</h4>
              {displayProducts.length > 0 ? (
                <div className="search-products-grid">
                  {displayProducts.map((p) => (
                    <Link
                      key={p.slug}
                      to={`/products/${p.slug}`}
                      className="search-card"
                      onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                    >
                      <div className="search-card-media">
                        {p.images && p.images[0] ? (
                          <img src={p.images[0]} alt={p.name} loading="lazy" />
                        ) : (
                          <div className="ph small">KESHK</div>
                        )}
                      </div>
                      <div className="search-card-info">
                        <div className="search-card-name">{p.name}</div>
                        <div className="search-card-price">{money(p.price)}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="search-no-results">No products found for "{searchQuery}"</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Account Login Modal */}
      {accountOpen && (
        <div className="account-modal-wrap">
          <div className="account-modal">
            <div className="account-head">
              <h3>Login</h3>
              <button className="icon-btn" onClick={() => setAccountOpen(false)} aria-label="Close">✕</button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); alert('Signed in (demo)'); setAccountOpen(false) }}>
              <div className="account-field">
                <label>Email</label>
                <input type="email" placeholder="name@example.com" required />
              </div>
              <div className="account-field">
                <label>Password</label>
                <input type="password" placeholder="••••••••" required />
              </div>
              <button type="submit" className="btn full">Sign In</button>
            </form>
          </div>
          <div className="overlay show" onClick={() => setAccountOpen(false)} />
        </div>
      )}
    </>
  )
}

function CartDrawer({ open, close }) {
  const { items, update, remove, total } = useCart()
  return (
    <>
      <div className={'overlay ' + (open ? 'show' : '')} onClick={close} />
      <aside className={'drawer ' + (open ? 'open' : '')}>
        <div className="drawer-head"><h3>Cart</h3><button className="icon-btn" onClick={close}>✕</button></div>
        {items.length === 0 ? (
          <div className="empty">
            <h3>Your cart is empty</h3>
            <p>Have an account? <a href="#">Log in</a> to check out faster.</p>
            <Link className="btn" to="/collections/all" onClick={close}>Continue shopping</Link>
          </div>
        ) : (
          <>
            <ul className="cart-list">
              {items.map((i) => (
                <li key={i.key}>
                  {i.img ? <img src={i.img} alt="" /> : <div className="ph small" />}
                  <div className="grow">
                    <strong>{i.name}</strong>
                    <div className="muted">Size: {i.size}</div>
                    <div className="qty">
                      <button onClick={() => update(i.key, i.qty - 1)}>−</button>
                      <span>{i.qty}</span>
                      <button onClick={() => update(i.key, i.qty + 1)}>+</button>
                      <button className="link" onClick={() => remove(i.key)}>Remove</button>
                    </div>
                  </div>
                  <div>{money(i.price * i.qty)}</div>
                </li>
              ))}
            </ul>
            <div className="drawer-foot">
              <div className="row"><span>Estimated total</span><strong>{money(total)}</strong></div>
              <p className="muted">Taxes and shipping calculated at checkout.</p>
              <button className="btn full" onClick={() => alert('Demo clone — checkout not connected.')}>Check out</button>
            </div>
          </>
        )}
      </aside>
    </>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div>
          <img src={LOGO_BLACK} alt="مِقْرَاض" className="flogo" />
          <p>Unisex fashion with traditional and street fusion.</p>
          <p>EST. in Lyari</p>
          <a href="https://www.instagram.com/keshk.official/" target="_blank" rel="noreferrer">Instagram</a>
        </div>
        <div>
          <h4>Company</h4>
          <Link to="/pages/about-keshk">About Us</Link>
          <Link to="/pages/contact">Contact Us</Link>
        </div>
        <div>
          <h4>Policies</h4>
          <Link to="/pages/return-exchange-policy">Return &amp; Exchange Policy</Link>
          <Link to="/pages/shipping-policy">Shipping Policy</Link>
          <Link to="/policies/privacy-policy">Privacy Policy</Link>
          <Link to="/policies/terms-of-service">Terms of Service</Link>
        </div>
      </div>
      <div className="footer-bottom">© 2026 <Link to="/">Keshk</Link></div>
    </footer>
  )
}

export default function App() {
  const [items, setItems] = useState([])
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [loc.pathname])

  const add = (p, size) => {
    const key = p.slug + size
    setItems((prev) => {
      const ex = prev.find((i) => i.key === key)
      if (ex) return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + 1 } : i))
      return [...prev, { key, name: p.name, price: p.price, size, img: p.images[0], qty: 1 }]
    })
    setOpen(true)
  }
  const update = (key, qty) => setItems((p) => (qty < 1 ? p.filter((i) => i.key !== key) : p.map((i) => (i.key === key ? { ...i, qty } : i))))
  const remove = (key) => setItems((p) => p.filter((i) => i.key !== key))
  const total = items.reduce((s, i) => s + i.price * i.qty, 0)
  const count = items.reduce((s, i) => s + i.qty, 0)

  return (
    <CartCtx.Provider value={{ items, add, update, remove, total }}>
      <Header openCart={() => setOpen(true)} count={count} />
      <main className={loc.pathname === '/' ? 'main-home' : 'main-inner'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collections/:slug" element={<Collection />} />
          <Route path="/products/:slug" element={<Product />} />
          <Route path="/pages/about-keshk" element={<About />} />
          <Route path="/pages/contact" element={<Contact />} />
          <Route path="/pages/:slug" element={<Policy />} />
          <Route path="/policies/:slug" element={<Policy />} />
          <Route path="*" element={<Policy notFound />} />
        </Routes>
      </main>
      <Footer />
      <CartDrawer open={open} close={() => setOpen(false)} />
    </CartCtx.Provider>
  )
}

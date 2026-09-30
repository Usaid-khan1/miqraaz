import { useState, useMemo, useRef, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { collections, products, money, HERO_BANNER_IMG } from './data.js'
import { useCart } from './App.jsx'

export function Card({ p }) {
  const [hover, setHover] = useState(false)
  const { add } = useCart()
  const img = (hover && p.images && p.images[1]) ? p.images[1] : (p.images && p.images[0])

  return (
    <div className="card-item">
      <Link
        to={`/products/${p.slug}`}
        className="card"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className="card-media">
          {img ? <img src={img} alt={p.name} loading="lazy" /> : <div className="ph">KESHK</div>}
          {p.soldOut && <span className="tag">Sold out</span>}
          {!p.soldOut && (
            <button
              className="quick-add-btn"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                add(p, 'M')
              }}
              title="Add to cart"
              aria-label="Add to cart"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="7.5" width="14" height="13.5" rx="1.5" />
                <path d="M8.5 7.5V5a3.5 3.5 0 0 1 7 0v2.5" />
                <line x1="12" y1="11" x2="12" y2="17" />
                <line x1="9" y1="14" x2="15" y2="14" />
              </svg>
            </button>
          )}
        </div>
        <h3 className="card-title">{p.name}</h3>
        <div className="price">{money(p.price)}</div>
      </Link>
    </div>
  )
}

export function ProductSlider({ items }) {
  const trackRef = useRef(null)

  const handleScroll = (dir) => {
    if (trackRef.current) {
      const scrollAmount = dir === 'left' ? -320 : 320
      trackRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  return (
    <div className="slider-container">
      <button className="slider-arrow left" onClick={() => handleScroll('left')} aria-label="Previous">
        ‹
      </button>
      <div className="slider-track" ref={trackRef}>
        {items.map((p) => (
          <div key={p.slug} className="slider-card-wrap">
            <Card p={p} />
          </div>
        ))}
      </div>
      <button className="slider-arrow right" onClick={() => handleScroll('right')} aria-label="Next">
        ›
      </button>
    </div>
  )
}

export function Home() {
  const rangProducts = products.filter((p) => p.collection === 'rang-xii')
  const exploreProducts = products.filter((p) => p.collection !== 'rang-xii' && p.images && p.images.length).slice(0, 4)

  const chapters = collections.filter((c) => c.slug !== 'rang-xii')

  return (
    <>
      {/* 1. Hero Section matching user screenshot */}
      <section
        className="hero"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(${HERO_BANNER_IMG})`,
        }}
      >
        <div className="hero-center-box">
          <div className="hero-kicker">NEW CHAPTER</div>
          <h1 className="hero-title">RANG XII</h1>
          <p className="hero-desc">
            RANG is about wearing something that feels personal, where every color holds meaning and every detail has a story worth carrying
          </p>
          <Link className="hero-btn" to="/collections/rang-xii">
            SHOP NOW
          </Link>
        </div>
      </section>

      {/* 2. Black Running Ticker Slider */}
      <div className="marquee-bar">
        <div className="marquee-track">
          <div className="marquee-content">
            <span>A LANGUAGE BEYOND FABRIC</span>
            <span>SOME STORIES ARE WRITTEN IN INK.</span>
            <span>OTHERS ARE WORN.</span>
            <span>A LANGUAGE BEYOND FABRIC</span>
            <span>SOME STORIES ARE WRITTEN IN INK.</span>
            <span>OTHERS ARE WORN.</span>
            <span>A LANGUAGE BEYOND FABRIC</span>
            <span>SOME STORIES ARE WRITTEN IN INK.</span>
            <span>OTHERS ARE WORN.</span>
          </div>
          <div className="marquee-content" aria-hidden="true">
            <span>A LANGUAGE BEYOND FABRIC</span>
            <span>SOME STORIES ARE WRITTEN IN INK.</span>
            <span>OTHERS ARE WORN.</span>
            <span>A LANGUAGE BEYOND FABRIC</span>
            <span>SOME STORIES ARE WRITTEN IN INK.</span>
            <span>OTHERS ARE WORN.</span>
            <span>A LANGUAGE BEYOND FABRIC</span>
            <span>SOME STORIES ARE WRITTEN IN INK.</span>
            <span>OTHERS ARE WORN.</span>
          </div>
        </div>
      </div>

      {/* 3. Horizontal Product Slider for RANG XII */}
      <section className="section product-slider-section">
        <ProductSlider items={rangProducts} />
      </section>

      {/* 4. Explore All Section */}
      <section className="section">
        <div className="section-head-split">
          <h2>Explore All</h2>
          <Link className="view-all-link" to="/collections/all">View all</Link>
        </div>
        <div className="grid">
          {exploreProducts.map((p) => (
            <Card key={p.slug} p={p} />
          ))}
        </div>
      </section>

      {/* 5. Chapters of Expression - 2 large cards per row */}
      <section className="section chapters-section">
        <div className="section-head">
          <h2>Chapters of Expression</h2>
          <p>Each collection is a chapter.</p>
          <p>Each chapter explores a different idea.</p>
        </div>
        <div className="chapter-grid-2col">
          {chapters.map((c) => (
            <Link key={c.slug} to={`/collections/${c.slug}`} className="chapter-card-large">
              <div className="chapter-media">
                <img src={c.img.replace('width=800', 'width=1400')} alt={c.name} loading="lazy" />
              </div>
              <div className="chapter-overlay">
                <h3 className="chapter-card-title">{c.name}</h3>
                <span className="chapter-card-shop">SHOP NOW</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}

export function Collection() {
  const { slug } = useParams()
  const isAll = slug === 'all' || slug === 'all-products'
  const col = collections.find((c) => c.slug === slug)

  // Default to showing in-stock products when on Explore All, matching the live store
  const [stock, setStock] = useState({ in: isAll, out: false })
  const [sort, setSort] = useState('featured')
  const [min, setMin] = useState('')
  const [max, setMax] = useState('')
  const [gridCols, setGridCols] = useState(5)
  const [availOpen, setAvailOpen] = useState(false)
  const [priceOpen, setPriceOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)

  const availRef = useRef(null)
  const priceRef = useRef(null)
  const sortRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (availRef.current && !availRef.current.contains(e.target)) setAvailOpen(false)
      if (priceRef.current && !priceRef.current.contains(e.target)) setPriceOpen(false)
      if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const baseProducts = useMemo(() => {
    return isAll ? products : products.filter((p) => p.collection === slug)
  }, [isAll, slug])

  const inStockCount = useMemo(() => baseProducts.filter((p) => !p.soldOut).length, [baseProducts])
  const outOfStockCount = useMemo(() => baseProducts.filter((p) => p.soldOut).length, [baseProducts])

  const list = useMemo(() => {
    let l = [...baseProducts]
    if (stock.in && !stock.out) l = l.filter((p) => !p.soldOut)
    if (stock.out && !stock.in) l = l.filter((p) => p.soldOut)
    if (min) l = l.filter((p) => p.price >= +min)
    if (max) l = l.filter((p) => p.price <= +max)
    const s = {
      az: (a, b) => a.name.localeCompare(b.name),
      za: (a, b) => b.name.localeCompare(a.name),
      lh: (a, b) => a.price - b.price,
      hl: (a, b) => b.price - a.price,
      featured: () => 0,
    }[sort]
    return s ? l.sort(s) : l
  }, [baseProducts, stock, sort, min, max])

  const pageTitle = isAll
    ? (stock.in && !stock.out ? 'All In-Stock Products' : 'All Products')
    : (col ? col.name : 'Collection')

  return (
    <div className="collection-page">
      {col && col.img && !isAll && (
        <div className="col-banner">
          <img src={col.img.replace('width=800', 'width=1600')} alt={col.name} />
        </div>
      )}
      <div className="collection-header">
        <h1 className="collection-title">{pageTitle}</h1>
      </div>

      <div className="collection-toolbar">
        <div className="toolbar-left">
          {/* Availability Popover */}
          <div className="filter-dropdown" ref={availRef}>
            <button
              type="button"
              className={`filter-btn ${(stock.in && !isAll) || stock.out ? 'filter-active' : ''}`}
              onClick={() => {
                setAvailOpen(!availOpen)
                setPriceOpen(false)
                setSortOpen(false)
              }}
            >
              Availability
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
            </button>
            {availOpen && (
              <div className="filter-popover">
                <div className="popover-header">
                  <span>Availability</span>
                  {(stock.in || stock.out) && (
                    <button
                      type="button"
                      className="popover-reset"
                      onClick={() => setStock({ in: false, out: false })}
                    >
                      Reset
                    </button>
                  )}
                </div>
                <div className="popover-body">
                  <label className="filter-checkbox-label">
                    <input
                      type="checkbox"
                      checked={stock.in}
                      onChange={(e) => setStock({ ...stock, in: e.target.checked })}
                    />
                    <span>In stock ({inStockCount})</span>
                  </label>
                  <label className="filter-checkbox-label">
                    <input
                      type="checkbox"
                      checked={stock.out}
                      onChange={(e) => setStock({ ...stock, out: e.target.checked })}
                    />
                    <span>Out of stock ({outOfStockCount})</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Price Popover */}
          <div className="filter-dropdown" ref={priceRef}>
            <button
              type="button"
              className={`filter-btn ${min || max ? 'filter-active' : ''}`}
              onClick={() => {
                setPriceOpen(!priceOpen)
                setAvailOpen(false)
                setSortOpen(false)
              }}
            >
              Price
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
            </button>
            {priceOpen && (
              <div className="filter-popover price-popover">
                <div className="popover-header">
                  <span>The highest price is Rs. 11,000.00</span>
                  {(min || max) && (
                    <button
                      type="button"
                      className="popover-reset"
                      onClick={() => { setMin(''); setMax(''); }}
                    >
                      Reset
                    </button>
                  )}
                </div>
                <div className="popover-body price-inputs-row">
                  <div className="price-input-group">
                    <span className="price-prefix">Rs.</span>
                    <input
                      type="number"
                      placeholder="0"
                      value={min}
                      onChange={(e) => setMin(e.target.value)}
                    />
                  </div>
                  <span className="price-sep">to</span>
                  <div className="price-input-group">
                    <span className="price-prefix">Rs.</span>
                    <input
                      type="number"
                      placeholder="11000"
                      value={max}
                      onChange={(e) => setMax(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="toolbar-right">
          <span className="items-count">{list.length} items</span>

          {/* Sort Dropdown */}
          <div className="sort-dropdown" ref={sortRef}>
            <button
              type="button"
              className="sort-btn"
              onClick={() => {
                setSortOpen(!sortOpen)
                setAvailOpen(false)
                setPriceOpen(false)
              }}
            >
              Sort
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
            </button>
            {sortOpen && (
              <div className="sort-popover">
                {[
                  { id: 'featured', label: 'Featured' },
                  { id: 'az', label: 'Alphabetically, A-Z' },
                  { id: 'za', label: 'Alphabetically, Z-A' },
                  { id: 'lh', label: 'Price, low to high' },
                  { id: 'hl', label: 'Price, high to low' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    className={`sort-option ${sort === opt.id ? 'active' : ''}`}
                    onClick={() => {
                      setSort(opt.id)
                      setSortOpen(false)
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Grid Layout Switcher */}
          <div className="grid-switcher">
            <button
              type="button"
              className={`grid-view-btn ${gridCols === 4 ? 'active' : ''}`}
              onClick={() => setGridCols(4)}
              title="4 columns"
              aria-label="4 columns"
            >
              <svg width="16" height="16" viewBox="0 0 18 18" fill="currentColor">
                <rect x="1" y="1" width="6.5" height="6.5" rx="1" />
                <rect x="10.5" y="1" width="6.5" height="6.5" rx="1" />
                <rect x="1" y="10.5" width="6.5" height="6.5" rx="1" />
                <rect x="10.5" y="10.5" width="6.5" height="6.5" rx="1" />
              </svg>
            </button>
            <button
              type="button"
              className={`grid-view-btn ${gridCols === 5 ? 'active' : ''}`}
              onClick={() => setGridCols(5)}
              title="5 columns"
              aria-label="5 columns"
            >
              <svg width="16" height="16" viewBox="0 0 18 18" fill="currentColor">
                <rect x="1" y="1" width="4" height="4" rx="0.5" />
                <rect x="7" y="1" width="4" height="4" rx="0.5" />
                <rect x="13" y="1" width="4" height="4" rx="0.5" />
                <rect x="1" y="7" width="4" height="4" rx="0.5" />
                <rect x="7" y="7" width="4" height="4" rx="0.5" />
                <rect x="13" y="7" width="4" height="4" rx="0.5" />
                <rect x="1" y="13" width="4" height="4" rx="0.5" />
                <rect x="7" y="13" width="4" height="4" rx="0.5" />
                <rect x="13" y="13" width="4" height="4" rx="0.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="collection-products-wrap">
        {list.length > 0 ? (
          <div className={`products-grid grid-cols-${gridCols}`}>
            {list.map((p) => (
              <Card key={p.slug} p={p} />
            ))}
          </div>
        ) : (
          <div className="no-products-msg">
            <p>No products match the selected criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export function Product() {
  const { slug } = useParams()
  const p = products.find((x) => x.slug === slug)
  const { add } = useCart()
  const [size, setSize] = useState('M')
  const [active, setActive] = useState(0)
  if (!p) return <section className="section center"><h1>Product not found</h1><Link className="btn" to="/collections/all">Continue shopping</Link></section>
  return (
    <section className="section pdp">
      <div className="pdp-gallery">
        {p.images.length ? (
          <>
            <img className="pdp-main" src={p.images[active]} alt={p.name} />
            <div className="thumbs">{p.images.map((im, i) => <img key={i} src={im} onClick={() => setActive(i)} className={i === active ? 'on' : ''} alt="" />)}</div>
          </>
        ) : <div className="ph big">KESHK</div>}
      </div>
      <div className="pdp-info">
        <h1>{p.name}</h1>
        <div className="price lg">{money(p.price)}</div>
        <p className="muted">Shipping calculated at checkout.</p>
        <div className="label">Size</div>
        <div className="sizes">
          {['S', 'M', 'L', 'XL'].map((s) => <button key={s} className={s === size ? 'on' : ''} onClick={() => setSize(s)}>{s}</button>)}
        </div>
        <button className="btn full" disabled={p.soldOut} onClick={() => add(p, size)}>{p.soldOut ? 'Sold out' : 'Add to cart'}</button>
        <p className="desc">Unisex fashion with traditional and street fusion. Designed in Lyari.</p>
      </div>
    </section>
  )
}

export function About() {
  return (
    <section className="section narrow">
      <h1 className="page-title">About Keshk</h1>
      <p><strong>Keshk</strong>, a Balochi word meaning direction towards your destiny, was founded in Lyari in 2023 a place where style has always existed in its most natural and unfiltered form.</p>
      <p>Growing up around that environment, we witnessed an undeniable love for fashion. It wasn’t defined by trends or validation, but by individuality, confidence, and self-expression. People carried style in a way that felt instinctive something lived, not performed. Yet, despite all of this, there was no true representation of us.</p>
      <p>What was missing was something that felt real, something that felt ours, something that people could see themselves in and belong to. <strong>Keshk</strong> was created as a response to that.</p>
      <p>It is an attempt to translate what we have always seen and experienced into something tangible pieces that carry a sense of identity, place, and direction. Rather than imposing a narrative, <strong>Keshk</strong> builds from what already exists, giving it form and space.</p>
      <p>At its core, <strong>Keshk</strong> is about moving with intention staying rooted in where you come from, while finding your own direction forward.</p>
    </section>
  )
}

export function Contact() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', comment: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="contact-page">
      <div className="contact-container">
        <h1 className="contact-title">Contact</h1>
        {sent ? (
          <div className="contact-success">
            <p className="contact-success-title">Thank you for contacting us.</p>
            <p className="contact-success-desc">We have received your message and will get back to you as soon as possible.</p>
            <button
              type="button"
              className="contact-submit-btn"
              onClick={() => {
                setSent(false)
                setForm({ name: '', email: '', phone: '', comment: '' })
              }}
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-row-2">
              <input
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <input
              type="tel"
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <textarea
              placeholder="Comment"
              rows={8}
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              required
            />
            <button type="submit" className="contact-submit-btn">
              Submit
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export function Policy({ notFound }) {
  const { slug } = useParams()
  const title = notFound ? '404 — Page not found' : (slug || '').replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  return (
    <section className="section narrow">
      <h1 className="page-title">{title}</h1>
      <p className="muted center">{notFound ? 'The page you are looking for does not exist.' : 'Paste the policy text from the original store here.'}</p>
    </section>
  )
}

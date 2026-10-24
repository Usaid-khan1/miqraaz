import { useState, useEffect, useRef, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card } from '../components/Card.jsx'
import { PageLoader } from '../components/PageLoader.jsx'
import { productsAPI, categoriesAPI } from '../services/api.js'

export function Collection() {
  const { slug } = useParams()
  const isAll = !slug || slug === 'all' || slug === 'all-products'

  const [category, setCategory] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 24, totalPages: 1 })

  // Filters & UI state
  const [stock, setStock] = useState({ in: isAll, out: false })
  const [sort, setSort] = useState('featured')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [gridCols, setGridCols] = useState(5)
  const [page, setPage] = useState(1)

  const [availOpen, setAvailOpen] = useState(false)
  const [priceOpen, setPriceOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)

  const availRef = useRef(null)
  const priceRef = useRef(null)
  const sortRef = useRef(null)

  // Fetch category info if on specific category
  useEffect(() => {
    if (!isAll && slug) {
      categoriesAPI
        .getBySlug(slug)
        .then((res) => setCategory(res.category || null))
        .catch(() => setCategory(null))
    } else {
      setCategory(null)
    }
    setPage(1)
  }, [slug, isAll])

  // Fetch products from backend whenever filters or page change
  useEffect(() => {
    let isMounted = true
    setLoading(true)

    const params = {
      collection: isAll ? 'all' : slug,
      sort,
      page,
      limit: 24,
    }

    if (stock.in && !stock.out) params.inStock = 'true'
    if (stock.out && !stock.in) params.outOfStock = 'true'
    if (minPrice) params.minPrice = minPrice
    if (maxPrice) params.maxPrice = maxPrice

    productsAPI
      .getAll(params)
      .then((res) => {
        if (isMounted) {
          setProducts(res.products || [])
          if (res.pagination) setPagination(res.pagination)
        }
      })
      .catch((err) => {
        console.warn('Failed to load products:', err)
        if (isMounted) setProducts([])
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [slug, isAll, sort, stock, minPrice, maxPrice, page])

  // Click outside listener for filter popovers
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (availRef.current && !availRef.current.contains(e.target)) setAvailOpen(false)
      if (priceRef.current && !priceRef.current.contains(e.target)) setPriceOpen(false)
      if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const inStockCount = useMemo(
    () => products.filter((p) => (p.totalStock ?? 0) > 0).length,
    [products]
  )
  const outOfStockCount = useMemo(
    () => products.filter((p) => (p.totalStock ?? 0) <= 0).length,
    [products]
  )

  const pageTitle = isAll
    ? stock.in && !stock.out
      ? 'All In-Stock Products'
      : 'All Products'
    : category
    ? category.name
    : slug
    ? slug.toUpperCase().replace(/-/g, ' ')
    : 'Collection'

  if (loading && products.length === 0) {
    return <PageLoader text="LOADING COLLECTION" />
  }

  return (
    <div className="collection-page">
      {/* Category Banner if available */}
      {category && category.image && !isAll && (
        <div className="col-banner">
          <img src={category.image} alt={category.name} />
        </div>
      )}

      <div className="collection-header">
        <h1 className="collection-title">{pageTitle}</h1>
        {category?.description && (
          <p className="collection-desc">{category.description}</p>
        )}
      </div>

      {/* Toolbar with Popovers & Controls */}
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
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m6 9 6 6 6-6" />
              </svg>
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
              className={`filter-btn ${minPrice || maxPrice ? 'filter-active' : ''}`}
              onClick={() => {
                setPriceOpen(!priceOpen)
                setAvailOpen(false)
                setSortOpen(false)
              }}
            >
              Price
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            {priceOpen && (
              <div className="filter-popover price-popover">
                <div className="popover-header">
                  <span>Filter by price</span>
                  {(minPrice || maxPrice) && (
                    <button
                      type="button"
                      className="popover-reset"
                      onClick={() => {
                        setMinPrice('')
                        setMaxPrice('')
                      }}
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
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                  </div>
                  <span className="price-sep">to</span>
                  <div className="price-input-group">
                    <span className="price-prefix">Rs.</span>
                    <input
                      type="number"
                      placeholder="15000"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="toolbar-right">
          <span className="items-count">
            {pagination.total > 0 ? `${pagination.total} items` : `${products.length} items`}
          </span>

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
              Sort: {sort === 'az' ? 'A-Z' : sort === 'za' ? 'Z-A' : sort === 'lh' ? 'Price: Low' : sort === 'hl' ? 'Price: High' : 'Featured'}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            {sortOpen && (
              <div className="sort-popover">
                {[
                  { id: 'featured', label: 'Featured' },
                  { id: 'az', label: 'Alphabetically, A-Z' },
                  { id: 'za', label: 'Alphabetically, Z-A' },
                  { id: 'lh', label: 'Price, low to high' },
                  { id: 'hl', label: 'Price, high to low' },
                  { id: 'newest', label: 'Date, new to old' },
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

          {/* Grid View Switcher */}
          <div className="grid-switcher">
            <button
              type="button"
              className={`grid-view-btn ${gridCols === 4 ? 'active' : ''}`}
              onClick={() => setGridCols(4)}
              title="4 columns"
              aria-label="4 columns layout"
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
              aria-label="5 columns layout"
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

      {/* Product Grid or Skeletons */}
      <div className="collection-products-wrap">
        {loading ? (
          <div className={`products-grid grid-cols-${gridCols}`}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="skeleton-card" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <div className={`products-grid grid-cols-${gridCols}`}>
              {products.map((p) => (
                <Card key={p._id || p.slug} p={p} />
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="pagination-bar">
                <button
                  type="button"
                  className="page-btn"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  ← Previous
                </button>
                <span className="page-indicator">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  type="button"
                  className="page-btn"
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="no-products-msg">
            <p>No products match your active filters.</p>
            <button
              type="button"
              className="btn"
              onClick={() => {
                setStock({ in: false, out: false })
                setMinPrice('')
                setMaxPrice('')
                setSort('featured')
              }}
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

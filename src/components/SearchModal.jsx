import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { productsAPI } from '../services/api.js'
import { money } from '../data.js'
import { X } from 'lucide-react'

export function SearchModal({ open, onClose }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      document.body.style.overflow = ''
      setQuery('')
      setResults([])
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && open) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      // If query is empty, show default recommended featured products
      productsAPI
        .getAll({ featured: 'true', limit: 4 })
        .then((res) => setResults(res.products || []))
        .catch(() => setResults([]))
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await productsAPI.getAll({ search: query.trim(), limit: 6 })
        setResults(res.products || [])
      } catch (err) {
        console.warn('Search error:', err)
      } finally {
        setLoading(false)
      }
    }, 250)

    return () => clearTimeout(timer)
  }, [query])

  if (!open) return null

  const handleFullSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      onClose()
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-modal-card" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleFullSearch} className="search-input-wrap">
          <svg
            className="search-icon"
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
          <input
            ref={inputRef}
            type="text"
            placeholder="Search products, collections, styles..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setQuery('')}
              aria-label="Clear query"
            >
              <X size={14} />
            </button>
          )}
          <button
            type="button"
            className="search-close-btn"
            onClick={onClose}
            aria-label="Close search"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </form>

        <div className="search-products-section">
          <div className="search-section-header">
            <h4 className="search-section-title">
              {query.trim() ? `Search Results for "${query}"` : 'Popular Recommendations'}
            </h4>
            {loading && <span className="search-loading-text">Searching...</span>}
          </div>

          {results.length > 0 ? (
            <>
              <div className="search-products-grid">
                {results.map((p) => (
                  <Link
                    key={p.slug}
                    to={`/products/${p.slug}`}
                    className="search-card"
                    onClick={onClose}
                  >
                    <div className="search-card-media">
                      {p.images && p.images[0] ? (
                        <img src={p.images[0]} alt={p.name} loading="lazy" />
                      ) : (
                        <div className="ph small">MIQRAAZ</div>
                      )}
                    </div>
                    <div className="search-card-info">
                      <div className="search-card-name">{p.name}</div>
                      <div className="search-card-price">{money(p.price)}</div>
                    </div>
                  </Link>
                ))}
              </div>
              {query.trim() && (
                <div className="search-view-all-wrap">
                  <button
                    type="button"
                    className="view-all-results-btn"
                    onClick={handleFullSearch}
                  >
                    View all matching results →
                  </button>
                </div>
              )}
            </>
          ) : (
            !loading && (
              <div className="search-no-results">
                No products found matching &ldquo;{query}&rdquo;.
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}

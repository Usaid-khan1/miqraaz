import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { productsAPI } from '../services/api.js'
import { Card } from '../components/Card.jsx'

export function SearchPage() {
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q') || ''

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    setLoading(true)

    if (q.trim()) {
      productsAPI
        .getAll({ search: q.trim(), limit: 40 })
        .then((res) => {
          if (isMounted) setProducts(res.products || [])
        })
        .catch(() => {
          if (isMounted) setProducts([])
        })
        .finally(() => {
          if (isMounted) setLoading(false)
        })
    } else {
      setProducts([])
      setLoading(false)
    }

    return () => {
      isMounted = false
    }
  }, [q])

  return (
    <div className="search-page-container">
      <div className="collection-header">
        <h1 className="collection-title">
          {q ? `Search Results for "${q}"` : 'Search Our Catalog'}
        </h1>
        <p className="muted">
          {products.length} {products.length === 1 ? 'product found' : 'products found'}
        </p>
      </div>

      <div className="collection-products-wrap">
        {loading ? (
          <div className="products-grid grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton-card" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="products-grid grid-cols-4">
            {products.map((p) => (
              <Card key={p._id || p.slug} p={p} />
            ))}
          </div>
        ) : (
          <div className="no-products-msg">
            <p>We could not find any products matching &ldquo;{q}&rdquo;.</p>
            <Link to="/collections/all" className="btn">
              Explore All Products
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

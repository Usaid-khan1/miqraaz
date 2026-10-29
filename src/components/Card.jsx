import { useState } from 'react'
import { Link } from 'react-router-dom'
import { money, formatImageUrl } from '../data.js'
import { useCart } from '../context/CartContext.jsx'

export function Card({ p }) {
  const [hover, setHover] = useState(false)
  const { add } = useCart()

  if (!p) return null

  const images = Array.isArray(p.images)
    ? p.images.map(formatImageUrl).filter(Boolean)
    : []
  const img = hover && images[1] ? images[1] : images[0]
  const isSoldOut = (p.totalStock ?? 0) <= 0 || p.soldOut

  return (
    <div className="card-item">
      <Link
        to={`/products/${p.slug}`}
        className="card"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className="card-media">
          {img ? (
            <img src={img} alt={p.name} loading="lazy" />
          ) : (
            <div className="ph">Miqraaz</div>
          )}
          {isSoldOut && <span className="tag">Sold out</span>}
          {!isSoldOut && (
            <button
              className="quick-add-btn"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                // Default to first available size or M
                const availableSize = p.sizes?.find((s) => s.stock > 0)?.size || 'M'
                add(p, availableSize, 1)
              }}
              title="Add to cart"
              aria-label="Add to cart"
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
                <rect x="5" y="7.5" width="14" height="13.5" rx="1.5" />
                <path d="M8.5 7.5V5a3.5 3.5 0 0 1 7 0v2.5" />
                <line x1="12" y1="11" x2="12" y2="17" />
                <line x1="9" y1="14" x2="15" y2="14" />
              </svg>
            </button>
          )}
        </div>
        <div className="card-meta">
          <h3>{p.name}</h3>
          <div className="price-row">
            {p.salePrice ? (
              <>
                <span className="sale-price">{money(p.salePrice)}</span>
                <span className="orig-price">{money(p.price)}</span>
              </>
            ) : (
              <span>{money(p.price)}</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}

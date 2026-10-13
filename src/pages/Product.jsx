import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { money } from '../data.js'
import { useCart } from '../context/CartContext.jsx'
import { productsAPI } from '../services/api.js'
import { Card } from '../components/Card.jsx'

export function Product() {
  const { slug } = useParams()
  const { add } = useCart()

  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeImgIndex, setActiveImgIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState('M')
  const [qty, setQty] = useState(1)

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    setActiveImgIndex(0)
    setQty(1)

    productsAPI
      .getBySlugOrId(slug)
      .then((res) => {
        if (isMounted) {
          setProduct(res.product)
          setRelated(res.relatedProducts || [])
          // Set initial size to first available
          if (res.product?.sizes?.length) {
            const firstInStock = res.product.sizes.find((s) => s.stock > 0)
            setSelectedSize(firstInStock ? firstInStock.size : res.product.sizes[0].size)
          }
        }
      })
      .catch((err) => {
        console.warn('Product load error:', err)
        if (isMounted) setProduct(null)
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [slug])

  if (loading) {
    return (
      <section className="section pdp pdp-loading">
        <div className="skeleton-media" />
        <div className="skeleton-info">
          <div className="skeleton-line lg" />
          <div className="skeleton-line sm" />
          <div className="skeleton-line md" />
        </div>
      </section>
    )
  }

  if (!product) {
    return (
      <section className="section center pdp-not-found">
        <h1>Product Not Found</h1>
        <p className="muted">The product you are looking for may have been removed or archived.</p>
        <Link className="btn" to="/collections/all">
          Explore All Products
        </Link>
      </section>
    )
  }

  const images = Array.isArray(product.images) && product.images.length > 0 ? product.images : []
  const currentSizeObj = product.sizes?.find((s) => s.size === selectedSize)
  const currentStock = currentSizeObj ? currentSizeObj.stock : (product.totalStock ?? 0)
  const isSoldOut = (product.totalStock ?? 0) <= 0 || currentStock <= 0

  const handleAddToCart = () => {
    if (!isSoldOut) {
      add(product, selectedSize, qty)
    }
  }

  return (
    <>
      <section className="section pdp">
        {/* Left Gallery */}
        <div className="pdp-gallery">
          {images.length > 0 ? (
            <>
              <div className="pdp-main-wrap">
                <img
                  className="pdp-main"
                  src={images[activeImgIndex] || images[0]}
                  alt={product.name}
                />
              </div>
              {images.length > 1 && (
                <div className="thumbs">
                  {images.map((im, i) => (
                    <img
                      key={i}
                      src={im}
                      onClick={() => setActiveImgIndex(i)}
                      className={i === activeImgIndex ? 'on' : ''}
                      alt={`Thumbnail ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="ph big">KESHK</div>
          )}
        </div>

        {/* Right Info */}
        <div className="pdp-info">
          <div className="pdp-category-badge">
            {product.category?.name || product.collectionSlug?.toUpperCase()}
          </div>
          <h1>{product.name}</h1>

          <div className="pdp-price-row">
            {product.salePrice && product.salePrice < product.price ? (
              <>
                <span className="price-sale lg">{money(product.salePrice)}</span>
                <span className="price-original lg">{money(product.price)}</span>
                <span className="discount-tag">
                  {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
                </span>
              </>
            ) : (
              <span className="price lg">{money(product.price)}</span>
            )}
          </div>

          <p className="muted pdp-shipping-note">
            Taxes included. Shipping calculated at checkout.
          </p>

          {/* Size Selector */}
          <div className="pdp-section-wrap">
            <div className="size-label-row">
              <span className="label">Size</span>
              <span className="stock-hint">
                {currentStock > 0
                  ? currentStock <= 5
                    ? `Only ${currentStock} left in stock`
                    : 'In stock'
                  : 'Sold out'}
              </span>
            </div>
            <div className="sizes">
              {product.sizes?.map((s) => {
                const disabled = s.stock <= 0
                return (
                  <button
                    key={s.size}
                    type="button"
                    className={`${s.size === selectedSize ? 'on' : ''} ${disabled ? 'disabled-size' : ''}`}
                    onClick={() => setSelectedSize(s.size)}
                  >
                    {s.size}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="pdp-section-wrap">
            <span className="label">Quantity</span>
            <div className="pdp-qty-row">
              <div className="pdp-qty-stepper">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={qty <= 1 || isSoldOut}
                >
                  −
                </button>
                <span>{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.min(currentStock, q + 1))}
                  disabled={qty >= currentStock || isSoldOut}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            type="button"
            className="btn full pdp-add-btn"
            disabled={isSoldOut}
            onClick={handleAddToCart}
          >
            {isSoldOut ? 'Sold Out' : 'Add to Cart'}
          </button>

          {/* Product Details & Specs */}
          <div className="pdp-details-block">
            <h4>Description</h4>
            <p className="desc">{product.description}</p>
            {product.sku && <div className="sku-info">SKU: {product.sku}</div>}
          </div>
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="section related-section">
          <div className="section-head-split">
            <h2>You May Also Like</h2>
            <Link to={`/collections/${product.collectionSlug}`} className="view-all-link">
              View Collection →
            </Link>
          </div>
          <div className="grid">
            {related.map((rp) => (
              <Card key={rp._id || rp.slug} p={rp} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}

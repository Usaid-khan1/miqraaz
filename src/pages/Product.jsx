import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { money, formatImageUrl } from '../data.js'
import { useCart } from '../context/CartContext.jsx'
import { productsAPI } from '../services/api.js'
import { PageLoader } from '../components/PageLoader.jsx'
import { Card } from '../components/Card.jsx'
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react'

export function Product() {
  const { slug } = useParams()
  const { add } = useCart()

  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeImgIndex, setActiveImgIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState('M')
  const [qty, setQty] = useState(1)
  const [showSizeChart, setShowSizeChart] = useState(false)

  // Lightbox Zoom Viewer state
  const [zoomOpen, setZoomOpen] = useState(false)
  const [zoomScale, setZoomScale] = useState(1)

  // Mobile Touch Swipe Handling
  const touchStartXRef = useRef(null)
  const touchEndXRef = useRef(null)

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

  // Manage body scroll lock during Zoom modal
  useEffect(() => {
    if (zoomOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      setZoomScale(1)
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [zoomOpen])

  // Escape key listener for modals
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (zoomOpen) setZoomOpen(false)
        if (showSizeChart) setShowSizeChart(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [zoomOpen, showSizeChart])

  if (loading) {
    return <PageLoader text="LOADING PRODUCT" />
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

  const images = Array.isArray(product.images)
    ? product.images.map(formatImageUrl).filter(Boolean)
    : []
  const currentSizeObj = product.sizes?.find((s) => s.size === selectedSize)
  const currentStock = currentSizeObj ? currentSizeObj.stock : (product.totalStock ?? 0)
  const isSoldOut = (product.totalStock ?? 0) <= 0 || currentStock <= 0

  const handlePrevImage = (e) => {
    if (e) e.stopPropagation()
    setActiveImgIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
  }

  const handleNextImage = (e) => {
    if (e) e.stopPropagation()
    setActiveImgIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
  }

  const handleTouchStart = (e) => {
    touchStartXRef.current = e.targetTouches[0].clientX
    touchEndXRef.current = null
  }

  const handleTouchMove = (e) => {
    touchEndXRef.current = e.targetTouches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!touchStartXRef.current || !touchEndXRef.current) return
    const diff = touchStartXRef.current - touchEndXRef.current
    if (diff > 40) {
      // Swiped Left -> Next Image
      handleNextImage()
    } else if (diff < -40) {
      // Swiped Right -> Previous Image
      handlePrevImage()
    }
    touchStartXRef.current = null
    touchEndXRef.current = null
  }

  const handleAddToCart = () => {
    if (!isSoldOut) {
      add(product, selectedSize, qty)
    }
  }

  return (
    <>
      <section className="section pdp">
        {/* Left Gallery & Carousel */}
        <div className="pdp-gallery">
          {images.length > 0 ? (
            <>
              <div
                className="pdp-main-wrap"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onClick={() => setZoomOpen(true)}
                title="Click to zoom image"
              >
                <img
                  className="pdp-main"
                  src={images[activeImgIndex] || images[0]}
                  alt={product.name}
                  loading="eager"
                />

                {/* Slider Navigation Arrows (shown if multiple images) */}
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="pdp-carousel-arrow pdp-carousel-prev"
                      onClick={handlePrevImage}
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      type="button"
                      className="pdp-carousel-arrow pdp-carousel-next"
                      onClick={handleNextImage}
                      aria-label="Next image"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}

                {/* Zoom Affordance Pill */}
                <div className="pdp-zoom-badge">
                  <ZoomIn size={14} />
                  <span>Click to zoom</span>
                </div>

                {/* Mobile Active Dots Indicator */}
                {images.length > 1 && (
                  <div className="pdp-carousel-dots" onClick={(e) => e.stopPropagation()}>
                    {images.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        className={`pdp-carousel-dot ${i === activeImgIndex ? 'active' : ''}`}
                        onClick={() => setActiveImgIndex(i)}
                        aria-label={`Go to image ${i + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Thumbnails Navigation */}
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
            <div className="ph big">MIQRAAZ</div>
          )}
        </div>

        {/* Right Info */}
        <div className="pdp-info">
          {product.category?.name || product.collectionSlug ? (
            <div className="pdp-category-badge">
              {product.category?.name || product.collectionSlug}
            </div>
          ) : null}

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

          {/* Model Information (Part 8: directly below price, above size selector) */}
          {(product.modelHeight || product.modelWearingSize) && (
            <div className="pdp-model-specs-card">
              <span className="pdp-model-icon">📏</span>
              <div className="pdp-model-text">
                {product.modelHeight && (
                  <span>
                    Model Height: <strong>{product.modelHeight}</strong>
                  </span>
                )}
                {product.modelHeight && product.modelWearingSize && (
                  <span className="pdp-model-bullet">&bull;</span>
                )}
                {product.modelWearingSize && (
                  <span>
                    Wearing Size: <strong>{product.modelWearingSize}</strong>
                  </span>
                )}
              </div>
            </div>
          )}

          <p className="muted pdp-shipping-note">
            Taxes included. Shipping calculated at checkout.
          </p>

          {/* Size Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="pdp-section-wrap">
              <div className="size-label-row">
                <div className="size-label-left">
                  <span className="label">SIZE</span>
                  {product.sizeChart && (
                    <button
                      type="button"
                      className="pdp-size-guide-btn"
                      onClick={() => setShowSizeChart(true)}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21.3 15.3l-6.6-6.6a2 2 0 0 0-2.8 0L2.7 17.9a2 2 0 0 0 0 2.8l3.6 3.6a2 2 0 0 0 2.8 0l9.2-9.2a2 2 0 0 0 0-2.8z"/>
                        <path d="M8 14l2-2"/>
                        <path d="M12 10l2-2"/>
                        <path d="M16 6l2-2"/>
                      </svg>
                      <span>Size Guide</span>
                    </button>
                  )}
                </div>
                <span className="stock-hint">
                  {currentStock > 0
                    ? currentStock <= 5
                      ? `Only ${currentStock} left in stock`
                      : 'In stock'
                    : 'Sold out'}
                </span>
              </div>
              <div className="sizes">
                {product.sizes.map((s) => {
                  const disabled = s.stock <= 0
                  return (
                    <button
                      key={s.size}
                      type="button"
                      disabled={disabled}
                      className={`${s.size === selectedSize ? 'on' : ''} ${disabled ? 'disabled-size' : ''}`}
                      onClick={() => {
                        setSelectedSize(s.size)
                        if (qty > s.stock && s.stock > 0) {
                          setQty(s.stock)
                        }
                      }}
                    >
                      {s.size}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="pdp-section-wrap">
            <span className="label">QUANTITY</span>
            <div className="pdp-qty-row">
              <div className="pdp-qty-stepper">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={qty <= 1 || isSoldOut}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span>{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.min(currentStock, q + 1))}
                  disabled={qty >= currentStock || isSoldOut}
                  aria-label="Increase quantity"
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

          {/* Product Details & Formatted Description (Part 6) */}
          {(product.description || product.sku) && (
            <div className="pdp-details-block">
              {product.description && (
                <>
                  <h4>Description</h4>
                  <div className="pdp-formatted-description">
                    {product.description}
                  </div>
                </>
              )}
              {product.sku && <div className="sku-info">SKU: {product.sku}</div>}
            </div>
          )}

          {/* Composition & Care Section (Part 9: directly below description) */}
          {((product.composition && product.composition.length > 0) ||
            (product.careInstructions && product.careInstructions.length > 0)) && (
            <div className="pdp-composition-care-block">
              <h4 className="pdp-section-heading">Composition &amp; Care</h4>

              {product.composition && product.composition.length > 0 && (
                <div className="pdp-spec-box">
                  <h5 className="pdp-spec-title">Composition</h5>
                  <ul className="pdp-spec-list">
                    {product.composition.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {product.careInstructions && product.careInstructions.length > 0 && (
                <div className="pdp-spec-box">
                  <h5 className="pdp-spec-title">Care Instructions</h5>
                  <ul className="pdp-spec-list">
                    {product.careInstructions.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="section related-section">
          <div className="section-head-split">
            <h2>You May Also Like</h2>
            {product.collectionSlug && (
              <Link to={`/collections/${product.collectionSlug}`} className="view-all-link">
                View Collection →
              </Link>
            )}
          </div>
          <div className="grid">
            {related.map((rp) => (
              <Card key={rp._id || rp.slug} p={rp} />
            ))}
          </div>
        </section>
      )}

      {/* Fullscreen Lightbox Zoom Modal (Part 7: Android layout stable, iPhone preserved) */}
      {zoomOpen && (
        <div
          className="pdp-lightbox-overlay"
          onClick={() => setZoomOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="pdp-lightbox-toolbar" onClick={(e) => e.stopPropagation()}>
            <span className="pdp-lightbox-counter">
              {activeImgIndex + 1} / {images.length}
            </span>
            <div className="pdp-lightbox-actions">
              <button
                type="button"
                className="pdp-lightbox-btn"
                onClick={() => setZoomScale((s) => (s >= 2 ? 1 : s + 0.5))}
                title={zoomScale > 1 ? 'Zoom out' : 'Zoom in'}
                aria-label="Toggle zoom scale"
              >
                {zoomScale > 1 ? <ZoomOut size={18} /> : <ZoomIn size={18} />}
              </button>
              <button
                type="button"
                className="pdp-lightbox-btn pdp-lightbox-close"
                onClick={() => setZoomOpen(false)}
                title="Close lightbox (Esc)"
                aria-label="Close lightbox"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div
            className="pdp-lightbox-stage"
            onClick={(e) => {
              e.stopPropagation()
              setZoomScale((s) => (s > 1 ? 1 : 2))
            }}
          >
            <img
              src={images[activeImgIndex] || images[0]}
              alt={`${product.name} - Zoom View`}
              className="pdp-lightbox-img"
              style={{
                transform: `scale(${zoomScale})`,
                cursor: zoomScale > 1 ? 'zoom-out' : 'zoom-in',
              }}
            />
          </div>

          {images.length > 1 && (
            <>
              <button
                type="button"
                className="pdp-lightbox-nav pdp-lightbox-prev"
                onClick={(e) => {
                  e.stopPropagation()
                  handlePrevImage()
                  setZoomScale(1)
                }}
                aria-label="Previous image"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                type="button"
                className="pdp-lightbox-nav pdp-lightbox-next"
                onClick={(e) => {
                  e.stopPropagation()
                  handleNextImage()
                  setZoomScale(1)
                }}
                aria-label="Next image"
              >
                <ChevronRight size={28} />
              </button>
            </>
          )}
        </div>
      )}

      {/* Size Chart Modal */}
      {showSizeChart && product?.sizeChart && (
        <div className="size-chart-modal-overlay" onClick={() => setShowSizeChart(false)}>
          <div className="size-chart-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="size-chart-modal-header">
              <div>
                <h3 className="size-chart-modal-title">Size Guide — {product.name}</h3>
                <p className="size-chart-modal-subtitle">All measurements are provided in inches</p>
              </div>
              <button
                type="button"
                className="size-chart-close-btn"
                onClick={() => setShowSizeChart(false)}
                aria-label="Close size guide"
              >
                <X size={20} />
              </button>
            </div>
            <div className="size-chart-modal-body">
              <img
                src={formatImageUrl(product.sizeChart)}
                alt={`Size Guide for ${product.name}`}
                className="size-chart-full-img"
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

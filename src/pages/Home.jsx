import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../components/Card.jsx'
import { PageLoader } from '../components/PageLoader.jsx'
import { formatImageUrl } from '../data.js'
import { productsAPI, categoriesAPI, settingsAPI } from '../services/api.js'

function ProductSlider({ items = [] }) {
  const trackRef = useRef(null)

  const handleScroll = (dir) => {
    if (trackRef.current) {
      const scrollAmount = dir === 'left' ? -320 : 320
      trackRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  if (!items.length) return null

  return (
    <div className="slider-container">
      <button
        className="slider-arrow left"
        onClick={() => handleScroll('left')}
        aria-label="Previous products"
      >
        ‹
      </button>
      <div className="slider-track" ref={trackRef}>
        {items.map((p) => (
          <div key={p.slug} className="slider-card-wrap">
            <Card p={p} />
          </div>
        ))}
      </div>
      <button
        className="slider-arrow right"
        onClick={() => handleScroll('right')}
        aria-label="Next products"
      >
        ›
      </button>
    </div>
  )
}

export function Home() {
  const [sliderProducts, setSliderProducts] = useState([])
  const [exploreProducts, setExploreProducts] = useState([])
  const [chapters, setChapters] = useState([])
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadHomeData = async () => {
      try {
        const [catsRes, settingsRes, exploreRes] = await Promise.all([
          categoriesAPI.getAll().catch(() => ({ categories: [] })),
          settingsAPI.get().catch(() => null),
          productsAPI.getAll({ limit: 8 }).catch(() => ({ products: [] })),
        ])

        const allCats = catsRes?.categories || []
        const currentSettings = settingsRes?.settings || {}

        // Determine slider collection from settings heroButtonLink or vol-01
        let sliderCollectionSlug = 'vol-01'
        if (currentSettings.heroButtonLink && currentSettings.heroButtonLink.includes('/collections/')) {
          sliderCollectionSlug = currentSettings.heroButtonLink.split('/collections/')[1]?.replace(/\/$/, '')
        }

        let sliderItems = []
        if (sliderCollectionSlug && sliderCollectionSlug !== 'all') {
          const sliderRes = await productsAPI
            .getAll({ collection: sliderCollectionSlug, limit: 16 })
            .catch(() => ({ products: [] }))
          sliderItems = sliderRes?.products || []
        }

        if (sliderItems.length === 0) {
          const featuredRes = await productsAPI.getFeatured().catch(() => ({ products: [] }))
          sliderItems = featuredRes?.products || []
        }

        if (isMounted) {
          setSliderProducts(sliderItems)
          setExploreProducts(exploreRes?.products || [])
          // All chapters remain in bottom chapters grid independently of hero
          setChapters(allCats)
          if (settingsRes?.settings) setSettings(settingsRes.settings)
        }
      } catch (err) {
        console.warn('Failed to load home page data:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadHomeData()
    return () => {
      isMounted = false
    }
  }, [])

  if (loading) {
    return <PageLoader text="LOADING MIQRAAZ" />
  }

  // Hero section is controlled by Admin Settings
  const heroImageSrc =
    settings?.heroImage ||
    'https://res.cloudinary.com/c7rxy1co/image/upload/v1793818783/miqraaz/mbxziae2wzmudyoyjfc2.avif'

  const heroBg = `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.45)), url(${formatImageUrl(heroImageSrc)})`

  const heroKicker = settings?.heroKicker || 'NEW CHAPTER'
  const heroTitle = settings?.heroTitle || settings?.storeName || 'DASTAK'
  const heroDesc = settings?.heroDescription || settings?.tagline || 'A knock before an arrival.'
  const heroBtnText = settings?.heroButtonText || 'SHOP NOW'
  const heroLink = settings?.heroButtonLink || '/collections/vol-01'
  const sliderSectionTitle = settings?.sliderTitle || 'DASTAK - VOL 01'

  return (
    <>
      {/* 1. Dynamic Hero Section Controlled by Admin Settings */}
      <section
        className="hero"
        style={{
          backgroundImage: heroBg,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="hero-center-box">
          <div className="hero-kicker">{heroKicker}</div>
          <h1 className="hero-title">{heroTitle}</h1>
          {heroDesc && <p className="hero-desc">{heroDesc}</p>}
          <Link className="hero-btn" to={heroLink}>
            {heroBtnText}
          </Link>
        </div>
      </section>

      {/* 2. Dynamic Marquee Bar */}
      {settings?.announcementText && (
        <div className="marquee-bar">
          <div className="marquee-track">
            <div className="marquee-content">
              <span>{settings.announcementText}</span>
              <span>{settings.announcementText}</span>
              <span>{settings.announcementText}</span>
            </div>
            <div className="marquee-content" aria-hidden="true">
              <span>{settings.announcementText}</span>
              <span>{settings.announcementText}</span>
              <span>{settings.announcementText}</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Dynamic Horizontal Product Slider */}
      {sliderProducts.length > 0 && (
        <section className="section product-slider-section">
          <div className="slider-section-head">
            <h2 className="slider-section-title">{sliderSectionTitle}</h2>
          </div>
          <ProductSlider items={sliderProducts} />
        </section>
      )}

      {/* 4. Explore All Section */}
      <section className="section">
        <div className="section-head-split">
          <h2>Explore All</h2>
          <Link className="view-all-link" to="/collections/all">
            View all →
          </Link>
        </div>
        {exploreProducts.length > 0 ? (
          <div className="grid">
            {exploreProducts.map((p) => (
              <Card key={p._id || p.slug} p={p} />
            ))}
          </div>
        ) : (
          <div className="empty-state-box">
            <p>Catalog is currently empty.</p>
          </div>
        )}
      </section>

      {/* 5. Chapters Section (Directly above Footer) */}
      {chapters.length > 0 && (
        <section className="section chapters-section">
          <div className="chapter-grid-2col">
            {chapters.map((c) => (
              <Link
                key={c._id || c.slug}
                to={`/collections/${c.slug}`}
                className="chapter-card-large"
              >
                <div className="chapter-media">
                  {c.image ? (
                    <img src={formatImageUrl(c.image)} alt={c.name} loading="lazy" />
                  ) : (
                    <div className="ph chapter-ph">{c.name}</div>
                  )}
                </div>
                <div className="chapter-overlay">
                  <h3 className="chapter-card-title">{c.name}</h3>
                  <span className="chapter-card-shop">Shop now</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  )
}

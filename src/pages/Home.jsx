import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { HERO_BANNER_IMG } from '../data.js'
import { Card } from '../components/Card.jsx'
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
        const [sliderRes, exploreRes, catsRes, settingsRes] = await Promise.all([
          productsAPI.getAll({ collection: 'rang-xii', limit: 8 }),
          productsAPI.getAll({ limit: 4 }),
          categoriesAPI.getAll(),
          settingsAPI.get().catch(() => null),
        ])

        if (isMounted) {
          setSliderProducts(sliderRes.products || [])
          setExploreProducts(exploreRes.products || [])
          setChapters((catsRes.categories || []).filter((c) => c.slug !== 'rang-xii'))
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

  return (
    <>
      {/* 1. Hero Section */}
      <section
        className="hero"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.25)), url(${HERO_BANNER_IMG})`,
        }}
      >
        <div className="hero-center-box">
          <div className="hero-kicker">NEW CHAPTER</div>
          <h1 className="hero-title">RANG XII</h1>
          <p className="hero-desc">
            {settings?.tagline ||
              'RANG is about wearing something that feels personal, where every color holds meaning and every detail has a story worth carrying.'}
          </p>
          <Link className="hero-btn" to="/collections/rang-xii">
            SHOP NOW
          </Link>
        </div>
      </section>

      {/* 2. Marquee Ticker */}
      <div className="marquee-bar">
        <div className="marquee-track">
          <div className="marquee-content">
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
          </div>
        </div>
      </div>

      {/* 3. Horizontal Product Slider for RANG XII */}
      <section className="section product-slider-section">
        {loading ? (
          <div className="loading-grid">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton-card" />
            ))}
          </div>
        ) : (
          sliderProducts.length > 0 && <ProductSlider items={sliderProducts} />
        )}
      </section>

      {/* 4. Explore All Section */}
      <section className="section">
        <div className="section-head-split">
          <h2>Explore All</h2>
          <Link className="view-all-link" to="/collections/all">
            View all →
          </Link>
        </div>
        {loading ? (
          <div className="grid">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton-card" />
            ))}
          </div>
        ) : exploreProducts.length > 0 ? (
          <div className="grid">
            {exploreProducts.map((p) => (
              <Card key={p.slug} p={p} />
            ))}
          </div>
        ) : (
          <div className="empty-state-box">
            <p>Catalog is currently being updated. Check back shortly!</p>
          </div>
        )}
      </section>

      {/* 5. Chapters of Expression */}
      <section className="section chapters-section">
        <div className="section-head">
          <h2>Chapters of Expression</h2>
          <p>Each collection is a chapter.</p>
          <p>Each chapter explores a different idea.</p>
        </div>
        <div className="chapter-grid-2col">
          {chapters.map((c) => (
            <Link
              key={c.slug}
              to={`/collections/${c.slug}`}
              className="chapter-card-large"
            >
              <div className="chapter-media">
                {c.image ? (
                  <img src={c.image} alt={c.name} loading="lazy" />
                ) : (
                  <div className="ph chapter-ph">{c.name}</div>
                )}
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

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { LOGO_BLACK } from '../data.js'
import { settingsAPI } from '../services/api.js'

export function Footer() {
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    settingsAPI
      .get()
      .then((res) => {
        if (res?.settings) setSettings(res.settings)
      })
      .catch(() => {})
  }, [])

  const storeName = settings?.storeName || 'MIQRAAZ'
  const tagline = settings?.tagline || ''

  const instagramUrl = 'https://www.instagram.com/miqraaz.official?srtk=aDJ3NDk5c3cwZXVr'
  const facebookUrl = 'https://www.facebook.com/share/1F8Kgzwh3S/'
  const whatsappUrl = 'https://wa.me/923397837586'
  const displayPhone = '0339 7837586'

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-col-brand">
          <img src={LOGO_BLACK} alt="مِقْرَاض" className="flogo" />
          {tagline && <p className="footer-tagline">{tagline}</p>}
          {settings?.address && <p className="footer-address">{settings.address}</p>}
        </div>

        <div>
          <h4>Company</h4>
          <Link to="/pages/about-miqraaz">About Us</Link>
          <Link to="/pages/contact">Contact Us</Link>
        </div>

        <div>
          <h4>Policies</h4>
          <Link to="/pages/return-exchange-policy">Return &amp; Exchange Policy</Link>
          <Link to="/pages/shipping-policy">Shipping Policy</Link>
          <Link to="/policies/privacy-policy">Privacy Policy</Link>
          <Link to="/policies/terms-of-service">Terms of Service</Link>
        </div>

        <div className="footer-col-social">
          <h4>Connect With Us</h4>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-social-link"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            <span>Instagram ↗</span>
          </a>

          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-social-link"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
            <span>Facebook ↗</span>
          </a>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-social-link footer-whatsapp-link"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.41a8.188 8.188 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.47c-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.08s.89 2.41 1.01 2.58c.13.17 1.75 2.67 4.24 3.75.59.26 1.05.41 1.41.53.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.12-.23-.19-.48-.31z" />
            </svg>
            <span>WhatsApp: {displayPhone} ↗</span>
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 <Link to="/">{storeName}</Link>. All Rights Reserved.</span>
      </div>
    </footer>
  )
}

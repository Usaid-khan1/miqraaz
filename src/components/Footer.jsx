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

  return (
    <footer className="footer">
      <div className="footer-top">
        <div>
          <img src={LOGO_BLACK} alt="مِقْرَاض" className="flogo" />
          {tagline && <p>{tagline}</p>}
          {settings?.address && <p>{settings.address}</p>}
          <a
            href="https://www.instagram.com/miqraaz.official/"
            target="_blank"
            rel="noreferrer"
            className="instagram-link"
          >
            Instagram ↗
          </a>
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
      </div>
      <div className="footer-bottom">
        <span>© 2026 <Link to="/">{storeName}</Link>. All Rights Reserved.</span>
      </div>
    </footer>
  )
}

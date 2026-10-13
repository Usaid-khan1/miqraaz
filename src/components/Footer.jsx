import { Link } from 'react-router-dom'
import { LOGO_BLACK } from '../data.js'

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div>
          <img src={LOGO_BLACK} alt="مِقْرَاض" className="flogo" />
          <p>Unisex fashion with traditional and street fusion.</p>
          <p>EST. in Lyari</p>
          <a
            href="https://www.instagram.com/keshk.official/"
            target="_blank"
            rel="noreferrer"
            className="instagram-link"
          >
            Instagram ↗
          </a>
        </div>
        <div>
          <h4>Company</h4>
          <Link to="/pages/about-keshk">About Us</Link>
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
        <span>© 2026 <Link to="/">Keshk / Miqraaz</Link>. All Rights Reserved.</span>
      </div>
    </footer>
  )
}

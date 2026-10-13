import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <section className="section center narrow not-found-page">
      <div className="not-found-number">404</div>
      <h1 className="page-title">Page Not Found</h1>
      <p className="muted" style={{ marginBottom: '24px' }}>
        The page you are looking for may have been moved, deleted, or does not exist.
      </p>
      <Link to="/" className="btn">
        Return to Home
      </Link>
    </section>
  )
}

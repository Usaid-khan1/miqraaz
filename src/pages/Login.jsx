import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get('redirect') || '/account'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await login(email, password)
      if (user.role === 'admin' && redirect === '/account') {
        navigate('/admin')
      } else {
        navigate(redirect)
      }
    } catch {
      // Error handled by AuthContext toast
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <h1 className="auth-title">Sign In</h1>
        <p className="auth-subtitle">
          Enter your email and password to access your account.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field-group">
            <label>Email Address</label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="field-group">
            <div className="label-with-link">
              <label>Password</label>
              <Link to="/forgot-password" className="forgot-password-link">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="btn full auth-submit-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-card-footer">
          Don&apos;t have an account yet?{' '}
          <Link
            to={redirect ? `/register?redirect=${encodeURIComponent(redirect)}` : '/register'}
            className="auth-switch-link"
          >
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  )
}

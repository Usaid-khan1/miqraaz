import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { GoogleSignInButton } from '../components/GoogleSignInButton.jsx'

export function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    passwordConfirm: '',
  })
  const [loading, setLoading] = useState(false)

  const { register } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get('redirect') || '/account'

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.passwordConfirm) {
      showToast('Passwords do not match', 'error')
      return
    }

    if (formData.password.length < 6) {
      showToast('Password must be at least 6 characters long', 'error')
      return
    }

    setLoading(true)
    try {
      await register(formData)
      navigate(redirect)
    } catch {
      // Error handled by AuthContext toast
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">
          Sign up to track your orders, save shipping addresses, and unlock exclusive offers.
        </p>

        <GoogleSignInButton redirect={redirect} text="Sign up with Google" />

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. Usaid Khan"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="field-group">
            <label>Email Address *</label>
            <input
              type="email"
              name="email"
              required
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>

          <div className="field-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              placeholder="0300 1234567"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="field-group">
            <label>Password (Min. 6 characters) *</label>
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
          </div>

          <div className="field-group">
            <label>Confirm Password *</label>
            <input
              type="password"
              name="passwordConfirm"
              required
              placeholder="••••••••"
              value={formData.passwordConfirm}
              onChange={handleChange}
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="btn full auth-submit-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-card-footer">
          Already have an account?{' '}
          <Link
            to={redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : '/login'}
            className="auth-switch-link"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { authAPI } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

export function ResetPassword() {
  const { token } = useParams()
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [loading, setLoading] = useState(false)

  const { refreshUser } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password !== passwordConfirm) {
      showToast('Passwords do not match', 'error')
      return
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters long', 'error')
      return
    }

    setLoading(true)
    try {
      const res = await authAPI.resetPassword(token, { password })
      localStorage.setItem('miqraaz_token', res.token)
      localStorage.setItem('miqraaz_user', JSON.stringify(res.user))
      await refreshUser()
      showToast('Password reset successful. You are now logged in.', 'success')
      navigate('/account')
    } catch (err) {
      showToast(err.message || 'Invalid or expired reset token', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <h1 className="auth-title">Set New Password</h1>
        <p className="auth-subtitle">
          Please enter and confirm your new secure password.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field-group">
            <label>New Password (Min. 6 characters)</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="field-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
          </div>

          <button type="submit" className="btn full auth-submit-btn" disabled={loading}>
            {loading ? 'Updating Password...' : 'Save New Password'}
          </button>
        </form>

        <div className="auth-card-footer">
          <Link to="/login" className="auth-switch-link">
            Return to Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}

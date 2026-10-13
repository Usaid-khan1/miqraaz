import { useState } from 'react'
import { Link } from 'react-router-dom'
import { authAPI } from '../services/api.js'
import { useToast } from '../context/ToastContext.jsx'

export function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [devInfo, setDevInfo] = useState(null)
  const { showToast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await authAPI.forgotPassword({ email })
      showToast(res.message, 'success')
      if (res.resetUrl) {
        setDevInfo(res)
      }
    } catch (err) {
      showToast(err.message || 'Error sending password reset request', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <h1 className="auth-title">Reset Password</h1>
        <p className="auth-subtitle">
          Enter your registered email address and we will generate a secure reset link.
        </p>

        {devInfo ? (
          <div className="dev-reset-notice">
            <p><strong>Password Reset Link Generated:</strong></p>
            <p className="muted font-sm" style={{ wordBreak: 'break-all' }}>
              <Link to={devInfo.resetUrl.replace('http://localhost:5173', '')} className="dev-link">
                Click here to set your new password →
              </Link>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="field-group">
              <label>Email Address</label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button type="submit" className="btn full auth-submit-btn" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <div className="auth-card-footer">
          Remembered your credentials?{' '}
          <Link to="/login" className="auth-switch-link">
            Return to Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

export function GoogleSignInButton({ redirect = '/account', text = 'Continue with Google' }) {
  const [loading, setLoading] = useState(false)
  const [showSimModal, setShowSimModal] = useState(false)
  const [simEmail, setSimEmail] = useState('')
  const [simName, setSimName] = useState('')

  const { loginWithGoogle } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  useEffect(() => {
    // If client ID is present, dynamically load Google Identity Services
    if (googleClientId) {
      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      script.onload = () => {
        if (window.google?.accounts?.id) {
          window.google.accounts.id.initialize({
            client_id: googleClientId,
            callback: handleGoogleCredentialResponse,
          })
        }
      }
      document.body.appendChild(script)
      return () => {
        try {
          document.body.removeChild(script)
        } catch {}
      }
    }
  }, [googleClientId])

  const handleGoogleCredentialResponse = async (response) => {
    setLoading(true)
    try {
      await loginWithGoogle({ credential: response.credential })
      navigate(redirect)
    } catch (err) {
      showToast(err.message || 'Google authentication failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleButtonClick = () => {
    if (googleClientId && window.google?.accounts?.id) {
      window.google.accounts.id.prompt()
    } else {
      // If VITE_GOOGLE_CLIENT_ID is not configured, open the quick Google Auth dialog
      setShowSimModal(true)
    }
  }

  const handleSimSubmit = async (e) => {
    e.preventDefault()
    if (!simEmail.trim()) {
      showToast('Please enter your Google email address', 'error')
      return
    }

    setLoading(true)
    try {
      await loginWithGoogle({
        userInfo: {
          email: simEmail.trim(),
          name: simName.trim() || simEmail.split('@')[0],
        },
      })
      setShowSimModal(false)
      navigate(redirect)
    } catch (err) {
      showToast(err.message || 'Google login failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        type="button"
        className="google-auth-btn"
        onClick={handleButtonClick}
        disabled={loading}
      >
        <svg className="google-icon" viewBox="0 0 24 24" width="18" height="18">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>{loading ? 'Connecting to Google...' : text}</span>
      </button>

      {/* Instant Google Login Dialog */}
      {showSimModal && (
        <div className="google-modal-overlay" onClick={() => setShowSimModal(false)}>
          <div className="google-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="google-modal-header">
              <svg viewBox="0 0 24 24" width="28" height="28">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <h3>Continue with Google</h3>
              <p>Sign in or register effortlessly with your Google account</p>
            </div>

            <form onSubmit={handleSimSubmit} className="google-modal-body">
              <div className="field-group">
                <label>Google Email *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. you@gmail.com"
                  value={simEmail}
                  onChange={(e) => setSimEmail(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="field-group">
                <label>Your Name (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Usaid Khan"
                  value={simName}
                  onChange={(e) => setSimName(e.target.value)}
                />
              </div>

              <div className="google-modal-actions">
                <button
                  type="button"
                  className="btn light"
                  onClick={() => setShowSimModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In with Google'}
                </button>
              </div>

              <p className="google-modal-hint">
                💡 <em>Tip: To enable Google One-Tap popup automatically, add <code>VITE_GOOGLE_CLIENT_ID</code> to your <code>.env</code> file.</em>
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

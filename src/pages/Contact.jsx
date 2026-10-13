import { useState } from 'react'
import { contactAPI } from '../services/api.js'
import { useToast } from '../context/ToastContext.jsx'

export function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', comment: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await contactAPI.submit(form)
      setSent(true)
      showToast('Thank you! Your message has been received.', 'success')
    } catch (err) {
      showToast(err.message || 'Failed to send message', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="contact-page">
      <div className="contact-container">
        <h1 className="contact-title">Contact Us</h1>
        <p className="muted center" style={{ marginBottom: '32px' }}>
          Have an inquiry, custom sizing request, or feedback? Reach out to us.
        </p>

        {sent ? (
          <div className="contact-success">
            <p className="contact-success-title">Thank you for contacting us.</p>
            <p className="contact-success-desc">
              We have received your message and will get back to you as soon as possible.
            </p>
            <button
              type="button"
              className="contact-submit-btn"
              onClick={() => {
                setSent(false)
                setForm({ name: '', email: '', phone: '', comment: '' })
              }}
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-row-2">
              <input
                type="text"
                placeholder="Name *"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email *"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <input
              type="tel"
              placeholder="Phone (optional)"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <textarea
              placeholder="Message / Comments *"
              rows={6}
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              required
            />
            <button type="submit" className="contact-submit-btn" disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

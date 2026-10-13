import { useState, useEffect } from 'react'
import { settingsAPI } from '../services/api.js'
import { useToast } from '../context/ToastContext.jsx'

export function AdminSettings() {
  const [settings, setSettings] = useState({
    storeName: 'Keshk',
    brandNameUrdu: 'مِقْرَاض',
    tagline: '',
    contactEmail: '',
    contactPhone: '',
    currencySymbol: 'Rs.',
    currencyCode: 'PKR',
    standardShippingFee: 250,
    freeShippingThreshold: 8000,
    taxRatePercent: 0,
    codEnabled: true,
    address: '',
    announcementText: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    settingsAPI
      .get()
      .then((res) => {
        if (res.settings) setSettings(res.settings)
      })
      .catch((err) => showToast(err.message, 'error'))
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await settingsAPI.updateAdmin(settings)
      setSettings(res.settings)
      showToast('Store settings saved successfully', 'success')
    } catch (err) {
      showToast(err.message || 'Failed to save settings', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="admin-loading-spinner">Loading store settings...</div>
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Store Settings</h1>
          <p className="muted font-sm">Configure commerce parameters, shipping fees, contact details, and brand identity</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="admin-settings-form">
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Brand &amp; Identity</h3>
          </div>
          <div className="modal-body">
            <div className="form-row-2">
              <div className="field-group">
                <label>Store Brand Name</label>
                <input
                  type="text"
                  value={settings.storeName}
                  onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                  required
                />
              </div>
              <div className="field-group">
                <label>Urdu Calligraphy Mark</label>
                <input
                  type="text"
                  value={settings.brandNameUrdu}
                  onChange={(e) => setSettings({ ...settings, brandNameUrdu: e.target.value })}
                />
              </div>
            </div>

            <div className="field-group">
              <label>Brand Tagline</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              />
            </div>

            <div className="field-group">
              <label>Announcement Bar Ticker Text</label>
              <input
                type="text"
                value={settings.announcementText}
                onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="admin-card" style={{ marginTop: '24px' }}>
          <div className="admin-card-header">
            <h3>Shipping &amp; Commerce Rules</h3>
          </div>
          <div className="modal-body">
            <div className="form-row-3">
              <div className="field-group">
                <label>Standard Shipping Fee (PKR)</label>
                <input
                  type="number"
                  min={0}
                  value={settings.standardShippingFee}
                  onChange={(e) => setSettings({ ...settings, standardShippingFee: Number(e.target.value) })}
                  required
                />
              </div>
              <div className="field-group">
                <label>Free Shipping Minimum (PKR)</label>
                <input
                  type="number"
                  min={0}
                  value={settings.freeShippingThreshold}
                  onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
                  required
                />
              </div>
              <div className="field-group">
                <label>Tax Rate (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={settings.taxRatePercent}
                  onChange={(e) => setSettings({ ...settings, taxRatePercent: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="terms-check-wrap">
              <label className="filter-checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.codEnabled}
                  onChange={(e) => setSettings({ ...settings, codEnabled: e.target.checked })}
                />
                <span>Enable Cash on Delivery (COD) payment method</span>
              </label>
            </div>
          </div>
        </div>

        <div className="admin-card" style={{ marginTop: '24px' }}>
          <div className="admin-card-header">
            <h3>Contact Information</h3>
          </div>
          <div className="modal-body">
            <div className="form-row-2">
              <div className="field-group">
                <label>Support Email Address</label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  required
                />
              </div>
              <div className="field-group">
                <label>Support Phone / WhatsApp</label>
                <input
                  type="text"
                  value={settings.contactPhone}
                  onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="field-group">
              <label>Studio / Physical Address</label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              />
            </div>

            <div style={{ marginTop: '24px' }}>
              <button type="submit" className="btn" disabled={saving}>
                {saving ? 'Saving...' : 'Save All Settings'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

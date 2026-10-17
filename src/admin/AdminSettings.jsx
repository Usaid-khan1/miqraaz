import { useState, useEffect } from 'react'
import {
  Save,
  Store,
  Truck,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
} from 'lucide-react'
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
      showToast('Storefront parameters saved successfully', 'success')
    } catch (err) {
      showToast(err.message || 'Failed to save settings', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="admin-loading-spinner-wrap">
        <div className="admin-spinner-ring" />
        <span>Loading store settings...</span>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Store Configuration</h1>
          <p className="admin-page-subtitle">Configure commerce parameters, shipping fees, contact details, and brand identity</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="admin-settings-form">
        {/* Brand & Identity */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3>Brand &amp; Identity</h3>
              <p className="admin-card-subtitle">Public name, Urdu script mark, and announcement banner</p>
            </div>
          </div>
          <div className="admin-card-body">
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
                  placeholder="مِقْرَاض"
                />
              </div>
            </div>

            <div className="field-group" style={{ marginTop: '14px' }}>
              <label>Brand Tagline</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                placeholder="Unisex fashion with traditional and street fusion. EST. in Lyari"
              />
            </div>

            <div className="field-group" style={{ marginTop: '14px' }}>
              <label>Top Announcement Bar Ticker</label>
              <input
                type="text"
                value={settings.announcementText}
                onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                placeholder="A LANGUAGE BEYOND FABRIC — SOME STORIES ARE WRITTEN IN INK, OTHERS ARE WORN."
              />
            </div>
          </div>
        </div>

        {/* Shipping & Commerce Rules */}
        <div className="admin-card" style={{ marginTop: '24px' }}>
          <div className="admin-card-header">
            <div>
              <h3>Shipping &amp; Commercial Policy</h3>
              <p className="admin-card-subtitle">Delivery tariffs, complimentary shipping eligibility, and tax rules</p>
            </div>
          </div>
          <div className="admin-card-body">
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
                <label>Sales Tax Rate (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={settings.taxRatePercent}
                  onChange={(e) => setSettings({ ...settings, taxRatePercent: Number(e.target.value) })}
                />
              </div>
            </div>

            <div style={{ marginTop: '16px' }}>
              <label className="admin-custom-checkbox">
                <input
                  type="checkbox"
                  checked={settings.codEnabled}
                  onChange={(e) => setSettings({ ...settings, codEnabled: e.target.checked })}
                />
                <span>Enable Cash on Delivery (COD) payment method nationwide</span>
              </label>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="admin-card" style={{ marginTop: '24px' }}>
          <div className="admin-card-header">
            <div>
              <h3>Contact &amp; Studio Coordinates</h3>
              <p className="admin-card-subtitle">Official support email, WhatsApp channel, and studio atelier address</p>
            </div>
          </div>
          <div className="admin-card-body">
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

            <div className="field-group" style={{ marginTop: '14px' }}>
              <label>Studio Atelier Address</label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                placeholder="Lyari, Karachi, Pakistan"
              />
            </div>

            <div style={{ marginTop: '28px' }}>
              <button type="submit" className="admin-btn-primary" disabled={saving}>
                <Save size={16} strokeWidth={2} />
                <span>{saving ? 'Saving changes...' : 'Save Configuration'}</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

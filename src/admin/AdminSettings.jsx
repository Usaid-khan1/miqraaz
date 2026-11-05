import { useState, useEffect } from 'react'
import {
  Save,
  Store,
  Truck,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  UploadCloud,
  Image as ImageIcon,
  ExternalLink,
} from 'lucide-react'
import { settingsAPI, uploadAPI } from '../services/api.js'
import { useToast } from '../context/ToastContext.jsx'
import { useSettings } from '../context/SettingsContext.jsx'
import { formatImageUrl } from '../data.js'

export function AdminSettings() {
  const [settings, setSettings] = useState({
    storeName: 'Miqraaz',
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
    heroKicker: 'NEW CHAPTER',
    heroTitle: 'DASTAK',
    heroDescription: 'A knock before an arrival.',
    heroButtonText: 'SHOP NOW',
    heroButtonLink: '/collections/vol-01',
    heroImage: '',
    sliderTitle: 'DASTAK - VOL 01',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingHero, setUploadingHero] = useState(false)
  const { showToast } = useToast()
  const { refreshSettings } = useSettings()

  useEffect(() => {
    settingsAPI
      .get()
      .then((res) => {
        if (res.settings) {
          setSettings((prev) => ({ ...prev, ...res.settings }))
        }
      })
      .catch((err) => showToast(err.message, 'error'))
      .finally(() => setLoading(false))
  }, [])

  const handleHeroImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingHero(true)
    try {
      const res = await uploadAPI.uploadImage(file)
      setSettings((prev) => ({ ...prev, heroImage: res.url }))
      showToast('Hero banner image uploaded successfully', 'success')
    } catch (err) {
      showToast(err.message || 'Image upload failed', 'error')
    } finally {
      setUploadingHero(false)
      e.target.value = ''
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await settingsAPI.updateAdmin(settings)
      setSettings(res.settings)
      if (refreshSettings) await refreshSettings()
      showToast('Store settings saved and applied across entire website!', 'success')
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
        {/* Homepage Hero Banner & Slider Configuration */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3>Homepage Hero Banner &amp; Slider</h3>
              <p className="admin-card-subtitle">
                Customize the top hero banner image, title, subtitle, and slider heading independently of chapters
              </p>
            </div>
          </div>
          <div className="admin-card-body">
            <div className="form-row-2">
              <div className="field-group">
                <label>Hero Title (Main Heading)</label>
                <input
                  type="text"
                  value={settings.heroTitle}
                  onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                  placeholder="e.g. DASTAK or RANG XII"
                />
              </div>
              <div className="field-group">
                <label>Hero Subtitle / Kicker (Upper Small Text)</label>
                <input
                  type="text"
                  value={settings.heroKicker}
                  onChange={(e) => setSettings({ ...settings, heroKicker: e.target.value })}
                  placeholder="e.g. NEW CHAPTER or FEATURED COLLECTION"
                />
              </div>
            </div>

            <div className="field-group" style={{ marginTop: '14px' }}>
              <label>Hero Description / Paragraph</label>
              <textarea
                rows={2}
                value={settings.heroDescription}
                onChange={(e) => setSettings({ ...settings, heroDescription: e.target.value })}
                placeholder="A knock before an arrival. Where every color holds meaning..."
              />
            </div>

            <div className="form-row-2" style={{ marginTop: '14px' }}>
              <div className="field-group">
                <label>Hero Button Text</label>
                <input
                  type="text"
                  value={settings.heroButtonText}
                  onChange={(e) => setSettings({ ...settings, heroButtonText: e.target.value })}
                  placeholder="SHOP NOW"
                />
              </div>
              <div className="field-group">
                <label>Hero Button Target Link</label>
                <input
                  type="text"
                  value={settings.heroButtonLink}
                  onChange={(e) => setSettings({ ...settings, heroButtonLink: e.target.value })}
                  placeholder="e.g. /collections/vol-01 or /collections/all"
                />
              </div>
            </div>

            {/* Hero Image Upload & URL */}
            <div className="field-group" style={{ marginTop: '14px' }}>
              <div className="label-with-link">
                <label>Hero Background Banner Image</label>
                <label className="admin-upload-btn-inline">
                  <UploadCloud size={14} />
                  <span>{uploadingHero ? 'Uploading image...' : 'Upload New Hero Banner'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    disabled={uploadingHero}
                    onChange={handleHeroImageUpload}
                  />
                </label>
              </div>
              <input
                type="text"
                value={settings.heroImage}
                onChange={(e) => setSettings({ ...settings, heroImage: e.target.value })}
                placeholder="https://... (or click 'Upload New Hero Banner')"
              />
              {settings.heroImage && (
                <div className="size-chart-preview-box" style={{ marginTop: '10px' }}>
                  <div className="size-chart-thumb-wrap" style={{ width: '90px', height: '60px' }}>
                    <img
                      src={formatImageUrl(settings.heroImage)}
                      alt="Hero Banner Preview"
                      onError={(e) => { e.currentTarget.style.display = 'none' }}
                    />
                    <button
                      type="button"
                      className="size-chart-remove-btn"
                      onClick={() => setSettings({ ...settings, heroImage: '' })}
                      title="Remove Hero Image"
                    >
                      ×
                    </button>
                  </div>
                  <div className="size-chart-preview-info">
                    <span className="size-chart-active-tag">✓ Hero Banner Image Configured</span>
                    <a
                      href={formatImageUrl(settings.heroImage)}
                      target="_blank"
                      rel="noreferrer"
                      className="size-chart-view-link"
                    >
                      View Full Resolution <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Slider Section Title */}
            <div className="field-group" style={{ marginTop: '18px', paddingTop: '16px', borderTop: '1px solid #eef0f2' }}>
              <label>Product Slider Section Heading</label>
              <input
                type="text"
                value={settings.sliderTitle}
                onChange={(e) => setSettings({ ...settings, sliderTitle: e.target.value })}
                placeholder="e.g. DASTAK - VOL 01"
              />
              <span className="admin-field-hint">
                This heading appears above the horizontal products carousel on the homepage.
              </span>
            </div>
          </div>
        </div>

        {/* Brand & Identity */}
        <div className="admin-card" style={{ marginTop: '24px' }}>
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
                placeholder="A knock before an arrival."
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

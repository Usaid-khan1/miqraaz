import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { settingsAPI } from '../services/api.js'

const SettingsContext = createContext()

export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (!context) {
    return {
      settings: {},
      loading: false,
      refreshSettings: () => Promise.resolve(),
      calculateShipping: () => 0,
      calculateTax: () => 0,
      karachiShippingFee: 0,
      standardShippingFee: 0,
      freeShippingThreshold: 0,
      taxRatePercent: 0,
      codEnabled: true,
      storeName: 'MIQRAAZ',
      brandNameUrdu: 'مِقْرَاض',
      tagline: '',
      contactEmail: 'miqraaz.official@gmail.com',
      contactPhone: '0339 7837586',
      address: '',
      announcementText: '',
    }
  }
  return context
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    storeName: 'MIQRAAZ',
    brandNameUrdu: 'مِقْرَاض',
    tagline: '',
    contactEmail: 'miqraaz.official@gmail.com',
    contactPhone: '0339 7837586',
    currencySymbol: 'Rs.',
    currencyCode: 'PKR',
    shippingMode: 'location_based',
    karachiShippingFee: 0,
    standardShippingFee: 250,
    freeShippingThreshold: 8000,
    taxRatePercent: 0,
    codEnabled: true,
    address: 'Lyari, Karachi, Pakistan',
    announcementText: '',
  })
  const [loading, setLoading] = useState(true)

  const loadSettings = useCallback(async () => {
    try {
      const res = await settingsAPI.get()
      if (res?.settings) {
        setSettings(res.settings)
      }
    } catch (err) {
      console.warn('Failed to load store settings:', err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  // Helper to calculate shipping fee dynamically based on subtotal, city and admin settings
  const calculateShipping = useCallback(
    (subtotal = 0, city = '') => {
      const mode = settings?.shippingMode || 'location_based'
      // Mode B: Global Free Shipping everywhere
      if (mode === 'free') return 0

      const threshold = Number(settings?.freeShippingThreshold ?? 0)
      if (threshold > 0 && subtotal >= threshold) return 0

      const karachiFee = Number(settings?.karachiShippingFee ?? 0)
      const standardFee = Number(settings?.standardShippingFee ?? 250)

      // Mode A: Location-Based Shipping
      if (city) {
        const cityStr = String(city).trim().toLowerCase()
        if (cityStr === 'karachi' || cityStr === 'khi' || cityStr.includes('karachi')) {
          return karachiFee
        }
      }

      return standardFee
    },
    [settings]
  )

  // Helper to calculate sales tax
  const calculateTax = useCallback(
    (taxableAmount = 0) => {
      const taxRate = Number(settings?.taxRatePercent ?? 0)
      if (taxRate <= 0) return 0
      return Math.round((Math.max(0, taxableAmount) * taxRate) / 100)
    },
    [settings]
  )

  const value = {
    settings,
    loading,
    refreshSettings: loadSettings,
    updateLocalSettings: setSettings,
    calculateShipping,
    calculateTax,
    shippingMode: settings?.shippingMode || 'location_based',
    karachiShippingFee: Number(settings?.karachiShippingFee ?? 0),
    standardShippingFee: Number(settings?.standardShippingFee ?? 250),
    freeShippingThreshold: Number(settings?.freeShippingThreshold ?? 0),
    taxRatePercent: Number(settings?.taxRatePercent ?? 0),
    codEnabled: settings?.codEnabled !== false,
    storeName: settings?.storeName || 'MIQRAAZ',
    brandNameUrdu: settings?.brandNameUrdu || 'مِقْرَاض',
    tagline: settings?.tagline || '',
    contactEmail: settings?.contactEmail || 'miqraaz.official@gmail.com',
    contactPhone: settings?.contactPhone || '0339 7837586',
    address: settings?.address || 'Lyari, Karachi, Pakistan',
    announcementText: settings?.announcementText || '',
    heroKicker: settings?.heroKicker || 'NEW CHAPTER',
    heroTitle: settings?.heroTitle || 'DASTAK',
    heroDescription: settings?.heroDescription || 'A knock before an arrival.',
    heroButtonText: settings?.heroButtonText || 'SHOP NOW',
    heroButtonLink: settings?.heroButtonLink || '/collections/vol-01',
    heroImage: settings?.heroImage || 'https://res.cloudinary.com/c7rxy1co/image/upload/v1793818783/miqraaz/mbxziae2wzmudyoyjfc2.avif',
    sliderTitle: settings?.sliderTitle || 'DASTAK - VOL 01',
  }

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}


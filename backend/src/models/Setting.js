import mongoose from 'mongoose'

const settingSchema = new mongoose.Schema(
  {
    storeName: { type: String, default: 'Keshk' },
    brandNameUrdu: { type: String, default: 'مِقْرَاض' },
    tagline: { type: String, default: 'Unisex fashion with traditional and street fusion. EST. in Lyari' },
    contactEmail: { type: String, default: 'support@keshk.com' },
    contactPhone: { type: String, default: '+92 300 1234567' },
    currencySymbol: { type: String, default: 'Rs.' },
    currencyCode: { type: String, default: 'PKR' },
    standardShippingFee: { type: Number, default: 250 },
    freeShippingThreshold: { type: Number, default: 8000 },
    taxRatePercent: { type: Number, default: 0 },
    codEnabled: { type: Boolean, default: true },
    address: { type: String, default: 'Lyari, Karachi, Pakistan' },
    announcementText: { type: String, default: 'A LANGUAGE BEYOND FABRIC — SOME STORIES ARE WRITTEN IN INK, OTHERS ARE WORN.' },
  },
  {
    timestamps: true,
  }
)

export const Setting = mongoose.model('Setting', settingSchema)

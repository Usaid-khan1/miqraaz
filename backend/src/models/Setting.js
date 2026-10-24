import mongoose from 'mongoose'

const settingSchema = new mongoose.Schema(
  {
    storeName: { type: String, default: 'MIQRAAZ' },
    brandNameUrdu: { type: String, default: 'مِقْرَاض' },
    tagline: { type: String, default: '' },
    contactEmail: { type: String, default: 'miqraaz.official@gmail.com' },
    contactPhone: { type: String, default: '' },
    currencySymbol: { type: String, default: 'Rs.' },
    currencyCode: { type: String, default: 'PKR' },
    standardShippingFee: { type: Number, default: 250 },
    freeShippingThreshold: { type: Number, default: 8000 },
    taxRatePercent: { type: Number, default: 0 },
    codEnabled: { type: Boolean, default: true },
    address: { type: String, default: '' },
    announcementText: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
)

export const Setting = mongoose.model('Setting', settingSchema)

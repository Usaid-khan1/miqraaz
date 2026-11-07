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
    shippingMode: { type: String, enum: ['location_based', 'free'], default: 'location_based' },
    karachiShippingFee: { type: Number, default: 0 },
    standardShippingFee: { type: Number, default: 250 },
    freeShippingThreshold: { type: Number, default: 8000 },
    taxRatePercent: { type: Number, default: 0 },
    codEnabled: { type: Boolean, default: true },
    address: { type: String, default: '' },
    announcementText: { type: String, default: '' },
    heroKicker: { type: String, default: 'NEW CHAPTER' },
    heroTitle: { type: String, default: 'DASTAK' },
    heroDescription: { type: String, default: 'A knock before an arrival.' },
    heroButtonText: { type: String, default: 'SHOP NOW' },
    heroButtonLink: { type: String, default: '/collections/vol-01' },
    heroImage: { type: String, default: 'https://res.cloudinary.com/c7rxy1co/image/upload/v1793818783/miqraaz/mbxziae2wzmudyoyjfc2.avif' },
    sliderTitle: { type: String, default: 'DASTAK - VOL 01' },
  },
  {
    timestamps: true,
  }
)

export const Setting = mongoose.model('Setting', settingSchema)

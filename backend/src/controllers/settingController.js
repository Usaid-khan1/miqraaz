import { Setting } from '../models/Setting.js'

export const getSettings = async (req, res, next) => {
  try {
    let settings = await Setting.findOne()
    if (!settings) {
      settings = await Setting.create({})
    }
    res.json({
      success: true,
      settings,
    })
  } catch (error) {
    next(error)
  }
}

export const updateSettings = async (req, res, next) => {
  try {
    let settings = await Setting.findOne()
    if (!settings) {
      settings = new Setting({})
    }

    const allowed = [
      'storeName',
      'brandNameUrdu',
      'tagline',
      'contactEmail',
      'contactPhone',
      'currencySymbol',
      'currencyCode',
      'standardShippingFee',
      'freeShippingThreshold',
      'taxRatePercent',
      'codEnabled',
      'address',
      'announcementText',
      'heroKicker',
      'heroTitle',
      'heroDescription',
      'heroButtonText',
      'heroButtonLink',
      'heroImage',
      'sliderTitle',
    ]

    allowed.forEach((field) => {
      if (req.body[field] !== undefined) {
        settings[field] = req.body[field]
      }
    })

    await settings.save()

    res.json({
      success: true,
      message: 'Store settings updated successfully',
      settings,
    })
  } catch (error) {
    next(error)
  }
}

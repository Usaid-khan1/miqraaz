import { ContactMessage } from '../models/ContactMessage.js'

export const submitContactMessage = async (req, res, next) => {
  try {
    const { name, email, phone, comment } = req.body

    if (!name || !email || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required',
      })
    }

    const message = await ContactMessage.create({
      name,
      email,
      phone: phone || '',
      comment,
    })

    res.status(201).json({
      success: true,
      message: 'Thank you for contacting us. We will get back to you shortly.',
      id: message._id,
    })
  } catch (error) {
    next(error)
  }
}

export const getContactMessages = async (req, res, next) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 })
    res.json({
      success: true,
      messages,
    })
  } catch (error) {
    next(error)
  }
}

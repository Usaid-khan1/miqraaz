import multer from 'multer'
import path from 'path'
import cloudinary from '../config/cloudinary.js'

// In-memory storage: works 100% reliably in Vercel serverless and local dev without disk dependencies
const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif|avif/
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = allowedTypes.test(file.mimetype)

  if (extname && mimetype) {
    return cb(null, true)
  }
  cb(new Error('Only images (JPEG, PNG, WEBP, GIF, AVIF) are allowed'))
}

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter,
})

export const handleImageUpload = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded' })
    }

    // Stream upload directly from memory buffer to Cloudinary
    const uploadToCloudinary = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'miqraaz',
            resource_type: 'image',
          },
          (error, result) => {
            if (error) return reject(error)
            resolve(result)
          }
        )
        stream.end(buffer)
      })
    }

    const result = await uploadToCloudinary(req.file.buffer)

    return res.status(201).json({
      success: true,
      message: 'Image uploaded successfully to Cloudinary',
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
      size: result.bytes,
    })
  } catch (error) {
    console.error('[Upload] Cloudinary upload error:', error)
    return res.status(500).json({
      success: false,
      message: error.message || 'Image upload failed',
    })
  }
}

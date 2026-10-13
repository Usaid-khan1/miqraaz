import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadDir = path.resolve(__dirname, '../../uploads')

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    cb(null, `img-${uniqueSuffix}${ext}`)
  },
})

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

export const handleImageUpload = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No image file uploaded' })
  }

  // Construct static file URL
  const fileUrl = `/uploads/${req.file.filename}`

  res.status(201).json({
    success: true,
    message: 'Image uploaded successfully',
    url: fileUrl,
    filename: req.file.filename,
    size: req.file.size,
  })
}

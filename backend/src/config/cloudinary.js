import { v2 as cloudinary } from 'cloudinary'
import { ENV } from './env.js'

cloudinary.config({
  cloud_name: ENV.CLOUDINARY_CLOUD_NAME || 'c7rxy1co',
  api_key: ENV.CLOUDINARY_API_KEY || '814753638555213',
  api_secret: ENV.CLOUDINARY_API_SECRET || 'ruWZhkCmxSjMnXFd-9uenJ9xE0E',
  secure: true,
})

export default cloudinary


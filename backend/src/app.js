import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import mongoose from 'mongoose'
import path from 'path'
import { fileURLToPath } from 'url'
import { ENV } from './config/env.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'
import { apiLimiter } from './middleware/rateLimiter.js'

// Routes
import authRoutes from './routes/authRoutes.js'
import productRoutes from './routes/productRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import couponRoutes from './routes/couponRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import userRoutes from './routes/userRoutes.js'
import inventoryRoutes from './routes/inventoryRoutes.js'
import settingRoutes from './routes/settingRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import contactRoutes from './routes/contactRoutes.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()

// Trust Vercel reverse proxy
app.set('trust proxy', 1)

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
)

// CORS configuration
const allowedOrigins = [
  ENV.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
]

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps, curl, postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true)
      }

      return callback(null, true) // Allow during development
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
)

// Logger
if (ENV.NODE_ENV !== 'test') {
  app.use(morgan('dev'))
}

// Request parsers
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Rate limiting
app.use('/api', apiLimiter)

// Static files for uploaded images
const uploadDir = path.resolve(__dirname, '../uploads')
app.use('/uploads', express.static(uploadDir))

// API Health Check
app.get('/api/v1/health', (req, res) => {
  const mongoStates = [
    'disconnected',
    'connected',
    'connecting',
    'disconnecting',
  ]

  res.json({
    status: 'ok',
    environment: ENV.NODE_ENV,
    mongodb: {
      readyState: mongoose.connection.readyState,
      state:
        mongoStates[mongoose.connection.readyState] || 'unknown',
    },
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
})

// Mount API Routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/products', productRoutes)
app.use('/api/v1/categories', categoryRoutes)
app.use('/api/v1/cart', cartRoutes)
app.use('/api/v1/orders', orderRoutes)
app.use('/api/v1/coupons', couponRoutes)
app.use('/api/v1/dashboard', dashboardRoutes)
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/inventory', inventoryRoutes)
app.use('/api/v1/settings', settingRoutes)
app.use('/api/v1/uploads', uploadRoutes)
app.use('/api/v1/contact', contactRoutes)

// Central error handlers
app.use(notFound)
app.use(errorHandler)

export default app
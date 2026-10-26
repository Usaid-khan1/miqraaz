import app from '../src/app.js'
import { connectDB } from '../src/config/database.js'

let dbPromise = null

const ensureDatabaseConnection = () => {
  if (!dbPromise) {
    dbPromise = connectDB().catch((error) => {
      dbPromise = null
      throw error
    })
  }

  return dbPromise
}

export default async function handler(req, res) {
  try {
    await ensureDatabaseConnection()
    return app(req, res)
  } catch (error) {
    console.error('[Vercel] Database connection failed:', error)

    return res.status(500).json({
      success: false,
      message: 'Database connection failed',
    })
  }
}
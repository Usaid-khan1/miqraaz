import mongoose from 'mongoose'
import { ENV } from './env.js'

let memoryServer = null

export const connectDB = async () => {
  // 1. Try configured MONGODB_URI (e.g. MongoDB Atlas or local MongoDB)
  if (ENV.MONGODB_URI) {
    try {
      console.log('[MongoDB] Connecting to:', ENV.MONGODB_URI.replace(/:([^:@]+)@/, ':****@'))
      const conn = await mongoose.connect(ENV.MONGODB_URI, {
        autoIndex: true,
        serverSelectionTimeoutMS: 4000,
      })
      console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`)
      return conn
    } catch (error) {
      console.warn(`[MongoDB] Primary connection failed: ${error.message}`)
    }
  }

  // 2. Fallback to In-Memory MongoDB in development
  if (ENV.NODE_ENV === 'development') {
    try {
      console.log('[MongoDB] Starting In-Memory MongoServer fallback...')
      const { MongoMemoryServer } = await import('mongodb-memory-server')
      memoryServer = await MongoMemoryServer.create()
      const memUri = memoryServer.getUri()
      const conn = await mongoose.connect(memUri, {
        autoIndex: true,
      })
      console.log(`[MongoDB] In-Memory MongoDB active at: ${memUri}`)
      console.log(`[MongoDB] 💡 Tip: To persist data to MongoDB Atlas, verify your Atlas user credentials in backend/.env`)
      return conn
    } catch (fallbackError) {
      console.error(`[MongoDB] Memory server fallback failed: ${fallbackError.message}`)
    }
  }

  console.error('[MongoDB] Could not establish any database connection.')
  process.exit(1)
}

export const closeDB = async () => {
  try {
    await mongoose.connection.close()
    if (memoryServer) {
      await memoryServer.stop()
    }
  } catch (err) {
    console.error('[MongoDB] Error closing database connection:', err.message)
  }
}

import mongoose from 'mongoose'
import { ENV } from './env.js'

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(ENV.MONGODB_URI, {
      autoIndex: true,
    })
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`)
    return conn
  } catch (error) {
    console.error(`[MongoDB] Connection failed: ${error.message}`)
    process.exit(1)
  }
}

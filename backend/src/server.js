import app from './app.js'
import { connectDB, closeDB } from './config/database.js'
import { ENV } from './config/env.js'
import { Category } from './models/Category.js'
import { seedDatabase } from './scripts/seed.js'

const startServer = async () => {
  try {
    await connectDB()

    // Auto-seed if database is freshly initialized or empty
    try {
      const catCount = await Category.countDocuments()
      if (catCount === 0) {
        console.log('[Database] Database is empty. Running initial seed automatically...')
        await seedDatabase({ exitOnComplete: false })
      }
    } catch (seedErr) {
      console.warn(`[Database] Auto-seed check notice: ${seedErr.message}`)
    }

    const server = app.listen(ENV.PORT, () => {
      console.log(`===============================================`)
      console.log(`🚀 Miqraaz / Keshk E-Commerce Backend Server`)
      console.log(`📡 URL: http://localhost:${ENV.PORT}`)
      console.log(`🩺 Health: http://localhost:${ENV.PORT}/api/v1/health`)
      console.log(`🌍 Mode: ${ENV.NODE_ENV}`)
      console.log(`===============================================`)
    })

    const gracefulShutdown = (signal) => {
      console.log(`\nReceived ${signal}. Closing server gracefully...`)
      server.close(async () => {
        await closeDB()
        console.log('HTTP server closed.')
        process.exit(0)
      })
    }

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
    process.on('SIGINT', () => gracefulShutdown('SIGINT'))
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`)
    process.exit(1)
  }
}

startServer()

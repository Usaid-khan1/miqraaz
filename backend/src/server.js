import app from './app.js'
import { connectDB, closeDB } from './config/database.js'
import { ENV } from './config/env.js'

const startServer = async () => {
  try {
    await connectDB()

    const server = app.listen(ENV.PORT, () => {
      console.log(`===============================================`)
      console.log(`🚀 Miqraaz Backend Server`)
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

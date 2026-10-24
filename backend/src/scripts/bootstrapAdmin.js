import { connectDB } from '../config/database.js'
import { ENV } from '../config/env.js'
import { User } from '../models/User.js'

const bootstrapAdmin = async () => {
  try {
    await connectDB()

    const email = (process.argv[2] || ENV.ADMIN_EMAIL || '').toLowerCase()
    const password = process.argv[3] || ENV.ADMIN_PASSWORD
    const name = process.argv[4] || ENV.ADMIN_NAME || 'Admin'

    if (!email || !password) {
      console.error('[Admin Bootstrap] Missing credentials: ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env')
      process.exit(1)
    }

    let user = await User.findOne({ email })
    if (user) {
      user.role = 'admin'
      user.password = password
      await user.save()
      console.log(`[Admin Bootstrap] Updated existing account "${email}" to administrator with updated password.`)
    } else {
      user = await User.create({
        name,
        email,
        password,
        role: 'admin',
      })
      console.log(`[Admin Bootstrap] Created new administrator "${email}" successfully.`)
    }

    process.exit(0)
  } catch (error) {
    console.error(`[Admin Bootstrap] Error: ${error.message}`)
    process.exit(1)
  }
}

bootstrapAdmin()

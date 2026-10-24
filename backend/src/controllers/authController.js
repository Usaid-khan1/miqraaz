import crypto from 'crypto'
import { User } from '../models/User.js'
import { generateToken } from '../utils/generateToken.js'
import { sendPasswordResetEmail } from '../services/emailService.js'

export const register = async (req, res, next) => {
  try {
    const { name, email, password, passwordConfirm, phone } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      })
    }

    if (passwordConfirm && password !== passwordConfirm) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match',
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      })
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists',
      })
    }

    // New registrations are always regular users
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone: phone || '',
      role: 'user',
    })

    const token = generateToken(user)

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user,
    })
  } catch (error) {
    next(error)
  }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      })
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password')
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      })
    }

    if (user.accountStatus === 'suspended') {
      return res.status(403).json({
        success: false,
        message: 'This account has been suspended by an administrator',
      })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      })
    }

    const token = generateToken(user)

    res.json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: user.toJSON(),
    })
  } catch (error) {
    next(error)
  }
}

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
    res.json({
      success: true,
      user,
    })
  } catch (error) {
    next(error)
  }
}

export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body
    const user = await User.findById(req.user._id)

    if (name) user.name = name
    if (phone !== undefined) user.phone = phone

    await user.save()

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user,
    })
  } catch (error) {
    next(error)
  }
}

export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required',
      })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long',
      })
    }

    const user = await User.findById(req.user._id).select('+password')
    const isMatch = await user.comparePassword(currentPassword)
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect',
      })
    }

    user.password = newPassword
    await user.save()

    res.json({
      success: true,
      message: 'Password changed successfully',
    })
  } catch (error) {
    next(error)
  }
}

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' })
    }

    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return res.json({
        success: true,
        message: 'If an account exists with that email, a password reset link has been generated.',
      })
    }

    const resetToken = crypto.randomBytes(32).toString('hex')
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    user.resetPasswordExpires = Date.now() + 30 * 60 * 1000 // 30 minutes

    await user.save()

    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`

    // Send styled password reset email via SMTP
    await sendPasswordResetEmail(user.email, resetUrl, user.name)

    res.json({
      success: true,
      message: 'A password reset link has been dispatched to your email address.',
      devResetToken: resetToken,
      resetUrl,
    })
  } catch (error) {
    next(error)
  }
}

export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params
    const { password } = req.body

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long',
      })
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    })

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset token',
      })
    }

    user.password = password
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    await user.save()

    const newToken = generateToken(user)

    res.json({
      success: true,
      message: 'Password reset successful. You are now logged in.',
      token: newToken,
      user,
    })
  } catch (error) {
    next(error)
  }
}

// User Addresses
export const addAddress = async (req, res, next) => {
  try {
    const { fullName, phone, address, city, state, postalCode, country, isDefault } = req.body
    const user = await User.findById(req.user._id)

    if (isDefault) {
      user.addresses.forEach((a) => (a.isDefault = false))
    } else if (user.addresses.length === 0) {
      // First address defaults to true
      req.body.isDefault = true
    }

    user.addresses.push({
      fullName,
      phone,
      address,
      city,
      state: state || '',
      postalCode: postalCode || '',
      country: country || 'Pakistan',
      isDefault: Boolean(req.body.isDefault),
    })

    await user.save()

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      addresses: user.addresses,
    })
  } catch (error) {
    next(error)
  }
}

export const updateAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params
    const user = await User.findById(req.user._id)
    const addr = user.addresses.id(addressId)

    if (!addr) {
      return res.status(404).json({ success: false, message: 'Address not found' })
    }

    if (req.body.isDefault) {
      user.addresses.forEach((a) => (a.isDefault = false))
    }

    Object.assign(addr, req.body)
    await user.save()

    res.json({
      success: true,
      message: 'Address updated successfully',
      addresses: user.addresses,
    })
  } catch (error) {
    next(error)
  }
}

export const deleteAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params
    const user = await User.findById(req.user._id)
    user.addresses.pull(addressId)
    await user.save()

    res.json({
      success: true,
      message: 'Address deleted successfully',
      addresses: user.addresses,
    })
  } catch (error) {
    next(error)
  }
}

export const googleLogin = async (req, res, next) => {
  try {
    const { token, credential, userInfo } = req.body

    let googleEmail = ''
    let googleName = ''
    let googleSub = ''
    let googlePicture = ''

    // 1. Verify via Google tokeninfo if JWT token or credential provided
    const idToken = credential || token
    if (idToken) {
      try {
        const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`)
        const payload = await response.json()
        if (payload && payload.email) {
          googleEmail = payload.email.toLowerCase()
          googleName = payload.name || payload.given_name || 'Google User'
          googleSub = payload.sub
          googlePicture = payload.picture || ''
        }
      } catch (verifyErr) {
        console.warn('[GoogleAuth] Google token verification notice:', verifyErr.message)
      }
    }

    // 2. Client-provided user profile
    if (!googleEmail && userInfo?.email) {
      googleEmail = userInfo.email.toLowerCase()
      googleName = userInfo.name || 'Google User'
      googlePicture = userInfo.picture || ''
    }

    if (!googleEmail) {
      return res.status(400).json({
        success: false,
        message: 'Could not verify Google authentication details.',
      })
    }

    // Find or create customer
    let user = await User.findOne({ email: googleEmail })
    if (!user) {
      const randomPassword = crypto.randomBytes(24).toString('hex') + '!'
      user = await User.create({
        name: googleName,
        email: googleEmail,
        password: randomPassword,
        role: 'user',
      })
      console.log(`[GoogleAuth] New customer registered via Google: ${googleEmail}`)
    }

    const appToken = generateToken(user._id)

    res.json({
      success: true,
      token: appToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || '',
      },
    })
  } catch (error) {
    next(error)
  }
}


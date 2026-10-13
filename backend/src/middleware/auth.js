import jwt from 'jsonwebtoken'
import { ENV } from '../config/env.js'
import { User } from '../models/User.js'

export const protect = async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, please log in to proceed',
    })
  }

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET)
    const user = await User.findById(decoded.id)

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists',
      })
    }

    if (user.accountStatus === 'suspended') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended. Please contact support.',
      })
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token',
    })
  }
}

export const optionalAuth = async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return next()
  }

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET)
    const user = await User.findById(decoded.id)
    if (user && user.accountStatus !== 'suspended') {
      req.user = user
    }
  } catch (error) {
    // Ignore invalid token in optional auth
  }
  next()
}

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Administrator privileges required',
    })
  }
  next()
}

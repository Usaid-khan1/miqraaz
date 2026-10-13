import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authAPI } from '../services/api.js'
import { useToast } from './ToastContext.jsx'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('miqraaz_user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })
  const [token, setToken] = useState(() => localStorage.getItem('miqraaz_token') || null)
  const [loading, setLoading] = useState(true)
  const { showToast } = useToast()

  const checkUserSession = useCallback(async () => {
    const storedToken = localStorage.getItem('miqraaz_token')
    if (!storedToken) {
      setUser(null)
      setLoading(false)
      return
    }

    try {
      const data = await authAPI.getMe()
      setUser(data.user)
      localStorage.setItem('miqraaz_user', JSON.stringify(data.user))
    } catch (err) {
      console.warn('Session check error:', err.message)
      localStorage.removeItem('miqraaz_token')
      localStorage.removeItem('miqraaz_user')
      setUser(null)
      setToken(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    checkUserSession()

    const handleExpired = () => {
      setUser(null)
      setToken(null)
      showToast('Your session has expired. Please sign in again.', 'info')
    }

    window.addEventListener('auth_token_expired', handleExpired)
    return () => window.removeEventListener('auth_token_expired', handleExpired)
  }, [checkUserSession, showToast])

  const login = async (email, password) => {
    try {
      const res = await authAPI.login({ email, password })
      localStorage.setItem('miqraaz_token', res.token)
      localStorage.setItem('miqraaz_user', JSON.stringify(res.user))
      setToken(res.token)
      setUser(res.user)
      showToast(`Welcome back, ${res.user.name}!`, 'success')
      return res.user
    } catch (err) {
      showToast(err.message || 'Login failed', 'error')
      throw err
    }
  }

  const register = async (data) => {
    try {
      const res = await authAPI.register(data)
      localStorage.setItem('miqraaz_token', res.token)
      localStorage.setItem('miqraaz_user', JSON.stringify(res.user))
      setToken(res.token)
      setUser(res.user)
      showToast('Account created successfully!', 'success')
      return res.user
    } catch (err) {
      showToast(err.message || 'Registration failed', 'error')
      throw err
    }
  }

  const logout = () => {
    localStorage.removeItem('miqraaz_token')
    localStorage.removeItem('miqraaz_user')
    setToken(null)
    setUser(null)
    showToast('You have been signed out.', 'info')
  }

  const updateProfile = async (data) => {
    try {
      const res = await authAPI.updateProfile(data)
      setUser(res.user)
      localStorage.setItem('miqraaz_user', JSON.stringify(res.user))
      showToast('Profile updated successfully', 'success')
      return res.user
    } catch (err) {
      showToast(err.message || 'Failed to update profile', 'error')
      throw err
    }
  }

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const res = await authAPI.updatePassword({ currentPassword, newPassword })
      showToast('Password changed successfully', 'success')
      return res
    } catch (err) {
      showToast(err.message || 'Failed to change password', 'error')
      throw err
    }
  }

  const addAddress = async (addrData) => {
    try {
      const res = await authAPI.addAddress(addrData)
      setUser((prev) => ({ ...prev, addresses: res.addresses }))
      localStorage.setItem('miqraaz_user', JSON.stringify({ ...user, addresses: res.addresses }))
      showToast('Address added successfully', 'success')
      return res.addresses
    } catch (err) {
      showToast(err.message || 'Failed to add address', 'error')
      throw err
    }
  }

  const updateAddress = async (id, addrData) => {
    try {
      const res = await authAPI.updateAddress(id, addrData)
      setUser((prev) => ({ ...prev, addresses: res.addresses }))
      localStorage.setItem('miqraaz_user', JSON.stringify({ ...user, addresses: res.addresses }))
      showToast('Address updated successfully', 'success')
      return res.addresses
    } catch (err) {
      showToast(err.message || 'Failed to update address', 'error')
      throw err
    }
  }

  const deleteAddress = async (id) => {
    try {
      const res = await authAPI.deleteAddress(id)
      setUser((prev) => ({ ...prev, addresses: res.addresses }))
      localStorage.setItem('miqraaz_user', JSON.stringify({ ...user, addresses: res.addresses }))
      showToast('Address removed', 'success')
      return res.addresses
    } catch (err) {
      showToast(err.message || 'Failed to remove address', 'error')
      throw err
    }
  }

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(user),
    isAdmin: Boolean(user && user.role === 'admin'),
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    addAddress,
    updateAddress,
    deleteAddress,
    refreshUser: checkUserSession,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

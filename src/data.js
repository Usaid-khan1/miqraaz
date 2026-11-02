import logo1 from './logo1.png'
import logo1Black from './logo1_black.png'
import logoBlack from './logo_black.png'

export const LOGO = logo1
export const LOGO_WHITE = logo1
export const LOGO_BLACK = logo1Black
export const LOGO_ARABIC_BLACK = logoBlack

export const money = (n) =>
  'Rs.' +
  Number(n || 0).toLocaleString('en-PK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

export const formatImageUrl = (url) => {
  if (!url || typeof url !== 'string') return ''
  const trimmed = url.trim()
  if (!trimmed) return ''

  // Filter out non-URL dummy strings (must be absolute URL, local path starting with /, or data URI)
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('/') && !trimmed.startsWith('data:')) {
    return ''
  }

  // Prepend backend base for local /uploads paths
  if (trimmed.startsWith('/uploads')) {
    const backendBase = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1').replace(/\/api\/v1\/?$/, '')
    return `${backendBase}${trimmed}`
  }

  return trimmed
}

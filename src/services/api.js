const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'

const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('miqraaz_token')
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  }

  // Handle FormData where Content-Type shouldn't be application/json
  if (options.body instanceof FormData) {
    delete headers['Content-Type']
  }

  const config = {
    ...options,
    headers,
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, config)
    const data = await res.json()

    if (!res.ok) {
      // If 401 Unauthorized, handle token expiration
      if (res.status === 401 && token) {
        localStorage.removeItem('miqraaz_token')
        localStorage.removeItem('miqraaz_user')
        window.dispatchEvent(new Event('auth_token_expired'))
      }
      throw new Error(data.message || `Request failed with status ${res.status}`)
    }

    return data
  } catch (error) {
    throw error
  }
}

export const authAPI = {
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => request('/auth/me'),
  updateProfile: (data) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),
  updatePassword: (data) => request('/auth/password', { method: 'PUT', body: JSON.stringify(data) }),
  forgotPassword: (data) => request('/auth/forgot-password', { method: 'POST', body: JSON.stringify(data) }),
  resetPassword: (token, data) => request(`/auth/reset-password/${token}`, { method: 'POST', body: JSON.stringify(data) }),
  addAddress: (data) => request('/auth/addresses', { method: 'POST', body: JSON.stringify(data) }),
  updateAddress: (id, data) => request(`/auth/addresses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteAddress: (id) => request(`/auth/addresses/${id}`, { method: 'DELETE' }),
}

export const productsAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') query.append(k, v)
    })
    return request(`/products?${query.toString()}`)
  },
  getBySlugOrId: (identifier) => request(`/products/${identifier}`),
  getFeatured: () => request('/products/featured'),
  create: (data) => request('/products', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/products/${id}`, { method: 'DELETE' }),
}

export const categoriesAPI = {
  getAll: (includeInactive = false) => request(`/categories${includeInactive ? '?includeInactive=true' : ''}`),
  getBySlug: (slug) => request(`/categories/${slug}`),
  create: (data) => request('/categories', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/categories/${id}`, { method: 'DELETE' }),
}

export const cartAPI = {
  get: () => request('/cart'),
  add: (item) => request('/cart/add', { method: 'POST', body: JSON.stringify(item) }),
  update: (itemId, qty) => request(`/cart/items/${itemId}`, { method: 'PUT', body: JSON.stringify({ qty }) }),
  remove: (itemId) => request(`/cart/items/${itemId}`, { method: 'DELETE' }),
  clear: () => request('/cart/clear', { method: 'DELETE' }),
  sync: (guestItems) => request('/cart/sync', { method: 'POST', body: JSON.stringify({ guestItems }) }),
}

export const ordersAPI = {
  create: (orderData) => request('/orders', { method: 'POST', body: JSON.stringify(orderData) }),
  getMyOrders: () => request('/orders/my'),
  getById: (id) => request(`/orders/${id}`),
  requestCancellation: (id, reason) => request(`/orders/${id}/cancel-request`, { method: 'POST', body: JSON.stringify({ reason }) }),
  getAllAdmin: (params = {}) => {
    const query = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') query.append(k, v)
    })
    return request(`/orders/admin/all?${query.toString()}`)
  },
  updateStatusAdmin: (id, data) => request(`/orders/admin/${id}/status`, { method: 'PUT', body: JSON.stringify(data) }),
  updateTrackingAdmin: (id, data) => request(`/orders/admin/${id}/tracking`, { method: 'PUT', body: JSON.stringify(data) }),
  approveCancellationAdmin: (id, approved) => request(`/orders/admin/${id}/cancellation`, { method: 'POST', body: JSON.stringify({ approved }) }),
}

export const couponsAPI = {
  validate: (code, subtotal) => request('/coupons/validate', { method: 'POST', body: JSON.stringify({ code, subtotal }) }),
  getAllAdmin: () => request('/coupons'),
  generateCodeAdmin: (prefix) => request(`/coupons/generate-code${prefix ? `?prefix=${prefix}` : ''}`),
  createAdmin: (data) => request('/coupons', { method: 'POST', body: JSON.stringify(data) }),
  updateAdmin: (id, data) => request(`/coupons/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteAdmin: (id) => request(`/coupons/${id}`, { method: 'DELETE' }),
}

export const dashboardAPI = {
  getStats: () => request('/dashboard/stats'),
}

export const usersAPI = {
  getCustomersAdmin: (params = {}) => {
    const query = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') query.append(k, v)
    })
    return request(`/users?${query.toString()}`)
  },
  getCustomerDetailsAdmin: (id) => request(`/users/${id}`),
  toggleStatusAdmin: (id) => request(`/users/${id}/status`, { method: 'PATCH' }),
}

export const inventoryAPI = {
  getOverviewAdmin: (params = {}) => {
    const query = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') query.append(k, v)
    })
    return request(`/inventory/overview?${query.toString()}`)
  },
  adjustStockAdmin: (productId, data) => request(`/inventory/adjust/${productId}`, { method: 'POST', body: JSON.stringify(data) }),
  getLogsAdmin: (params = {}) => {
    const query = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') query.append(k, v)
    })
    return request(`/inventory/logs?${query.toString()}`)
  },
}

export const settingsAPI = {
  get: () => request('/settings'),
  updateAdmin: (data) => request('/settings', { method: 'PUT', body: JSON.stringify(data) }),
}

export const contactAPI = {
  submit: (data) => request('/contact', { method: 'POST', body: JSON.stringify(data) }),
  getAllAdmin: () => request('/contact'),
}

export const uploadAPI = {
  uploadImage: async (file) => {
    const formData = new FormData()
    formData.append('image', file)
    return request('/uploads', { method: 'POST', body: formData })
  },
}

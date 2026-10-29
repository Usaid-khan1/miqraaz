import { useState, useEffect } from 'react'
import {
  Plus,
  Search,
  UploadCloud,
  X,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react'
import { productsAPI, categoriesAPI, uploadAPI } from '../services/api.js'
import { useToast } from '../context/ToastContext.jsx'
import { money, formatImageUrl } from '../data.js'

export function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 })

  // Modal State
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { showToast, confirmModal } = useToast()

  const initialForm = {
    name: '',
    slug: '',
    description: '',
    price: '',
    salePrice: '',
    sku: '',
    category: '',
    collectionSlug: '',
    imagesText: '',
    sizes: [
      { size: 'S', stock: 10 },
      { size: 'M', stock: 15 },
      { size: 'L', stock: 15 },
      { size: 'XL', stock: 10 },
    ],
    lowStockThreshold: 5,
    isFeatured: false,
    isPublished: true,
  }

  const [form, setForm] = useState(initialForm)

  const loadProducts = () => {
    setLoading(true)
    productsAPI
      .getAll({ search, page, limit: 15, includeUnpublished: 'true' })
      .then((res) => {
        setProducts(res.products || [])
        if (res.pagination) setPagination(res.pagination)
      })
      .catch((err) => showToast(err.message, 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadProducts()
  }, [search, page])

  useEffect(() => {
    categoriesAPI
      .getAll(true)
      .then((res) => setCategories(res.categories || []))
      .catch(() => setCategories([]))
  }, [])

  const handleOpenAdd = () => {
    setEditingProduct(null)
    setForm(initialForm)
    setModalOpen(true)
  }

  const handleOpenEdit = (p) => {
    setEditingProduct(p)
    setForm({
      name: p.name || '',
      slug: p.slug || '',
      description: p.description || '',
      price: p.price ?? '',
      salePrice: p.salePrice ?? '',
      sku: p.sku || '',
      category: p.category?._id || p.category || '',
      collectionSlug: p.collectionSlug || '',
      imagesText: Array.isArray(p.images) ? p.images.join('\n') : '',
      sizes: p.sizes?.length ? p.sizes : initialForm.sizes,
      lowStockThreshold: p.lowStockThreshold ?? 5,
      isFeatured: Boolean(p.isFeatured),
      isPublished: Boolean(p.isPublished),
    })
    setModalOpen(true)
  }

  const handleImageFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    try {
      const res = await uploadAPI.uploadImage(file)
      setForm((prev) => {
        // Keep valid existing image paths/URLs and append the new upload
        const existing = prev.imagesText
          .split('\n')
          .map((s) => s.trim())
          .filter((s) => s.startsWith('http://') || s.startsWith('https://') || s.startsWith('/') || s.startsWith('data:'))
        existing.push(res.url)
        return {
          ...prev,
          imagesText: existing.join('\n'),
        }
      })
      showToast('Image uploaded successfully', 'success')
    } catch (err) {
      showToast(err.message || 'Image upload failed', 'error')
    } finally {
      setUploadingImage(false)
      e.target.value = ''
    }
  }

  const handleTogglePublish = async (p) => {
    try {
      const nextStatus = !p.isPublished
      await productsAPI.update(p._id, { isPublished: nextStatus })
      setProducts((prev) =>
        prev.map((item) => (item._id === p._id ? { ...item, isPublished: nextStatus } : item))
      )
      showToast(
        nextStatus
          ? `"${p.name}" is now Published (visible on website)`
          : `"${p.name}" is now Hidden from website`,
        'success'
      )
    } catch (err) {
      showToast(err.message || 'Failed to toggle status', 'error')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    // Filter out dummy text that are not valid URLs or paths
    const imagesArray = form.imagesText
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.startsWith('http://') || s.startsWith('https://') || s.startsWith('/') || s.startsWith('data:'))

    const payload = {
      name: form.name,
      slug: form.slug,
      description: form.description,
      price: Number(form.price),
      salePrice: form.salePrice ? Number(form.salePrice) : null,
      sku: form.sku,
      category: form.category || null,
      collectionSlug: form.collectionSlug,
      images: imagesArray,
      sizes: form.sizes.map((s) => ({ size: s.size, stock: Number(s.stock) || 0 })),
      lowStockThreshold: Number(form.lowStockThreshold) || 5,
      isFeatured: Boolean(form.isFeatured),
      isPublished: Boolean(form.isPublished),
    }

    try {
      if (editingProduct) {
        await productsAPI.update(editingProduct._id, payload)
        showToast('Product updated successfully', 'success')
      } else {
        await productsAPI.create(payload)
        showToast('Product created successfully', 'success')
      }
      setModalOpen(false)
      loadProducts()
    } catch (err) {
      showToast(err.message || 'Operation failed', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id, name) => {
    const ok = await confirmModal({
      title: 'Delete Article',
      message: `Are you sure you want to permanently delete "${name}" from the catalog? This action cannot be undone.`,
      confirmText: 'Delete Article',
      isDanger: true,
    })
    if (!ok) return

    try {
      await productsAPI.delete(id)
      showToast(`Article "${name}" deleted successfully`, 'success')
      loadProducts()
    } catch (err) {
      showToast(err.message || 'Failed to delete product', 'error')
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Products Catalog</h1>
          <p className="admin-page-subtitle">Create, update, and manage editorial articles and size inventories</p>
        </div>
        <button type="button" className="admin-btn-primary" onClick={handleOpenAdd}>
          <Plus size={16} strokeWidth={2} />
          <span>New Product</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="admin-toolbar-row">
        <div className="admin-search-box">
          <Search size={16} className="admin-search-icon" />
          <input
            type="text"
            placeholder="Search by article title, SKU..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
        </div>
        <span className="admin-counter-text">{pagination.total} articles total</span>
      </div>

      {/* Table Card */}
      <div className="admin-card">
        {loading ? (
          <div className="admin-loading-spinner-wrap">
            <div className="admin-spinner-ring" />
            <span>Loading product inventory...</span>
          </div>
        ) : products.length > 0 ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Article</th>
                  <th>SKU</th>
                  <th>Collection</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Featured</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <div className="admin-prod-cell">
                        {(() => {
                          const validImg = p.images?.map(formatImageUrl).find(Boolean)
                          return validImg ? (
                            <img
                              src={validImg}
                              alt={p.name}
                              className="admin-thumb"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                          ) : (
                            <div className="admin-thumb-empty">
                              <ShoppingBag size={18} strokeWidth={1.5} />
                            </div>
                          )
                        })()}
                        <div>
                          <strong className="admin-prod-title">{p.name}</strong>
                          <div className="muted font-xs">{p.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="font-xs font-mono">{p.sku || '—'}</span></td>
                    <td><span className="font-sm">{p.category?.name || p.collectionSlug || '—'}</span></td>
                    <td>
                      {p.salePrice ? (
                        <div className="admin-price-cell">
                          <strong className="text-accent">{money(p.salePrice)}</strong>
                          <span className="line-through muted font-xs">{money(p.price)}</span>
                        </div>
                      ) : (
                        <strong>{money(p.price)}</strong>
                      )}
                    </td>
                    <td>
                      <span className={`stock-badge ${p.totalStock <= 0 ? 'out' : p.totalStock <= p.lowStockThreshold ? 'low' : 'ok'}`}>
                        {p.totalStock} units
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className={`status-pill ${p.isPublished ? 'status-delivered' : 'status-cancelled'}`}
                        style={{ cursor: 'pointer', border: 'none' }}
                        onClick={() => handleTogglePublish(p)}
                        title="Click to toggle: Published / Hidden"
                      >
                        {p.isPublished ? 'Published' : 'Hidden'}
                      </button>
                    </td>
                    <td>
                      {p.isFeatured ? (
                        <span className="featured-chip">
                          <Sparkles size={12} strokeWidth={2} />
                          <span>Featured</span>
                        </span>
                      ) : (
                        <span className="muted font-xs">—</span>
                      )}
                    </td>
                    <td className="text-right">
                      <div className="admin-action-btn-group">
                        <button
                          type="button"
                          className="admin-icon-action-btn"
                          title="Edit Product"
                          onClick={() => handleOpenEdit(p)}
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          type="button"
                          className="admin-icon-action-btn text-danger"
                          title="Delete Product"
                          onClick={() => handleDelete(p._id, p.name)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-empty-state-box">
            <ShoppingBag size={32} strokeWidth={1.5} className="muted" />
            <p>No products found matching your search.</p>
          </div>
        )}
      </div>

      {/* Pagination Bar */}
      {pagination.totalPages > 1 && (
        <div className="pagination-bar">
          <button
            type="button"
            className="page-btn"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft size={15} />
            <span>Previous</span>
          </button>
          <span className="page-indicator">
            Page {page} of {pagination.totalPages}
          </span>
          <button
            type="button"
            className="page-btn"
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
          >
            <span>Next</span>
            <ChevronRight size={15} />
          </button>
        </div>
      )}

      {/* ADD / EDIT PRODUCT MODAL */}
      {modalOpen && (
        <div className="admin-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="admin-modal-card admin-modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <h3 className="admin-modal-title">
                  {editingProduct ? `Edit Article: ${editingProduct.name}` : 'Create New Article'}
                </h3>
                <p className="admin-modal-subtitle">Configure pricing, category taxonomy, and size stock levels</p>
              </div>
              <button
                type="button"
                className="admin-modal-close-btn"
                onClick={() => setModalOpen(false)}
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="admin-modal-body">
              <div className="form-row-2">
                <div className="field-group">
                  <label>Article Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Classic Embroidered Kurta"
                  />
                </div>
                <div className="field-group">
                  <label>Slug Identifier</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="Auto-generated if empty"
                  />
                </div>
              </div>

              <div className="field-group">
                <label>Description &amp; Fabric Narrative</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Artisanal silhouettes with street fusion inspired by Lyari..."
                />
              </div>

              <div className="form-row-3">
                <div className="field-group">
                  <label>Regular Price (PKR) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="6500"
                  />
                </div>
                <div className="field-group">
                  <label>Sale Price (Optional PKR)</label>
                  <input
                    type="number"
                    min={0}
                    value={form.salePrice}
                    onChange={(e) => setForm({ ...form, salePrice: e.target.value })}
                    placeholder="Leave empty if regular"
                  />
                </div>
                <div className="field-group">
                  <label>SKU / Barcode</label>
                  <input
                    type="text"
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                    placeholder="e.g. MK-882190"
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="field-group">
                  <label>Category Reference</label>
                  <select
                    value={form.category}
                    onChange={(e) => {
                      const selectedCatId = e.target.value
                      const matched = categories.find((c) => c._id === selectedCatId)
                      setForm({
                        ...form,
                        category: selectedCatId,
                        collectionSlug: matched ? matched.slug : form.collectionSlug,
                      })
                    }}
                  >
                    <option value="">None / Standalone</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field-group">
                  <label>Collection Slug</label>
                  <input
                    type="text"
                    value={form.collectionSlug}
                    onChange={(e) => setForm({ ...form, collectionSlug: e.target.value })}
                    placeholder="e.g. summer-collection, festive-drop..."
                  />
                </div>
              </div>

              {/* Image Upload and URLs */}
              <div className="field-group">
                <div className="label-with-link">
                  <label>Image Assets (One URL per line)</label>
                  <label className="admin-inline-upload-btn">
                    <UploadCloud size={14} />
                    <span>{uploadingImage ? 'Uploading...' : 'Upload File'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      style={{ display: 'none' }}
                      disabled={uploadingImage}
                    />
                  </label>
                </div>
                <textarea
                  rows={3}
                  value={form.imagesText}
                  onChange={(e) => setForm({ ...form, imagesText: e.target.value })}
                  placeholder="https://miqraazofficial.com/...&#10;/uploads/file-123.jpg"
                />
                {form.imagesText.split('\n').filter(Boolean).length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                    {form.imagesText.split('\n').map((raw, idx) => {
                      const formatted = formatImageUrl(raw)
                      if (!formatted) return null
                      return (
                        <div key={idx} style={{ position: 'relative', width: '56px', height: '56px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #ddd' }}>
                          <img src={formatted} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.style.display = 'none' }} />
                          <button
                            type="button"
                            onClick={() => {
                              const lines = form.imagesText.split('\n').filter((_, i) => i !== idx)
                              setForm({ ...form, imagesText: lines.join('\n') })
                            }}
                            style={{
                              position: 'absolute',
                              top: 2,
                              right: 2,
                              background: 'rgba(0,0,0,0.7)',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '50%',
                              width: '18px',
                              height: '18px',
                              fontSize: '11px',
                              lineHeight: '18px',
                              textAlign: 'center',
                              cursor: 'pointer',
                              padding: 0
                            }}
                            title="Remove image"
                          >
                            ×
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Sizes Stock */}
              <div className="field-group">
                <label>Sizes &amp; Variant Inventory</label>
                <div className="size-inputs-grid">
                  {form.sizes.map((s, idx) => (
                    <div key={s.size} className="size-stock-input-item">
                      <span className="size-stock-tag">{s.size}</span>
                      <input
                        type="number"
                        min={0}
                        value={s.stock}
                        onChange={(e) => {
                          const updated = [...form.sizes]
                          updated[idx].stock = e.target.value
                          setForm({ ...form, sizes: updated })
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-row-3">
                <div className="field-group">
                  <label>Low Stock Threshold</label>
                  <input
                    type="number"
                    min={1}
                    value={form.lowStockThreshold}
                    onChange={(e) => setForm({ ...form, lowStockThreshold: e.target.value })}
                  />
                </div>
                <div className="field-group checkbox-align">
                  <label className="admin-custom-checkbox">
                    <input
                      type="checkbox"
                      checked={form.isFeatured}
                      onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                    />
                    <span>Featured in Highlights</span>
                  </label>
                </div>
                <div className="field-group checkbox-align">
                  <label className="admin-custom-checkbox">
                    <input
                      type="checkbox"
                      checked={form.isPublished}
                      onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                    />
                    <span>Published (Storefront Visible)</span>
                  </label>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn-secondary"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : editingProduct ? 'Save Changes' : 'Create Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

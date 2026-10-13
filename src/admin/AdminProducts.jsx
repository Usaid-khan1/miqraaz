import { useState, useEffect } from 'react'
import { productsAPI, categoriesAPI, uploadAPI } from '../services/api.js'
import { useToast } from '../context/ToastContext.jsx'
import { money } from '../data.js'

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
  const { showToast } = useToast()

  const initialForm = {
    name: '',
    slug: '',
    description: '',
    price: '',
    salePrice: '',
    sku: '',
    category: '',
    collectionSlug: 'rang-xii',
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
      collectionSlug: p.collectionSlug || 'rang-xii',
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
      // Append uploaded image URL to imagesText
      setForm((prev) => ({
        ...prev,
        imagesText: prev.imagesText ? `${prev.imagesText}\n${res.url}` : res.url,
      }))
      showToast('Image uploaded successfully', 'success')
    } catch (err) {
      showToast(err.message || 'Image upload failed', 'error')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    const imagesArray = form.imagesText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)

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
    if (!window.confirm(`Are you sure you want to delete product "${name}"?`)) return
    try {
      await productsAPI.delete(id)
      showToast('Product deleted', 'success')
      loadProducts()
    } catch (err) {
      showToast(err.message || 'Failed to delete product', 'error')
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Products Management</h1>
          <p className="muted font-sm">Create, update, and manage catalog items</p>
        </div>
        <button type="button" className="btn sm" onClick={handleOpenAdd}>
          + Add New Product
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="admin-toolbar-row">
        <div className="admin-search-input-wrap">
          <input
            type="text"
            placeholder="Search by product name, SKU..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
        </div>
        <span className="font-sm muted">Total: {pagination.total} products</span>
      </div>

      {/* Products Table */}
      <div className="admin-card">
        {loading ? (
          <div className="admin-loading-spinner">Loading catalog...</div>
        ) : products.length > 0 ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Category</th>
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
                        {p.images && p.images[0] ? (
                          <img src={p.images[0]} alt={p.name} className="admin-thumb" />
                        ) : (
                          <div className="ph small admin-thumb">KESHK</div>
                        )}
                        <div>
                          <strong>{p.name}</strong>
                          <div className="muted font-xs">{p.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="font-xs font-mono">{p.sku}</span></td>
                    <td>{p.category?.name || p.collectionSlug || '—'}</td>
                    <td>
                      {p.salePrice ? (
                        <>
                          <strong>{money(p.salePrice)}</strong>{' '}
                          <span className="line-through muted font-xs">{money(p.price)}</span>
                        </>
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
                      <span className={`status-pill ${p.isPublished ? 'status-delivered' : 'status-cancelled'}`}>
                        {p.isPublished ? 'Published' : 'Hidden'}
                      </span>
                    </td>
                    <td>{p.isFeatured ? '⭐ Yes' : 'No'}</td>
                    <td className="text-right">
                      <button
                        type="button"
                        className="link font-sm mr-2"
                        onClick={() => handleOpenEdit(p)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="link text-danger font-sm"
                        onClick={() => handleDelete(p._id, p.name)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-empty-pane">
            <p className="muted">No products found matching your search.</p>
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
            ← Previous
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
            Next →
          </button>
        </div>
      )}

      {/* ADD / EDIT PRODUCT MODAL */}
      {modalOpen && (
        <div className="search-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-dialog-card xl" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingProduct ? `Edit Product: ${editingProduct.name}` : 'Create New Product'}</h3>
              <button type="button" className="icon-btn" onClick={() => setModalOpen(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-body-scroll">
              <div className="form-row-2">
                <div className="field-group">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Sabz Daftar Hoodie"
                  />
                </div>
                <div className="field-group">
                  <label>Slug (URL Identifier)</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="auto-generated if empty"
                  />
                </div>
              </div>

              <div className="field-group">
                <label>Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Unisex fashion with traditional and street fusion..."
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
                    placeholder="5800"
                  />
                </div>
                <div className="field-group">
                  <label>SKU</label>
                  <input
                    type="text"
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                    placeholder="e.g. MK-102938"
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="field-group">
                  <label>Category Reference</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    <option value="">None / Default</option>
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
                    placeholder="e.g. rang-xii, raabta-xi..."
                  />
                </div>
              </div>

              {/* Image Upload and URLs */}
              <div className="field-group">
                <div className="label-with-link">
                  <label>Product Images (One URL per line)</label>
                  <label className="image-upload-label-btn">
                    {uploadingImage ? 'Uploading...' : '📁 Upload Image File'}
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
                  placeholder="https://example.com/image.jpg&#10;/uploads/img-123.jpg"
                />
              </div>

              {/* Sizes Stock */}
              <div className="field-group">
                <label>Sizes &amp; Inventory Quantities</label>
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
                  <label>Low Stock Alert Threshold</label>
                  <input
                    type="number"
                    min={1}
                    value={form.lowStockThreshold}
                    onChange={(e) => setForm({ ...form, lowStockThreshold: e.target.value })}
                  />
                </div>
                <div className="field-group checkbox-align">
                  <label className="filter-checkbox-label">
                    <input
                      type="checkbox"
                      checked={form.isFeatured}
                      onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                    />
                    <span>Featured Product</span>
                  </label>
                </div>
                <div className="field-group checkbox-align">
                  <label className="filter-checkbox-label">
                    <input
                      type="checkbox"
                      checked={form.isPublished}
                      onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                    />
                    <span>Published (Visible to public)</span>
                  </label>
                </div>
              </div>

              <div className="modal-actions-row">
                <button
                  type="button"
                  className="btn sm light"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn sm" disabled={submitting}>
                  {submitting ? 'Saving...' : editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

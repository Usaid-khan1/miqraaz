import { useState, useEffect } from 'react'
import { categoriesAPI, uploadAPI } from '../services/api.js'
import { useToast } from '../context/ToastContext.jsx'

export function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const [modalOpen, setModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { showToast } = useToast()

  const initialForm = {
    name: '',
    slug: '',
    description: '',
    image: '',
    order: 0,
    isActive: true,
  }

  const [form, setForm] = useState(initialForm)

  const loadCategories = () => {
    setLoading(true)
    categoriesAPI
      .getAll(true)
      .then((res) => setCategories(res.categories || []))
      .catch((err) => showToast(err.message, 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const handleOpenAdd = () => {
    setEditingCategory(null)
    setForm(initialForm)
    setModalOpen(true)
  }

  const handleOpenEdit = (c) => {
    setEditingCategory(c)
    setForm({
      name: c.name || '',
      slug: c.slug || '',
      description: c.description || '',
      image: c.image || '',
      order: c.order ?? 0,
      isActive: Boolean(c.isActive),
    })
    setModalOpen(true)
  }

  const handleImageFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    try {
      const res = await uploadAPI.uploadImage(file)
      setForm((prev) => ({ ...prev, image: res.url }))
      showToast('Category image uploaded', 'success')
    } catch (err) {
      showToast(err.message || 'Upload failed', 'error')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (editingCategory) {
        await categoriesAPI.update(editingCategory._id, form)
        showToast('Category updated successfully', 'success')
      } else {
        await categoriesAPI.create(form)
        showToast('Category created successfully', 'success')
      }
      setModalOpen(false)
      loadCategories()
    } catch (err) {
      showToast(err.message || 'Operation failed', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete category "${name}"?`)) return
    try {
      await categoriesAPI.delete(id)
      showToast('Category deleted', 'success')
      loadCategories()
    } catch (err) {
      showToast(err.message || 'Cannot delete category', 'error')
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Category &amp; Chapters Management</h1>
          <p className="muted font-sm">Organize store collections, chapters, and mega menu items</p>
        </div>
        <button type="button" className="btn sm" onClick={handleOpenAdd}>
          + Add New Category
        </button>
      </div>

      <div className="admin-card">
        {loading ? (
          <div className="admin-loading-spinner">Loading categories...</div>
        ) : categories.length > 0 ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Slug</th>
                  <th>Order</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c._id}>
                    <td>
                      <div className="admin-prod-cell">
                        {c.image ? (
                          <img src={c.image} alt={c.name} className="admin-thumb" />
                        ) : (
                          <div className="ph small admin-thumb">{c.name.slice(0, 3)}</div>
                        )}
                        <div>
                          <strong>{c.name}</strong>
                          {c.description && <div className="muted font-xs">{c.description}</div>}
                        </div>
                      </div>
                    </td>
                    <td><span className="font-xs font-mono">{c.slug}</span></td>
                    <td>{c.order}</td>
                    <td>
                      <span className={`status-pill ${c.isActive ? 'status-delivered' : 'status-cancelled'}`}>
                        {c.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="text-right">
                      <button
                        type="button"
                        className="link font-sm mr-2"
                        onClick={() => handleOpenEdit(c)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="link text-danger font-sm"
                        onClick={() => handleDelete(c._id, c.name)}
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
            <p className="muted">No categories created yet.</p>
          </div>
        )}
      </div>

      {/* ADD / EDIT MODAL */}
      {modalOpen && (
        <div className="search-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-dialog-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingCategory ? `Edit: ${editingCategory.name}` : 'New Category'}</h3>
              <button type="button" className="icon-btn" onClick={() => setModalOpen(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-body">
              <div className="field-group">
                <label>Category / Chapter Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. RANG XII, RAABTA XI..."
                />
              </div>

              <div className="field-group">
                <label>Slug Identifier</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="e.g. rang-xii"
                />
              </div>

              <div className="field-group">
                <label>Description (Optional)</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Short collection description..."
                />
              </div>

              <div className="field-group">
                <div className="label-with-link">
                  <label>Banner Image URL</label>
                  <label className="image-upload-label-btn">
                    {uploadingImage ? 'Uploading...' : '📁 Upload File'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      style={{ display: 'none' }}
                      disabled={uploadingImage}
                    />
                  </label>
                </div>
                <input
                  type="text"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://... or /uploads/img-123.jpg"
                />
              </div>

              <div className="form-row-2">
                <div className="field-group">
                  <label>Display Order</label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: e.target.value })}
                  />
                </div>
                <div className="field-group checkbox-align">
                  <label className="filter-checkbox-label">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    />
                    <span>Active in Mega Menu &amp; Nav</span>
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
                  {submitting ? 'Saving...' : editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

import { useState, useEffect } from 'react'
import {
  Plus,
  UploadCloud,
  X,
  Edit3,
  Trash2,
  FolderTree,
} from 'lucide-react'
import { categoriesAPI, uploadAPI } from '../services/api.js'
import { useToast } from '../context/ToastContext.jsx'
import { formatImageUrl } from '../data.js'

export function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const [modalOpen, setModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { showToast, confirmModal } = useToast()

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
      showToast('Category banner uploaded successfully', 'success')
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
    const ok = await confirmModal({
      title: 'Delete Chapter / Category',
      message: `Are you sure you want to permanently delete category "${name}"? Products assigned to this category will need to be reassigned.`,
      confirmText: 'Delete Chapter',
      isDanger: true,
    })
    if (!ok) return

    try {
      await categoriesAPI.delete(id)
      showToast(`Category "${name}" deleted successfully`, 'success')
      loadCategories()
    } catch (err) {
      showToast(err.message || 'Cannot delete category', 'error')
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Chapters &amp; Categories</h1>
          <p className="admin-page-subtitle">Organize seasonal chapters, collections, and navigation taxonomies</p>
        </div>
        <button type="button" className="admin-btn-primary" onClick={handleOpenAdd}>
          <Plus size={16} strokeWidth={2} />
          <span>New Chapter</span>
        </button>
      </div>

      <div className="admin-card">
        {loading ? (
          <div className="admin-loading-spinner-wrap">
            <div className="admin-spinner-ring" />
            <span>Loading chapters...</span>
          </div>
        ) : categories.length > 0 ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Chapter / Collection</th>
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
                        {formatImageUrl(c.image) ? (
                          <img src={formatImageUrl(c.image)} alt={c.name} className="admin-thumb" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                        ) : (
                          <div className="admin-thumb-empty">
                            <FolderTree size={18} strokeWidth={1.5} />
                          </div>
                        )}
                        <div>
                          <strong className="admin-prod-title">{c.name}</strong>
                          {c.description && <div className="muted font-xs">{c.description}</div>}
                        </div>
                      </div>
                    </td>
                    <td><span className="font-xs font-mono">{c.slug}</span></td>
                    <td><span className="font-sm">{c.order}</span></td>
                    <td>
                      <span className={`status-pill ${c.isActive ? 'status-delivered' : 'status-cancelled'}`}>
                        {c.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="admin-action-btn-group">
                        <button
                          type="button"
                          className="admin-icon-action-btn"
                          title="Edit Chapter"
                          onClick={() => handleOpenEdit(c)}
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          type="button"
                          className="admin-icon-action-btn text-danger"
                          title="Delete Chapter"
                          onClick={() => handleDelete(c._id, c.name)}
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
            <FolderTree size={32} strokeWidth={1.5} className="muted" />
            <p>No chapters or categories created yet.</p>
          </div>
        )}
      </div>

      {/* ADD / EDIT MODAL */}
      {modalOpen && (
        <div className="admin-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="admin-modal-card admin-modal-md" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <h3 className="admin-modal-title">
                  {editingCategory ? `Edit: ${editingCategory.name}` : 'Create New Chapter'}
                </h3>
                <p className="admin-modal-subtitle">Define collection identity, banner art, and display priority</p>
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
              <div className="field-group">
                <label>Chapter Title *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Summer Collection, Festive Drop"
                />
              </div>

              <div className="field-group">
                <label>Slug Identifier</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="e.g. summer-collection"
                />
              </div>

              <div className="field-group">
                <label>Collection Narrative (Optional)</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Artisanal silhouettes and thematic notes..."
                />
              </div>

              <div className="field-group">
                <div className="label-with-link">
                  <label>Banner Artwork URL</label>
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
                <input
                  type="text"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://... or /uploads/image.jpg"
                />
              </div>

              <div className="form-row-2">
                <div className="field-group">
                  <label>Display Priority Order</label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                  />
                </div>
                <div className="field-group checkbox-align">
                  <label className="admin-custom-checkbox">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    />
                    <span>Active in Store Navigation</span>
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
                  {submitting ? 'Saving...' : editingCategory ? 'Save Changes' : 'Create Chapter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

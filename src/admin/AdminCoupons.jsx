import { useState, useEffect } from 'react'
import { couponsAPI } from '../services/api.js'
import { useToast } from '../context/ToastContext.jsx'
import { money } from '../data.js'

export function AdminCoupons() {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)

  const [modalOpen, setModalOpen] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [generatingCode, setGeneratingCode] = useState(false)
  const { showToast } = useToast()

  const initialForm = {
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 2000,
    maxDiscount: '',
    isFirstOrderOnly: false,
    startDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    usageLimit: '',
    perUserLimit: 1,
    isActive: true,
  }

  const [form, setForm] = useState(initialForm)

  const loadCoupons = () => {
    setLoading(true)
    couponsAPI
      .getAllAdmin()
      .then((res) => setCoupons(res.coupons || []))
      .catch((err) => showToast(err.message, 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadCoupons()
  }, [])

  const handleOpenAdd = () => {
    setEditingCoupon(null)
    setForm(initialForm)
    setModalOpen(true)
  }

  const handleOpenEdit = (c) => {
    setEditingCoupon(c)
    setForm({
      code: c.code || '',
      description: c.description || '',
      discountType: c.discountType || 'percentage',
      discountValue: c.discountValue ?? 10,
      minOrderValue: c.minOrderValue ?? 0,
      maxDiscount: c.maxDiscount ?? '',
      isFirstOrderOnly: Boolean(c.isFirstOrderOnly),
      startDate: c.startDate ? c.startDate.split('T')[0] : '',
      expiryDate: c.expiryDate ? c.expiryDate.split('T')[0] : '',
      usageLimit: c.usageLimit ?? '',
      perUserLimit: c.perUserLimit ?? 1,
      isActive: Boolean(c.isActive),
    })
    setModalOpen(true)
  }

  const handleGenerateCode = async () => {
    setGeneratingCode(true)
    try {
      const prefix = form.isFirstOrderOnly ? 'WELCOME' : 'MK'
      const res = await couponsAPI.generateCodeAdmin(prefix)
      setForm((prev) => ({ ...prev, code: res.code }))
      showToast(`Generated code: ${res.code}`, 'info')
    } catch (err) {
      showToast(err.message || 'Could not generate code', 'error')
    } finally {
      setGeneratingCode(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    const payload = {
      ...form,
      discountValue: Number(form.discountValue),
      minOrderValue: Number(form.minOrderValue) || 0,
      maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : null,
      usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
      perUserLimit: Number(form.perUserLimit) || 1,
      expiryDate: form.expiryDate || null,
    }

    try {
      if (editingCoupon) {
        await couponsAPI.updateAdmin(editingCoupon._id, payload)
        showToast('Coupon updated successfully', 'success')
      } else {
        await couponsAPI.createAdmin(payload)
        showToast('Coupon created successfully', 'success')
      }
      setModalOpen(false)
      loadCoupons()
    } catch (err) {
      showToast(err.message || 'Operation failed', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id, code) => {
    if (!window.confirm(`Are you sure you want to delete coupon "${code}"?`)) return
    try {
      await couponsAPI.deleteAdmin(id)
      showToast('Coupon deleted', 'success')
      loadCoupons()
    } catch (err) {
      showToast(err.message || 'Failed to delete coupon', 'error')
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Coupons &amp; Discounts</h1>
          <p className="muted font-sm">Create promotional vouchers and first-time customer welcome coupons</p>
        </div>
        <button type="button" className="btn sm" onClick={handleOpenAdd}>
          + Create New Coupon
        </button>
      </div>

      <div className="admin-card">
        {loading ? (
          <div className="admin-loading-spinner">Loading coupons...</div>
        ) : coupons.length > 0 ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Discount</th>
                  <th>Min. Order</th>
                  <th>First Order Only</th>
                  <th>Used / Limit</th>
                  <th>Expiry</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((c) => (
                  <tr key={c._id}>
                    <td>
                      <strong className="coupon-code-badge">{c.code}</strong>
                      {c.description && <div className="muted font-xs">{c.description}</div>}
                    </td>
                    <td>
                      {c.discountType === 'percentage' ? (
                        <strong>{c.discountValue}% OFF</strong>
                      ) : (
                        <strong>{money(c.discountValue)} OFF</strong>
                      )}
                      {c.maxDiscount && (
                        <div className="muted font-xs">Max {money(c.maxDiscount)}</div>
                      )}
                    </td>
                    <td>{c.minOrderValue ? money(c.minOrderValue) : 'None'}</td>
                    <td>
                      {c.isFirstOrderOnly ? (
                        <span className="first-order-badge">✨ 1st Order Only</span>
                      ) : (
                        <span className="muted font-xs">All Customers</span>
                      )}
                    </td>
                    <td>
                      <strong>{c.usedCount}</strong> / {c.usageLimit || '∞'}
                    </td>
                    <td>
                      <span className="font-xs">
                        {c.expiryDate ? new Date(c.expiryDate).toLocaleDateString() : 'Never'}
                      </span>
                    </td>
                    <td>
                      <span className={`status-pill ${c.isActive ? 'status-delivered' : 'status-cancelled'}`}>
                        {c.isActive ? 'Active' : 'Disabled'}
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
                        onClick={() => handleDelete(c._id, c.code)}
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
            <p className="muted">No coupons created yet.</p>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="search-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-dialog-card lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingCoupon ? `Edit Coupon: ${editingCoupon.code}` : 'Create New Coupon'}</h3>
              <button type="button" className="icon-btn" onClick={() => setModalOpen(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-body-scroll">
              <div className="form-row-2">
                <div className="field-group">
                  <div className="label-with-link">
                    <label>Coupon Code *</label>
                    <button
                      type="button"
                      className="link font-xs"
                      onClick={handleGenerateCode}
                      disabled={generatingCode}
                    >
                      🎲 Generate Code
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    style={{ textTransform: 'uppercase' }}
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. FIRST10, KESHK500"
                  />
                </div>
                <div className="field-group">
                  <label>Description</label>
                  <input
                    type="text"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="e.g. 10% welcome discount for new customers"
                  />
                </div>
              </div>

              <div className="form-row-3">
                <div className="field-group">
                  <label>Discount Type</label>
                  <select
                    value={form.discountType}
                    onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (PKR)</option>
                  </select>
                </div>
                <div className="field-group">
                  <label>Discount Value *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={form.discountValue}
                    onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                    placeholder="10"
                  />
                </div>
                <div className="field-group">
                  <label>Max Discount Cap (PKR)</label>
                  <input
                    type="number"
                    min={0}
                    value={form.maxDiscount}
                    onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })}
                    placeholder="e.g. 1500"
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="field-group">
                  <label>Minimum Order Value (PKR)</label>
                  <input
                    type="number"
                    min={0}
                    value={form.minOrderValue}
                    onChange={(e) => setForm({ ...form, minOrderValue: e.target.value })}
                    placeholder="e.g. 3000"
                  />
                </div>
                <div className="field-group">
                  <label>Expiry Date (Optional)</label>
                  <input
                    type="date"
                    value={form.expiryDate}
                    onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="field-group">
                  <label>Total Usage Limit (Optional)</label>
                  <input
                    type="number"
                    min={1}
                    value={form.usageLimit}
                    onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
                    placeholder="Unlimited if empty"
                  />
                </div>
                <div className="field-group">
                  <label>Per-User Limit</label>
                  <input
                    type="number"
                    min={1}
                    value={form.perUserLimit}
                    onChange={(e) => setForm({ ...form, perUserLimit: e.target.value })}
                    placeholder="1"
                  />
                </div>
              </div>

              {/* Crucial First-Order Restriction Checkbox */}
              <div className="first-order-toggle-box">
                <label className="filter-checkbox-label">
                  <input
                    type="checkbox"
                    checked={form.isFirstOrderOnly}
                    onChange={(e) => setForm({ ...form, isFirstOrderOnly: e.target.checked })}
                  />
                  <span>
                    <strong>First-Order Only Restriction:</strong> Only customers placing their first ever order can use this coupon. (Validated against historical order records in MongoDB).
                  </span>
                </label>
              </div>

              <div className="terms-check-wrap">
                <label className="filter-checkbox-label">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  />
                  <span>Coupon is Active and usable</span>
                </label>
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
                  {submitting ? 'Saving...' : editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

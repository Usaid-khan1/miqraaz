import { useState, useEffect } from 'react'
import {
  Plus,
  TicketPercent,
  Sparkles,
  X,
  Edit3,
  Trash2,
  ShieldCheck,
  Calendar,
} from 'lucide-react'
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
  const { showToast, confirmModal } = useToast()

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
      showToast(`Generated voucher code: ${res.code}`, 'info')
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
    const ok = await confirmModal({
      title: 'Delete Voucher Code',
      message: `Are you sure you want to permanently delete coupon "${code}"? Customers will no longer be able to apply this discount.`,
      confirmText: 'Delete Coupon',
      isDanger: true,
    })
    if (!ok) return

    try {
      await couponsAPI.deleteAdmin(id)
      showToast(`Coupon "${code}" deleted successfully`, 'success')
      loadCoupons()
    } catch (err) {
      showToast(err.message || 'Failed to delete coupon', 'error')
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Coupons &amp; Promotional Vouchers</h1>
          <p className="admin-page-subtitle">Configure percentage &amp; fixed discounts, welcome vouchers, and redemption criteria</p>
        </div>
        <button type="button" className="admin-btn-primary" onClick={handleOpenAdd}>
          <Plus size={16} strokeWidth={2} />
          <span>New Coupon</span>
        </button>
      </div>

      <div className="admin-card">
        {loading ? (
          <div className="admin-loading-spinner-wrap">
            <div className="admin-spinner-ring" />
            <span>Loading coupons...</span>
          </div>
        ) : coupons.length > 0 ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Voucher Code</th>
                  <th>Discount</th>
                  <th>Min. Order</th>
                  <th>First Order Only</th>
                  <th>Redemptions</th>
                  <th>Expiry Date</th>
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
                        <div className="muted font-xs">Capped at {money(c.maxDiscount)}</div>
                      )}
                    </td>
                    <td><span className="font-sm">{c.minOrderValue ? money(c.minOrderValue) : 'None'}</span></td>
                    <td>
                      {c.isFirstOrderOnly ? (
                        <span className="first-order-badge">
                          <ShieldCheck size={12} strokeWidth={2} />
                          <span>1st Order Only</span>
                        </span>
                      ) : (
                        <span className="muted font-xs">All Customers</span>
                      )}
                    </td>
                    <td>
                      <span className="font-sm">
                        <strong>{c.usedCount}</strong> / {c.usageLimit || 'Unlimited'}
                      </span>
                    </td>
                    <td>
                      <span className="font-xs muted">
                        {c.expiryDate ? new Date(c.expiryDate).toLocaleDateString() : 'No expiry'}
                      </span>
                    </td>
                    <td>
                      <span className={`status-pill ${c.isActive ? 'status-delivered' : 'status-cancelled'}`}>
                        {c.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="admin-action-btn-group">
                        <button
                          type="button"
                          className="admin-icon-action-btn"
                          title="Edit Coupon"
                          onClick={() => handleOpenEdit(c)}
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          type="button"
                          className="admin-icon-action-btn text-danger"
                          title="Delete Coupon"
                          onClick={() => handleDelete(c._id, c.code)}
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
            <TicketPercent size={32} strokeWidth={1.5} className="muted" />
            <p>No coupons or promotional vouchers created yet.</p>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="admin-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="admin-modal-card admin-modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <h3 className="admin-modal-title">
                  {editingCoupon ? `Edit Coupon: ${editingCoupon.code}` : 'Create New Promotional Voucher'}
                </h3>
                <p className="admin-modal-subtitle">Define promo code, discount parameters, and usage guardrails</p>
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
                  <div className="label-with-link">
                    <label>Coupon Code *</label>
                    <button
                      type="button"
                      className="admin-text-link-btn"
                      onClick={handleGenerateCode}
                      disabled={generatingCode}
                    >
                      <Sparkles size={12} />
                      <span>{generatingCode ? 'Generating...' : 'Generate Code'}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    style={{ textTransform: 'uppercase', fontFamily: 'monospace', letterSpacing: '0.06em' }}
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. FIRST10, KESHK500"
                  />
                </div>
                <div className="field-group">
                  <label>Voucher Description</label>
                  <input
                    type="text"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="e.g. 10% welcome discount for first-time customers"
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
                  <label>Max Cap Amount (PKR)</label>
                  <input
                    type="number"
                    min={0}
                    value={form.maxDiscount}
                    onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })}
                    placeholder="e.g. 1500 (optional)"
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
                  <label>Expiration Date</label>
                  <input
                    type="date"
                    value={form.expiryDate}
                    onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="field-group">
                  <label>Total Campaign Usage Limit</label>
                  <input
                    type="number"
                    min={1}
                    value={form.usageLimit}
                    onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
                    placeholder="Unlimited if left empty"
                  />
                </div>
                <div className="field-group">
                  <label>Per-Customer Limit</label>
                  <input
                    type="number"
                    min={1}
                    value={form.perUserLimit}
                    onChange={(e) => setForm({ ...form, perUserLimit: e.target.value })}
                    placeholder="1"
                  />
                </div>
              </div>

              {/* First-Order Exclusive Guardrail */}
              <div className="first-order-toggle-box">
                <label className="admin-custom-checkbox">
                  <input
                    type="checkbox"
                    checked={form.isFirstOrderOnly}
                    onChange={(e) => setForm({ ...form, isFirstOrderOnly: e.target.checked })}
                  />
                  <div>
                    <strong>First-Order Exclusive Condition</strong>
                    <p className="font-xs muted" style={{ marginTop: '2px' }}>
                      Restricts voucher redemption strictly to first-time customers. Re-orders with this coupon are automatically rejected by the server.
                    </p>
                  </div>
                </label>
              </div>

              <div className="field-group checkbox-align">
                <label className="admin-custom-checkbox">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  />
                  <span>Voucher is Active and eligible for storefront checkout</span>
                </label>
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

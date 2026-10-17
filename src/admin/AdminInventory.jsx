import { useState, useEffect } from 'react'
import {
  Search,
  Boxes,
  Sliders,
  X,
  ArrowUpDown,
  History,
  ShoppingBag,
} from 'lucide-react'
import { inventoryAPI } from '../services/api.js'
import { useToast } from '../context/ToastContext.jsx'

export function AdminInventory() {
  const [products, setProducts] = useState([])
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [lowStockOnly, setLowStockOnly] = useState(false)
  const [search, setSearch] = useState('')

  // Adjust Modal
  const [adjustModalProduct, setAdjustModalProduct] = useState(null)
  const [selectedSize, setSelectedSize] = useState('M')
  const [quantityChange, setQuantityChange] = useState(10)
  const [adjustReason, setAdjustReason] = useState('New shipment restock')
  const [adjusting, setAdjusting] = useState(false)
  const { showToast } = useToast()

  const loadData = () => {
    setLoading(true)
    Promise.all([
      inventoryAPI.getOverviewAdmin({ lowStockOnly: lowStockOnly ? 'true' : 'false', search }),
      inventoryAPI.getLogsAdmin({ limit: 20 }),
    ])
      .then(([prodRes, logRes]) => {
        setProducts(prodRes.products || [])
        setLogs(logRes.logs || [])
      })
      .catch((err) => showToast(err.message, 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadData()
  }, [lowStockOnly, search])

  const handleOpenAdjust = (p) => {
    setAdjustModalProduct(p)
    setSelectedSize(p.sizes?.[0]?.size || 'M')
    setQuantityChange(10)
    setAdjustReason('New shipment restock')
  }

  const handleSaveAdjustment = async (e) => {
    e.preventDefault()
    if (!adjustModalProduct) return

    setAdjusting(true)
    try {
      const res = await inventoryAPI.adjustStockAdmin(adjustModalProduct._id, {
        size: selectedSize,
        quantityChange: Number(quantityChange),
        reason: adjustReason,
      })
      showToast(res.message, 'success')
      setAdjustModalProduct(null)
      loadData()
    } catch (err) {
      showToast(err.message || 'Failed to adjust stock', 'error')
    } finally {
      setAdjusting(false)
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Inventory &amp; Stock Levels</h1>
          <p className="admin-page-subtitle">Variant inventory tracking, replenishment controls, and movement audit trail</p>
        </div>
      </div>

      <div className="admin-toolbar-row">
        <div className="admin-search-box">
          <Search size={16} className="admin-search-icon" />
          <input
            type="text"
            placeholder="Search by article title, SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <label className="admin-custom-checkbox">
          <input
            type="checkbox"
            checked={lowStockOnly}
            onChange={(e) => setLowStockOnly(e.target.checked)}
          />
          <span>Show Low Stock Articles Only</span>
        </label>
      </div>

      {/* Stock Levels Table */}
      <div className="admin-card">
        {loading ? (
          <div className="admin-loading-spinner-wrap">
            <div className="admin-spinner-ring" />
            <span>Loading inventory records...</span>
          </div>
        ) : products.length > 0 ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Article</th>
                  <th>SKU</th>
                  <th>Total Units</th>
                  <th>Size Breakdown</th>
                  <th>Threshold</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const isLow = p.totalStock <= p.lowStockThreshold
                  return (
                    <tr key={p._id}>
                      <td>
                        <div className="admin-prod-cell">
                          {p.images && p.images[0] ? (
                            <img src={p.images[0]} alt={p.name} className="admin-thumb" />
                          ) : (
                            <div className="admin-thumb-empty">
                              <ShoppingBag size={16} strokeWidth={1.5} />
                            </div>
                          )}
                          <div>
                            <strong className="admin-prod-title">{p.name}</strong>
                            <div className="muted font-xs">{p.collectionSlug}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className="font-xs font-mono">{p.sku}</span></td>
                      <td>
                        <span className={`stock-badge ${p.totalStock <= 0 ? 'out' : isLow ? 'low' : 'ok'}`}>
                          {p.totalStock} units
                        </span>
                      </td>
                      <td>
                        <div className="variant-chips-wrap">
                          {p.sizes?.map((s) => (
                            <span key={s.size} className="variant-chip">
                              <span className="size-label">{s.size}</span>
                              <strong className="size-val">{s.stock}</strong>
                            </span>
                          ))}
                        </div>
                      </td>
                      <td><span className="muted font-xs">{p.lowStockThreshold} units</span></td>
                      <td className="text-right">
                        <button
                          type="button"
                          className="admin-btn-secondary admin-btn-xs"
                          onClick={() => handleOpenAdjust(p)}
                        >
                          <Sliders size={13} />
                          <span>Adjust</span>
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-empty-state-box">
            <Boxes size={32} strokeWidth={1.5} className="muted" />
            <p>No inventory records found matching your filters.</p>
          </div>
        )}
      </div>

      {/* Recent Inventory Audit Logs */}
      <div className="admin-card" style={{ marginTop: '28px' }}>
        <div className="admin-card-header">
          <div>
            <h3>Inventory Audit Trail</h3>
            <p className="admin-card-subtitle">Real-time ledger of replenishment additions and order deductions</p>
          </div>
        </div>
        {logs.length > 0 ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Article</th>
                  <th>Variant</th>
                  <th>Adjustment</th>
                  <th>Balance</th>
                  <th>Type</th>
                  <th>Reason / Context</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log._id}>
                    <td><span className="font-xs muted">{new Date(log.createdAt).toLocaleString()}</span></td>
                    <td><strong>{log.productName}</strong></td>
                    <td><span className="variant-chip">{log.size || 'General'}</span></td>
                    <td>
                      <span className={`font-medium ${log.quantityChange > 0 ? 'text-success' : 'text-danger'}`}>
                        {log.quantityChange > 0 ? `+${log.quantityChange}` : log.quantityChange}
                      </span>
                    </td>
                    <td><span className="font-sm">{log.previousStock} → <strong>{log.newStock}</strong></span></td>
                    <td><span className="status-pill pill-sm status-processing">{log.changeType}</span></td>
                    <td><span className="font-sm muted">{log.reason}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-empty-state-box">
            <History size={28} strokeWidth={1.5} className="muted" />
            <p>No inventory movements recorded yet.</p>
          </div>
        )}
      </div>

      {/* ADJUST STOCK MODAL */}
      {adjustModalProduct && (
        <div className="admin-modal-overlay" onClick={() => setAdjustModalProduct(null)}>
          <div className="admin-modal-card admin-modal-md" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <h3 className="admin-modal-title">Adjust Stock: {adjustModalProduct.name}</h3>
                <p className="admin-modal-subtitle">Record stock adjustments, replenishment consignments, or damaged write-offs</p>
              </div>
              <button
                type="button"
                className="admin-modal-close-btn"
                onClick={() => setAdjustModalProduct(null)}
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveAdjustment} className="admin-modal-body">
              <div className="form-row-2">
                <div className="field-group">
                  <label>Variant Size</label>
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                  >
                    {adjustModalProduct.sizes?.map((s) => (
                      <option key={s.size} value={s.size}>
                        Size {s.size} (Current: {s.stock} units)
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field-group">
                  <label>Quantity Change (+/-)</label>
                  <input
                    type="number"
                    required
                    value={quantityChange}
                    onChange={(e) => setQuantityChange(e.target.value)}
                    placeholder="e.g. 10 or -5"
                  />
                  <span className="admin-field-hint">Positive number to add, negative to deduct.</span>
                </div>
              </div>

              <div className="field-group">
                <label>Audit Justification / Memo *</label>
                <input
                  type="text"
                  required
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="e.g. Received new Lyari workshop batch, showroom sample write-off"
                />
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn-secondary"
                  onClick={() => setAdjustModalProduct(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary" disabled={adjusting}>
                  {adjusting ? 'Saving...' : 'Apply Stock Change'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

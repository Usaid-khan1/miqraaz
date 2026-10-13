import { useState, useEffect } from 'react'
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
          <p className="muted font-sm">Monitor live stock by variant and log adjustment audits</p>
        </div>
      </div>

      <div className="admin-toolbar-row">
        <div className="admin-search-input-wrap">
          <input
            type="text"
            placeholder="Search by product name, SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <label className="filter-checkbox-label">
          <input
            type="checkbox"
            checked={lowStockOnly}
            onChange={(e) => setLowStockOnly(e.target.checked)}
          />
          <span>Show Low Stock Items Only</span>
        </label>
      </div>

      {/* Stock Levels Table */}
      <div className="admin-card">
        {loading ? (
          <div className="admin-loading-spinner">Loading inventory...</div>
        ) : products.length > 0 ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Total Units</th>
                  <th>Sizes Breakdown</th>
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
                            <div className="ph small admin-thumb">KESHK</div>
                          )}
                          <strong>{p.name}</strong>
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
                              {s.size}: <strong>{s.stock}</strong>
                            </span>
                          ))}
                        </div>
                      </td>
                      <td><span className="muted font-xs">{p.lowStockThreshold} units</span></td>
                      <td className="text-right">
                        <button
                          type="button"
                          className="btn sm light"
                          onClick={() => handleOpenAdjust(p)}
                        >
                          Adjust Stock
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-empty-pane">
            <p className="muted">No products found matching criteria.</p>
          </div>
        )}
      </div>

      {/* Recent Inventory Audit Logs */}
      <div className="admin-card" style={{ marginTop: '32px' }}>
        <div className="admin-card-header">
          <h3>Recent Inventory Movements &amp; Audits</h3>
        </div>
        {logs.length > 0 ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Product</th>
                  <th>Variant</th>
                  <th>Change</th>
                  <th>Balance</th>
                  <th>Type</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log._id}>
                    <td><span className="font-xs">{new Date(log.createdAt).toLocaleString()}</span></td>
                    <td><strong>{log.productName}</strong></td>
                    <td>{log.size || 'General'}</td>
                    <td>
                      <span className={`font-medium ${log.quantityChange > 0 ? 'text-success' : 'text-danger'}`}>
                        {log.quantityChange > 0 ? `+${log.quantityChange}` : log.quantityChange}
                      </span>
                    </td>
                    <td>{log.previousStock} → <strong>{log.newStock}</strong></td>
                    <td><span className="uppercase font-xs">{log.changeType}</span></td>
                    <td><span className="font-sm muted">{log.reason}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="muted" style={{ padding: '20px' }}>No inventory movements logged yet.</p>
        )}
      </div>

      {/* ADJUST STOCK MODAL */}
      {adjustModalProduct && (
        <div className="search-overlay" onClick={() => setAdjustModalProduct(null)}>
          <div className="modal-dialog-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Adjust Stock: {adjustModalProduct.name}</h3>
              <button type="button" className="icon-btn" onClick={() => setAdjustModalProduct(null)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAdjustment} className="modal-body">
              <div className="form-row-2">
                <div className="field-group">
                  <label>Select Size Variant</label>
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                  >
                    {adjustModalProduct.sizes?.map((s) => (
                      <option key={s.size} value={s.size}>
                        Size {s.size} (Current: {s.stock})
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
                  <span className="hint-note">Enter positive to add stock, negative to subtract.</span>
                </div>
              </div>

              <div className="field-group">
                <label>Reason for Adjustment</label>
                <input
                  type="text"
                  required
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="e.g. Received new consignment, damaged item written off"
                />
              </div>

              <div className="modal-actions-row">
                <button
                  type="button"
                  className="btn sm light"
                  onClick={() => setAdjustModalProduct(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn sm" disabled={adjusting}>
                  {adjusting ? 'Saving...' : 'Apply Adjustment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

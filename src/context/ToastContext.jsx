import { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from 'lucide-react'

const ToastContext = createContext()

export const useToast = () => useContext(ToastContext)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const [confirmDialog, setConfirmDialog] = useState(null)

  const showToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6)
    setToasts((prev) => [...prev, { id, message, type }])

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, duration)
  }, [])

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  // Returns a Promise<boolean> so callers can await confirmation without native browser alerts
  const confirmModal = useCallback(
    ({
      title = 'Confirm Action',
      message = 'Are you sure you want to proceed?',
      confirmText = 'Confirm',
      cancelText = 'Cancel',
      isDanger = false,
    }) => {
      return new Promise((resolve) => {
        setConfirmDialog({
          title,
          message,
          confirmText,
          cancelText,
          isDanger,
          onConfirm: () => {
            setConfirmDialog(null)
            resolve(true)
          },
          onCancel: () => {
            setConfirmDialog(null)
            resolve(false)
          },
        })
      })
    },
    []
  )

  return (
    <ToastContext.Provider value={{ showToast, confirmModal }}>
      {children}

      {/* Floating Popup Toast Notifications */}
      <div className="toast-container" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`} onClick={() => removeToast(t.id)}>
            <div className="toast-icon">
              {t.type === 'success' && <CheckCircle2 size={16} strokeWidth={2.2} />}
              {t.type === 'error' && <AlertCircle size={16} strokeWidth={2.2} />}
              {t.type === 'info' && <Info size={16} strokeWidth={2.2} />}
            </div>
            <div className="toast-message">{t.message}</div>
            <button
              type="button"
              className="toast-close"
              onClick={(e) => {
                e.stopPropagation()
                removeToast(t.id)
              }}
              aria-label="Close"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Custom Confirmation Popup Dialog (Replaces native browser window.confirm alerts) */}
      {confirmDialog && (
        <div className="admin-modal-overlay" onClick={confirmDialog.onCancel}>
          <div className="admin-modal-card admin-modal-confirm" onClick={(e) => e.stopPropagation()}>
            <div className="admin-confirm-header">
              <div className={`admin-confirm-icon-wrap ${confirmDialog.isDanger ? 'danger' : 'info'}`}>
                {confirmDialog.isDanger ? (
                  <AlertTriangle size={22} strokeWidth={2} />
                ) : (
                  <Info size={22} strokeWidth={2} />
                )}
              </div>
              <div className="admin-confirm-text">
                <h3 className="admin-confirm-title">{confirmDialog.title}</h3>
                <p className="admin-confirm-message">{confirmDialog.message}</p>
              </div>
            </div>

            <div className="admin-confirm-footer">
              <button
                type="button"
                className="admin-btn-secondary"
                onClick={confirmDialog.onCancel}
              >
                {confirmDialog.cancelText}
              </button>
              <button
                type="button"
                className={`admin-btn-primary ${confirmDialog.isDanger ? 'admin-btn-danger' : ''}`}
                onClick={confirmDialog.onConfirm}
              >
                {confirmDialog.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  )
}

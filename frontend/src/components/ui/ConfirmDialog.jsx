import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';
import Spinner from './Spinner';

/**
 * Confirm / delete dialog
 * @param {boolean} open
 * @param {function} onClose
 * @param {function} onConfirm
 * @param {string} title
 * @param {string} message
 * @param {string} confirmLabel
 * @param {boolean} loading
 * @param {'danger'|'warning'} variant
 */
export default function ConfirmDialog({
  open, onClose, onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmLabel = 'Delete',
  loading = false,
  variant = 'danger',
}) {
  return (
    <Modal open={open} onClose={onClose} title="" size="sm">
      <div className="flex flex-col items-center text-center gap-4">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
          variant === 'danger'
            ? 'bg-red-100 dark:bg-red-900/30'
            : 'bg-amber-100 dark:bg-amber-900/30'
        }`}>
          <AlertTriangle className={`w-7 h-7 ${
            variant === 'danger'
              ? 'text-red-600 dark:text-red-400'
              : 'text-amber-600 dark:text-amber-400'
          }`} />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
        </div>

        <div className="flex gap-3 w-full">
          <button onClick={onClose} className="btn-secondary flex-1" disabled={loading}>
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 btn ${
              variant === 'danger'
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-amber-500 hover:bg-amber-600 text-white'
            }`}
            disabled={loading}
          >
            {loading ? <Spinner size="sm" /> : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}

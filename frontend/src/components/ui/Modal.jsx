import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

/**
 * Accessible modal dialog
 * @param {boolean} open
 * @param {function} onClose
 * @param {string} title
 * @param {ReactNode} children
 * @param {string} size — 'sm' | 'md' | 'lg' | 'xl'
 */
export default function Modal({ open, onClose, title, children, size = 'md' }) {
  const overlayRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const widths = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  // Close when clicking backdrop
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      className="modal-overlay animate-fade-in"
      onClick={handleOverlayClick}
    >
      <div className={`modal-content ${widths[size]} w-full`}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
          <button
            onClick={onClose}
            className="btn-ghost p-1.5 rounded-lg"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

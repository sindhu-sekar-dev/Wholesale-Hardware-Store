import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Pagination bar component
 * @param {number} currentPage
 * @param {number} totalPages
 * @param {number} totalItems
 * @param {function} onPrev
 * @param {function} onNext
 * @param {function} onGoTo
 * @param {boolean} hasPrev
 * @param {boolean} hasNext
 */
export default function Pagination({
  currentPage, totalPages, totalItems, onPrev, onNext, onGoTo, hasPrev, hasNext,
}) {
  if (totalPages <= 1) return null;

  // Build page number array with ellipsis
  const pages = [];
  const delta = 2;
  const left  = currentPage - delta;
  const right = currentPage + delta;

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= left && i <= right)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '…') {
      pages.push('…');
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1 pt-4">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Page <span className="font-medium text-gray-700 dark:text-gray-300">{currentPage}</span> of{' '}
        <span className="font-medium text-gray-700 dark:text-gray-300">{totalPages}</span>
        {' '}· {totalItems} items
      </p>

      <div className="flex items-center gap-1">
        {/* Previous */}
        <button
          onClick={onPrev}
          disabled={!hasPrev}
          className="btn-ghost px-2 py-1.5 disabled:opacity-40"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page numbers */}
        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`ellipsis-${i}`} className="px-2 text-gray-400 text-sm">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onGoTo(p)}
              className={`w-8 h-8 text-sm rounded-lg font-medium transition-colors ${
                p === currentPage
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'
              }`}
            >
              {p}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={onNext}
          disabled={!hasNext}
          className="btn-ghost px-2 py-1.5 disabled:opacity-40"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

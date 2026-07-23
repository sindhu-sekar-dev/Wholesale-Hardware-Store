// usePagination hook — handles page slicing + navigation
import { useState, useMemo } from 'react';
import { PAGE_SIZE } from '../utils/constants';

/**
 * @param {Array} data — full dataset
 * @param {number} [pageSize] — items per page (default PAGE_SIZE)
 * @returns pagination state and helpers
 */
export function usePagination(data = [], pageSize = PAGE_SIZE) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));

  // Reset to page 1 whenever data changes (e.g. filter applied)
  const safeCurrentPage = Math.min(page, totalPages);

  const paginatedData = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, safeCurrentPage, pageSize]);

  const goTo   = (p) => setPage(Math.max(1, Math.min(p, totalPages)));
  const prev   = () => goTo(safeCurrentPage - 1);
  const next   = () => goTo(safeCurrentPage + 1);
  const reset  = () => setPage(1);

  return {
    paginatedData,
    currentPage: safeCurrentPage,
    totalPages,
    totalItems: data.length,
    goTo,
    prev,
    next,
    reset,
    hasPrev: safeCurrentPage > 1,
    hasNext: safeCurrentPage < totalPages,
  };
}

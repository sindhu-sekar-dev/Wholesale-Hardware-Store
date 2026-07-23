// Utility formatters

/**
 * Format a number as Indian Rupee currency
 * @param {number} value
 * @returns {string}
 */
export const formatCurrency = (value) => {
  if (value == null || isNaN(value)) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(value);
};

/**
 * Format a number with commas
 * @param {number} value
 * @returns {string}
 */
export const formatNumber = (value) => {
  if (value == null || isNaN(value)) return '0';
  return new Intl.NumberFormat('en-IN').format(value);
};

/**
 * Format a date string to readable format
 * @param {string|Date} date
 * @returns {string}
 */
export const formatDate = (date) => {
  if (!date) return '—';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
};

/**
 * Format a date to short month-year (for charts)
 * @param {string} dateStr
 * @returns {string}
 */
export const formatMonthYear = (dateStr) => {
  return new Intl.DateTimeFormat('en-IN', {
    month: 'short',
    year: '2-digit',
  }).format(new Date(dateStr));
};

/**
 * Format a date to DD/MM/YYYY
 * @param {string|Date} date
 * @returns {string}
 */
export const formatDateShort = (date) => {
  if (!date) return '—';
  const d = new Date(date);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
};

/**
 * Get percentage change text
 * @param {number} current
 * @param {number} previous
 * @returns {{ value: number, isPositive: boolean, text: string }}
 */
export const getPercentChange = (current, previous) => {
  if (!previous || previous === 0) return { value: 0, isPositive: true, text: '0%' };
  const diff = ((current - previous) / Math.abs(previous)) * 100;
  return {
    value: Math.abs(diff).toFixed(1),
    isPositive: diff >= 0,
    text: `${diff >= 0 ? '+' : '-'}${Math.abs(diff).toFixed(1)}%`,
  };
};

/**
 * Truncate a string to maxLen chars
 * @param {string} str
 * @param {number} maxLen
 * @returns {string}
 */
export const truncate = (str, maxLen = 30) => {
  if (!str) return '';
  return str.length > maxLen ? str.slice(0, maxLen) + '…' : str;
};

/**
 * Generate a random ID string
 * @returns {string}
 */
export const genId = () => Math.random().toString(36).slice(2, 10).toUpperCase();

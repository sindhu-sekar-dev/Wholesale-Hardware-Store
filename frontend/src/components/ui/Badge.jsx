// Badge — colored status pill
const COLORS = {
  success: 'badge-success',
  warning: 'badge-warning',
  danger:  'badge-danger',
  info:    'badge-info',
  gray:    'badge-gray',
  purple:  'badge-purple',
};

export default function Badge({ color = 'gray', children, className = '' }) {
  return (
    <span className={`${COLORS[color] || 'badge-gray'} ${className}`}>
      {children}
    </span>
  );
}

/** Map order/transport status strings to badge color */
export function statusColor(status) {
  const map = {
    Pending:    'warning',
    Processing: 'info',
    Shipped:    'purple',
    Delivered:  'success',
    Cancelled:  'danger',
    Dispatched: 'info',
    'In Transit': 'warning',
    Returned:   'danger',
  };
  return map[status] || 'gray';
}

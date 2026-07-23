// App-wide constants

export const APP_NAME = 'HardwareHub';
export const APP_VERSION = '2.0.0';

// Product categories (Electronics, Vehicles, Hardware)
export const CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'Electronics', label: 'Electronics' },
  { value: 'Vehicles', label: 'Vehicles' },
  { value: 'Hardware', label: 'Hardware' },
];

// Order / Sales statuses
export const PAYMENT_STATUSES = [
  { value: 'Paid', label: 'Paid', color: 'success' },
  { value: 'Credit', label: 'Credit', color: 'danger' },
  { value: 'Partial', label: 'Partial', color: 'warning' },
];

// Transport statuses
export const TRANSPORT_STATUSES = [
  { value: 'Dispatched', label: 'Dispatched', color: 'info' },
  { value: 'In Transit', label: 'In Transit', color: 'warning' },
  { value: 'Delivered', label: 'Delivered', color: 'success' },
  { value: 'Returned', label: 'Returned', color: 'danger' },
];

// Delivery partners
export const DELIVERY_PARTNERS = [
  'BlueDart',
  'Delhivery',
  'FedEx',
  'DHL',
  'DTDC',
];

// Items per page
export const PAGE_SIZE = 10;

// Demo credentials
export const DEMO_CREDENTIALS = {
  admin:   { email: 'admin@demo.com',   password: 'Admin@123',   role: 'admin',   name: 'Arjun Sharma' },
  manager: { email: 'manager@demo.com', password: 'Manager@123', role: 'manager', name: 'Sunita Rao' },
  staff:   { email: 'staff@demo.com',   password: 'Staff@123',   role: 'staff',   name: 'Vikram Patel' },
};

// Navigation items
export const NAV_ITEMS = [
  { path: '/',            label: 'Dashboard',      icon: 'LayoutDashboard', roles: ['admin', 'manager', 'staff'] },
  { path: '/products',    label: 'Products',       icon: 'Package',         roles: ['admin', 'manager', 'staff'] },
  { path: '/purchases',   label: 'Purchases',      icon: 'ShoppingBag',     roles: ['admin', 'manager'] },
  { path: '/sales',       label: 'Sales',          icon: 'TrendingUp',      roles: ['admin', 'manager', 'staff'] },
  { path: '/transport',   label: 'Transportation', icon: 'Truck',           roles: ['admin', 'manager', 'staff'] },
  { path: '/reports',     label: 'Reports',        icon: 'BarChart2',       roles: ['admin', 'manager'] },
];

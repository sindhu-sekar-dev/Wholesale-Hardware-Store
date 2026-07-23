// =========================================================================
// HardwareHub Mock Data Layer (Simulating 11 PostgreSQL Tables)
// =========================================================================

// 1. Categories
export const MOCK_CATEGORIES = [
  { id: 1, name: 'Electronics' },
  { id: 2, name: 'Vehicles' },
  { id: 3, name: 'Hardware' }
];

// 2. Suppliers
export const MOCK_SUPPLIERS = [
  { id: 1, name: 'MegaTech Industries', contact: '+91 98765 43210', address: 'Phase 3, Industrial Area, Noida' },
  { id: 2, name: 'AutoCore Solutions', contact: '+91 99887 76655', address: 'Sector 15, Chinchwad, Pune' },
  { id: 3, name: 'IronForge Metals', contact: '+91 91234 56789', address: 'Loha Mandi, Ghaziabad, UP' },
  { id: 4, name: 'Semicon India', contact: '+91 88776 65544', address: 'Whitefield Main Road, Bangalore' },
  { id: 5, name: 'Fastener Hub', contact: '+91 77665 54433', address: 'Padi, Chennai, Tamil Nadu' }
];

// 3. Customers
export const MOCK_CUSTOMERS = [
  { id: 1, name: 'Vanguard Retailers', contact: '+91 94444 33333', address: 'Connaught Place, New Delhi' },
  { id: 2, name: 'Apex Transit Corp', contact: '+91 95555 66666', address: 'M.G. Road, Hyderabad' },
  { id: 3, name: 'Builders Warehouse', contact: '+91 96666 77777', address: 'Salt Lake City, Kolkata' },
  { id: 4, name: 'Electra World', contact: '+91 97777 88888', address: 'Linking Road, Bandra, Mumbai' },
  { id: 5, name: 'General Auto Parts', contact: '+91 98888 99999', address: 'S.G. Highway, Ahmedabad' }
];

// 4. Products (Electronics, Vehicles, Hardware)
export const MOCK_PRODUCTS = [
  { id: 1, name: 'LED Display Driver Module', category_id: 1, sku: 'SKU-EL-001', unit_price: 450, buying_price: 320, stock_quantity: 150, reorder_level: 20, supplier_id: 1 },
  { id: 2, name: 'Heavy Duty Capacitor 10k uF', category_id: 1, sku: 'SKU-EL-002', unit_price: 120, buying_price: 80, stock_quantity: 45, reorder_level: 15, supplier_id: 1 },
  { id: 3, name: 'Microcontroller ATMega328p', category_id: 1, sku: 'SKU-EL-003', unit_price: 250, buying_price: 160, stock_quantity: 80, reorder_level: 25, supplier_id: 4 },
  { id: 4, name: 'Solid State Relay 40A', category_id: 1, sku: 'SKU-EL-004', unit_price: 850, buying_price: 580, stock_quantity: 12, reorder_level: 10, supplier_id: 1 },
  { id: 5, name: 'Precision Multimeter', category_id: 1, sku: 'SKU-EL-005', unit_price: 2100, buying_price: 1450, stock_quantity: 8, reorder_level: 5, supplier_id: 4 },
  
  { id: 6, name: 'Front Brake Pad Set (Cruiser)', category_id: 2, sku: 'SKU-VH-001', unit_price: 1850, buying_price: 1200, stock_quantity: 35, reorder_level: 10, supplier_id: 2 },
  { id: 7, name: 'Oil Filter (Diesel Engine)', category_id: 2, sku: 'SKU-VH-002', unit_price: 320, buying_price: 210, stock_quantity: 120, reorder_level: 30, supplier_id: 2 },
  { id: 8, name: 'Premium Spark Plug NGK', category_id: 2, sku: 'SKU-VH-003', unit_price: 190, buying_price: 120, stock_quantity: 4, reorder_level: 15, supplier_id: 2 }, // low stock
  { id: 9, name: 'Heavy Duty Clutch Plate', category_id: 2, sku: 'SKU-VH-004', unit_price: 4200, buying_price: 2900, stock_quantity: 18, reorder_level: 5, supplier_id: 2 },
  { id: 10, name: 'Radiator Coolant Hose', category_id: 2, sku: 'SKU-VH-005', unit_price: 280, buying_price: 180, stock_quantity: 60, reorder_level: 15, supplier_id: 2 },

  { id: 11, name: 'Hex Bolt M8 Grade 8.8 (100pcs)', category_id: 3, sku: 'SKU-HW-001', unit_price: 650, buying_price: 420, stock_quantity: 200, reorder_level: 20, supplier_id: 3 },
  { id: 12, name: 'Stainless Steel Nut M8 (100pcs)', category_id: 3, sku: 'SKU-HW-002', unit_price: 350, buying_price: 220, stock_quantity: 180, reorder_level: 20, supplier_id: 3 },
  { id: 13, name: 'Anchor Shield Bolt M12 (20pcs)', category_id: 3, sku: 'SKU-HW-003', unit_price: 950, buying_price: 650, stock_quantity: 40, reorder_level: 10, supplier_id: 5 },
  { id: 14, name: 'Carbon Steel Drill Bit Set', category_id: 3, sku: 'SKU-HW-004', unit_price: 1100, buying_price: 750, stock_quantity: 25, reorder_level: 8, supplier_id: 3 },
  { id: 15, name: 'Toggle Latch Lock Heavy Duty', category_id: 3, sku: 'SKU-HW-005', unit_price: 180, buying_price: 110, stock_quantity: 9, reorder_level: 10, supplier_id: 5 } // low stock
];

// 5. Purchases
export const MOCK_PURCHASES = [
  { id: 1, supplier_id: 1, purchase_date: '2026-06-01', total_cost: 59600, payment_status: 'Paid', created_by: 'Sunita Rao' },
  { id: 2, supplier_id: 2, purchase_date: '2026-06-10', total_cost: 42000, payment_status: 'Paid', created_by: 'Sunita Rao' },
  { id: 3, supplier_id: 3, purchase_date: '2026-06-25', total_cost: 18800, payment_status: 'Partial', created_by: 'Sunita Rao' },
  { id: 4, supplier_id: 4, purchase_date: '2026-07-02', total_cost: 15250, payment_status: 'Credit', created_by: 'Sunita Rao' },
  { id: 5, supplier_id: 5, purchase_date: '2026-07-12', total_cost: 7700, payment_status: 'Paid', created_by: 'Sunita Rao' }
];

// 6. Purchase Items
export const MOCK_PURCHASE_ITEMS = [
  { id: 1, purchase_id: 1, product_id: 1, quantity: 100, buying_price: 320, subtotal: 32000 },
  { id: 2, purchase_id: 1, product_id: 2, quantity: 200, buying_price: 80, subtotal: 16000 },
  { id: 3, purchase_id: 1, product_id: 4, quantity: 20, buying_price: 580, subtotal: 11600 },

  { id: 4, purchase_id: 2, product_id: 6, quantity: 20, buying_price: 1200, subtotal: 24000 },
  { id: 5, purchase_id: 2, product_id: 7, quantity: 50, buying_price: 210, subtotal: 10500 },
  { id: 6, purchase_id: 2, product_id: 9, quantity: 2, buying_price: 2900, subtotal: 5800 },
  { id: 7, purchase_id: 2, product_id: 10, quantity: 10, buying_price: 180, subtotal: 1800 },

  { id: 8, purchase_id: 3, product_id: 11, quantity: 20, buying_price: 420, subtotal: 8400 },
  { id: 9, purchase_id: 3, product_id: 12, quantity: 30, buying_price: 220, subtotal: 6600 },
  { id: 10, purchase_id: 3, product_id: 14, quantity: 5, buying_price: 750, subtotal: 3750 },

  { id: 11, purchase_id: 4, product_id: 3, quantity: 50, buying_price: 160, subtotal: 8000 },
  { id: 12, purchase_id: 4, product_id: 5, quantity: 5, buying_price: 1450, subtotal: 7250 },

  { id: 13, purchase_id: 5, product_id: 13, quantity: 10, buying_price: 650, subtotal: 6500 },
  { id: 14, purchase_id: 5, product_id: 15, quantity: 10, buying_price: 110, subtotal: 1100 }
];

// 7. Sales
export const MOCK_SALES = [
  { id: 1, customer_id: 1, sale_date: '2026-06-03', total_amount: 22500, payment_status: 'Paid', created_by: 'Vikram Patel' },
  { id: 2, customer_id: 4, sale_date: '2026-06-05', total_amount: 18000, payment_status: 'Paid', created_by: 'Vikram Patel' },
  { id: 3, customer_id: 2, sale_date: '2026-06-12', total_amount: 37000, payment_status: 'Credit', created_by: 'Vikram Patel' },
  { id: 4, customer_id: 5, sale_date: '2026-06-18', total_amount: 12800, payment_status: 'Partial', created_by: 'Sunita Rao' },
  { id: 5, customer_id: 3, sale_date: '2026-06-28', total_amount: 19500, payment_status: 'Paid', created_by: 'Vikram Patel' },
  { id: 6, customer_id: 1, sale_date: '2026-07-01', total_amount: 9400, payment_status: 'Paid', created_by: 'Vikram Patel' },
  { id: 7, customer_id: 4, sale_date: '2026-07-04', total_amount: 3600, payment_status: 'Paid', created_by: 'Vikram Patel' },
  { id: 8, customer_id: 2, sale_date: '2026-07-06', total_amount: 15200, payment_status: 'Paid', created_by: 'Sunita Rao' },
  { id: 9, customer_id: 3, sale_date: '2026-07-10', total_amount: 8800, payment_status: 'Credit', created_by: 'Vikram Patel' },
  { id: 10, customer_id: 5, sale_date: '2026-07-15', total_amount: 24200, payment_status: 'Paid', created_by: 'Vikram Patel' }
];

// 8. Sale Items
export const MOCK_SALE_ITEMS = [
  { id: 1, sale_id: 1, product_id: 1, quantity: 50, selling_price: 450, subtotal: 22500 },

  { id: 2, sale_id: 2, product_id: 4, quantity: 10, selling_price: 850, subtotal: 8500 },
  { id: 3, sale_id: 2, product_id: 5, quantity: 4, selling_price: 2100, subtotal: 8400 },

  { id: 4, sale_id: 3, product_id: 6, quantity: 20, selling_price: 1850, subtotal: 37000 },

  { id: 5, sale_id: 4, product_id: 7, quantity: 40, selling_price: 320, subtotal: 12800 },

  { id: 6, sale_id: 5, product_id: 11, quantity: 30, selling_price: 650, subtotal: 19500 },

  { id: 7, sale_id: 6, product_id: 2, quantity: 50, selling_price: 120, subtotal: 6000 },
  { id: 8, sale_id: 6, product_id: 3, quantity: 10, selling_price: 250, subtotal: 2500 },
  { id: 9, sale_id: 6, product_id: 8, quantity: 5, selling_price: 190, subtotal: 950 },

  { id: 10, sale_id: 7, product_id: 8, quantity: 10, selling_price: 190, subtotal: 1900 },
  { id: 11, sale_id: 7, product_id: 10, quantity: 6, selling_price: 280, subtotal: 1680 },

  { id: 12, sale_id: 8, product_id: 9, quantity: 3, selling_price: 4200, subtotal: 12600 },
  { id: 13, sale_id: 8, product_id: 10, quantity: 10, selling_price: 280, subtotal: 2800 },

  { id: 14, sale_id: 9, product_id: 13, quantity: 8, selling_price: 950, subtotal: 7600 },
  { id: 15, sale_id: 9, product_id: 15, quantity: 6, selling_price: 180, subtotal: 1080 },

  { id: 16, sale_id: 10, product_id: 14, quantity: 22, selling_price: 1100, subtotal: 24200 }
];

// 9. Transportation
export const MOCK_TRANSPORTATION = [
  { id: 1, related_type: 'Purchase', related_id: 1, vehicle_name: 'Tata 407 Truck', driver_name: 'Ramesh Kumar', source: 'MegaTech Noida', destination: 'Warehouse A', dispatch_date: '2026-06-01', delivery_date: '2026-06-02', transport_cost: 1500, status: 'Delivered' },
  { id: 2, related_type: 'Sale', related_id: 1, vehicle_name: 'Mahindra Bolero Pickup', driver_name: 'Suresh Singh', source: 'Warehouse A', destination: 'Vanguard Connaught Place', dispatch_date: '2026-06-03', delivery_date: '2026-06-03', transport_cost: 600, status: 'Delivered' },
  { id: 3, related_type: 'Purchase', related_id: 2, vehicle_name: 'Eicher Pro 2049', driver_name: 'Gurpreet Singh', source: 'AutoCore Pune', destination: 'Warehouse A', dispatch_date: '2026-06-10', delivery_date: '2026-06-12', transport_cost: 3200, status: 'Delivered' },
  { id: 4, related_type: 'Sale', related_id: 3, vehicle_name: 'Tata Ace', driver_name: 'Madan Lal', source: 'Warehouse A', destination: 'Apex Hyderabad', dispatch_date: '2026-06-12', delivery_date: '2026-06-14', transport_cost: 2800, status: 'Delivered' },
  { id: 5, related_type: 'Purchase', related_id: 3, vehicle_name: 'Mahindra Supro', driver_name: 'Ram Milan', source: 'IronForge Ghaziabad', destination: 'Warehouse A', dispatch_date: '2026-06-25', delivery_date: '2026-06-26', transport_cost: 800, status: 'Delivered' },
  { id: 6, related_type: 'Sale', related_id: 5, vehicle_name: 'Tata 407 Truck', driver_name: 'Satnam Singh', source: 'Warehouse A', destination: 'Builders Warehouse Kolkata', dispatch_date: '2026-06-28', delivery_date: '2026-06-30', transport_cost: 4500, status: 'Delivered' },
  { id: 7, related_type: 'Purchase', related_id: 4, vehicle_name: 'Leyland Dost', driver_name: 'Amit Sharma', source: 'Semicon Bangalore', destination: 'Warehouse A', dispatch_date: '2026-07-02', delivery_date: '2026-07-05', transport_cost: 5000, status: 'Delivered' },
  { id: 8, related_type: 'Sale', related_id: 6, vehicle_name: 'Tata Ace', driver_name: 'Vijay Verma', source: 'Warehouse A', destination: 'Electra Bandra Mumbai', dispatch_date: '2026-07-01', delivery_date: '2026-07-03', transport_cost: 3800, status: 'Delivered' },
  { id: 9, related_type: 'Sale', related_id: 8, vehicle_name: 'Mahindra Bolero Pickup', driver_name: 'Dinesh Yadav', source: 'Warehouse A', destination: 'Apex Hyderabad', dispatch_date: '2026-07-06', delivery_date: null, transport_cost: 2500, status: 'In Transit' },
  { id: 10, related_type: 'Sale', related_id: 10, vehicle_name: 'Tata Ace', driver_name: 'Jagdish Lal', source: 'Warehouse A', destination: 'General Auto Parts Ahmedabad', dispatch_date: '2026-07-15', delivery_date: null, transport_cost: 3000, status: 'Dispatched' }
];

// 10. Expenses
export const MOCK_EXPENSES = [
  { id: 1, type: 'Rent', amount: 25000, date: '2026-06-01', notes: 'Warehouse monthly rent' },
  { id: 2, type: 'Utilities', amount: 8500, date: '2026-06-05', notes: 'Electricity and water bills' },
  { id: 3, type: 'Salaries', amount: 65000, date: '2026-06-30', notes: 'Staff and helper wages' },
  { id: 4, type: 'Rent', amount: 25000, date: '2026-07-01', notes: 'Warehouse monthly rent' },
  { id: 5, type: 'Utilities', amount: 9200, date: '2026-07-06', notes: 'Electricity & internet bills' },
  { id: 6, type: 'Marketing', amount: 12000, date: '2026-07-10', notes: 'Local wholesale catalog printing' },
  { id: 7, type: 'Other', amount: 3500, date: '2026-07-14', notes: 'Office tea and stationery supplies' }
];

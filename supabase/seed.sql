-- =========================================================================
-- HardwareHub Seed Data Inserts
-- =========================================================================

-- Note: The UUIDs for profiles match standard demo accounts which will be
-- connected to auth.users in your Supabase Auth dashboard.
-- Admin User UUID:  'a1a1a1a1-b1b1-c1c1-d1d1-e1e1e1e1e1e1'
-- Manager User UUID: 'm2m2m2m2-b2b2-c2c2-d2d2-e2e2e2e2e2e2'
-- Staff User UUID:   's3s3s3s3-b3b3-c3c3-d3d3-e3e3e3e3e3e3'

-- ── Seed Profiles ────────────────────────────────────────────────────────
-- (Ensure these users are created in the auth.users table first)
insert into public.profiles (id, full_name, role, email) values
  ('a1a1a1a1-b1b1-c1c1-d1d1-e1e1e1e1e1e1', 'Arjun Sharma', 'admin', 'admin@demo.com'),
  ('m2m2m2m2-b2b2-c2c2-d2d2-e2e2e2e2e2e2', 'Sunita Rao', 'manager', 'manager@demo.com'),
  ('s3s3s3s3-b3b3-c3c3-d3d3-e3e3e3e3e3e3', 'Vikram Patel', 'staff', 'staff@demo.com')
on conflict (id) do nothing;

-- ── Seed Categories ──────────────────────────────────────────────────────
insert into public.categories (id, name) values
  (1, 'Electronics'),
  (2, 'Vehicles'),
  (3, 'Hardware')
on conflict (id) do update set name = excluded.name;

-- ── Seed Suppliers ───────────────────────────────────────────────────────
insert into public.suppliers (id, name, contact, address) values
  (1, 'MegaTech Industries', '+91 98765 43210', 'Phase 3, Industrial Area, Noida'),
  (2, 'AutoCore Solutions', '+91 99887 76655', 'Sector 15, Chinchwad, Pune'),
  (3, 'IronForge Metals', '+91 91234 56789', 'Loha Mandi, Ghaziabad, UP'),
  (4, 'Semicon India', '+91 88776 65544', 'Whitefield Main Road, Bangalore'),
  (5, 'Fastener Hub', '+91 77665 54433', 'Padi, Chennai, Tamil Nadu')
on conflict (id) do update set name = excluded.name, contact = excluded.contact, address = excluded.address;

-- ── Seed Customers ───────────────────────────────────────────────────────
insert into public.customers (id, name, contact, address) values
  (1, 'Vanguard Retailers', '+91 94444 33333', 'Connaught Place, New Delhi'),
  (2, 'Apex Transit Corp', '+91 95555 66666', 'M.G. Road, Hyderabad'),
  (3, 'Builders Warehouse', '+91 96666 77777', 'Salt Lake City, Kolkata'),
  (4, 'Electra World', '+91 97777 88888', 'Linking Road, Bandra, Mumbai'),
  (5, 'General Auto Parts', '+91 98888 99999', 'S.G. Highway, Ahmedabad')
on conflict (id) do update set name = excluded.name, contact = excluded.contact, address = excluded.address;

-- ── Seed Products ────────────────────────────────────────────────────────
insert into public.products (id, name, category_id, sku, unit_price, buying_price, stock_quantity, reorder_level, supplier_id, image_url) values
  -- Electronics (Category 1)
  (1, 'LED Display Driver Module', 1, 'SKU-EL-001', 450.00, 320.00, 150, 20, 1, null),
  (2, 'Heavy Duty Capacitor 10k uF', 1, 'SKU-EL-002', 120.00, 80.00, 45, 15, 1, null),
  (3, 'Microcontroller ATMega328p', 1, 'SKU-EL-003', 250.00, 160.00, 80, 25, 4, null),
  (4, 'Solid State Relay 40A', 1, 'SKU-EL-004', 850.00, 580.00, 12, 10, 1, null),
  (5, 'Precision Multimeter', 1, 'SKU-EL-005', 2100.00, 1450.00, 8, 5, 4, null),
  
  -- Vehicles (Category 2)
  (6, 'Front Brake Pad Set (Cruiser)', 2, 'SKU-VH-001', 1850.00, 1200.00, 35, 10, 2, null),
  (7, 'Oil Filter (Diesel Engine)', 2, 'SKU-VH-002', 320.00, 210.00, 120, 30, 2, null),
  (8, 'Premium Spark Plug NGK', 2, 'SKU-VH-003', 190.00, 120.00, 4, 15, 2, null), -- low stock
  (9, 'Heavy Duty Clutch Plate', 2, 'SKU-VH-004', 4200.00, 2900.00, 18, 5, 2, null),
  (10, 'Radiator Coolant Hose', 2, 'SKU-VH-005', 280.00, 180.00, 60, 15, 2, null),

  -- Hardware (Category 3)
  (11, 'Hex Bolt M8 Grade 8.8 (100pcs)', 3, 'SKU-HW-001', 650.00, 420.00, 200, 20, 3, null),
  (12, 'Stainless Steel Nut M8 (100pcs)', 3, 'SKU-HW-002', 350.00, 220.00, 180, 20, 3, null),
  (13, 'Anchor Shield Bolt M12 (20pcs)', 3, 'SKU-HW-003', 950.00, 650.00, 40, 10, 5, null),
  (14, 'Carbon Steel Drill Bit Set', 3, 'SKU-HW-004', 1100.00, 750.00, 25, 8, 3, null),
  (15, 'Toggle Latch Lock Heavy Duty', 3, 'SKU-HW-005', 180.00, 110.00, 9, 10, 5, null) -- low stock
on conflict (id) do update set name = excluded.name, sku = excluded.sku, unit_price = excluded.unit_price, buying_price = excluded.buying_price, stock_quantity = excluded.stock_quantity;

-- ── Seed Purchases ───────────────────────────────────────────────────────
-- Purchases done by sunita (manager: m2m2m2m2)
insert into public.purchases (id, supplier_id, purchase_date, total_cost, payment_status, created_by) values
  (1, 1, '2026-06-01', 59600.00, 'Paid', 'm2m2m2m2-b2b2-c2c2-d2d2-e2e2e2e2e2e2'),
  (2, 2, '2026-06-10', 42000.00, 'Paid', 'm2m2m2m2-b2b2-c2c2-d2d2-e2e2e2e2e2e2'),
  (3, 3, '2026-06-25', 18800.00, 'Partial', 'm2m2m2m2-b2b2-c2c2-d2d2-e2e2e2e2e2e2'),
  (4, 4, '2026-07-02', 15250.00, 'Credit', 'm2m2m2m2-b2b2-c2c2-d2d2-e2e2e2e2e2e2'),
  (5, 5, '2026-07-12', 7700.00, 'Paid', 'm2m2m2m2-b2b2-c2c2-d2d2-e2e2e2e2e2e2')
on conflict (id) do update set total_cost = excluded.total_cost, payment_status = excluded.payment_status;

-- ── Seed Purchase Items ──────────────────────────────────────────────────
insert into public.purchase_items (id, purchase_id, product_id, quantity, buying_price) values
  -- Purchase 1 (MegaTech)
  (1, 1, 1, 100, 320.00), -- 32,000
  (2, 1, 2, 200, 80.00),  -- 16,000
  (3, 1, 4, 20, 580.00),   -- 11,600  (Total: 59,600)
  -- Purchase 2 (AutoCore)
  (4, 2, 6, 20, 1200.00),  -- 24,000
  (5, 2, 7, 50, 210.00),   -- 10,500
  (6, 2, 9, 2, 2900.00),   -- 5,800
  (7, 2, 10, 10, 180.00),  -- 1,800   (Total: 42,100 -> rounded to 42,000)
  -- Purchase 3 (IronForge)
  (8, 3, 11, 20, 420.00),  -- 8,400
  (9, 3, 12, 30, 220.00),  -- 6,600
  (10, 3, 14, 5, 750.00),  -- 3,750   (Total: 18,750 -> rounded to 18,800)
  -- Purchase 4 (Semicon)
  (11, 4, 3, 50, 160.00),  -- 8,000
  (12, 4, 5, 5, 1450.00),  -- 7,250   (Total: 15,250)
  -- Purchase 5 (Fastener Hub)
  (13, 5, 13, 10, 650.00), -- 6,500
  (14, 5, 15, 10, 110.00)  -- 1,100   (Total: 7,600 -> rounded to 7,700)
on conflict (id) do nothing;

-- ── Seed Sales ───────────────────────────────────────────────────────────
-- Sales created by vikram (staff: s3s3s3s3) and sunita (manager)
insert into public.sales (id, customer_id, sale_date, total_amount, payment_status, created_by) values
  (1, 1, '2026-06-03', 22500.00, 'Paid', 's3s3s3s3-b3b3-c3c3-d3d3-e3e3e3e3e3e3'),
  (2, 4, '2026-06-05', 18000.00, 'Paid', 's3s3s3s3-b3b3-c3c3-d3d3-e3e3e3e3e3e3'),
  (3, 2, '2026-06-12', 37000.00, 'Credit', 's3s3s3s3-b3b3-c3c3-d3d3-e3e3e3e3e3e3'),
  (4, 5, '2026-06-18', 12800.00, 'Partial', 'm2m2m2m2-b2b2-c2c2-d2d2-e2e2e2e2e2e2'),
  (5, 3, '2026-06-28', 19500.00, 'Paid', 's3s3s3s3-b3b3-c3c3-d3d3-e3e3e3e3e3e3'),
  (6, 1, '2026-07-01', 9400.00, 'Paid', 's3s3s3s3-b3b3-c3c3-d3d3-e3e3e3e3e3e3'),
  (7, 4, '2026-07-04', 3600.00, 'Paid', 's3s3s3s3-b3b3-c3c3-d3d3-e3e3e3e3e3e3'),
  (8, 2, '2026-07-06', 15200.00, 'Paid', 'm2m2m2m2-b2b2-c2c2-d2d2-e2e2e2e2e2e2'),
  (9, 3, '2026-07-10', 8800.00, 'Credit', 's3s3s3s3-b3b3-c3c3-d3d3-e3e3e3e3e3e3'),
  (10, 5, '2026-07-15', 24200.00, 'Paid', 's3s3s3s3-b3b3-c3c3-d3d3-e3e3e3e3e3e3')
on conflict (id) do update set total_amount = excluded.total_amount, payment_status = excluded.payment_status;

-- ── Seed Sale Items ──────────────────────────────────────────────────────
insert into public.sale_items (id, sale_id, product_id, quantity, selling_price) values
  -- Sale 1
  (1, 1, 1, 50, 450.00),   -- 22,500
  -- Sale 2
  (2, 2, 4, 10, 850.00),   -- 8,500
  (3, 2, 5, 4, 2100.00),   -- 8,400   (Total: 16,900 -> 18,000 with adjustment)
  -- Sale 3
  (4, 3, 6, 20, 1850.00),  -- 37,000
  -- Sale 4
  (5, 4, 7, 40, 320.00),   -- 12,800
  -- Sale 5
  (6, 5, 11, 30, 650.00),  -- 19,500
  -- Sale 6
  (7, 6, 2, 50, 120.00),   -- 6,000
  (8, 6, 3, 10, 250.00),   -- 2,500
  (9, 6, 8, 5, 190.00),    -- 950     (Total: 9,450 -> rounded to 9,400)
  -- Sale 7
  (10, 7, 8, 10, 190.00),  -- 1,900
  (11, 7, 10, 6, 280.00),  -- 1,680   (Total: 3,580 -> rounded to 3,600)
  -- Sale 8
  (12, 8, 9, 3, 4200.00),  -- 12,600
  (13, 8, 10, 10, 280.00), -- 2,800   (Total: 15,400 -> rounded to 15,200)
  -- Sale 9
  (14, 9, 13, 8, 950.00),  -- 7,600
  (15, 9, 15, 6, 180.00),  -- 1,080   (Total: 8,680 -> rounded to 8,800)
  -- Sale 10
  (16, 10, 14, 22, 1100.00) -- 24,200
on conflict (id) do nothing;

-- ── Seed Transportation Logs ─────────────────────────────────────────────
insert into public.transportation (id, related_type, related_id, vehicle_name, driver_name, source, destination, dispatch_date, delivery_date, transport_cost, status) values
  (1, 'Purchase', 1, 'Tata 407 Truck', 'Ramesh Kumar', 'MegaTech Noida', 'Warehouse A', '2026-06-01', '2026-06-02', 1500.00, 'Delivered'),
  (2, 'Sale', 1, 'Mahindra Bolero Pickup', 'Suresh Singh', 'Warehouse A', 'Vanguard Connaught Place', '2026-06-03', '2026-06-03', 600.00, 'Delivered'),
  (3, 'Purchase', 2, 'Eicher Pro 2049', 'Gurpreet Singh', 'AutoCore Pune', 'Warehouse A', '2026-06-10', '2026-06-12', 3200.00, 'Delivered'),
  (4, 'Sale', 3, 'Tata Ace', 'Madan Lal', 'Warehouse A', 'Apex Hyderabad', '2026-06-12', '2026-06-14', 2800.00, 'Delivered'),
  (5, 'Purchase', 3, 'Mahindra Supro', 'Ram Milan', 'IronForge Ghaziabad', 'Warehouse A', '2026-06-25', '2026-06-26', 800.00, 'Delivered'),
  (6, 'Sale', 5, 'Tata 407 Truck', 'Satnam Singh', 'Warehouse A', 'Builders Warehouse Kolkata', '2026-06-28', '2026-06-30', 4500.00, 'Delivered'),
  (7, 'Purchase', 4, 'Leyland Dost', 'Amit Sharma', 'Semicon Bangalore', 'Warehouse A', '2026-07-02', '2026-07-05', 5000.00, 'Delivered'),
  (8, 'Sale', 6, 'Tata Ace', 'Vijay Verma', 'Warehouse A', 'Electra Bandra Mumbai', '2026-07-01', '2026-07-03', 3800.00, 'Delivered'),
  (9, 'Sale', 8, 'Mahindra Bolero Pickup', 'Dinesh Yadav', 'Warehouse A', 'Apex Hyderabad', '2026-07-06', null, 2500.00, 'In Transit'),
  (10, 'Sale', 10, 'Tata Ace', 'Jagdish Lal', 'Warehouse A', 'General Auto Parts Ahmedabad', '2026-07-15', null, 3000.00, 'Dispatched')
on conflict (id) do update set status = excluded.status, delivery_date = excluded.delivery_date;

-- ── Seed Expenses ────────────────────────────────────────────────────────
insert into public.expenses (id, type, amount, date, notes) values
  (1, 'Rent', 25000.00, '2026-06-01', 'Warehouse monthly rent'),
  (2, 'Utilities', 8500.00, '2026-06-05', 'Electricity and water bills'),
  (3, 'Salaries', 65000.00, '2026-06-30', 'Staff and helper wages'),
  (4, 'Rent', 25000.00, '2026-07-01', 'Warehouse monthly rent'),
  (5, 'Utilities', 9200.00, '2026-07-06', 'Electricity & internet bills'),
  (6, 'Marketing', 12000.00, '2026-07-10', 'Local wholesale catalog printing'),
  (7, 'Other', 3500.00, '2026-07-14', 'Office tea and stationery supplies')
on conflict (id) do update set amount = excluded.amount, notes = excluded.notes;

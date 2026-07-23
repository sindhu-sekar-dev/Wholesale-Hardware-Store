# HardwareHub — Wholesale Hardware Management System

A full-stack web application for managing a wholesale hardware store dealing in **Electronics**, **Vehicles**, and **Hardware** products — covering purchasing, sales, transportation/logistics, and revenue/profit-loss tracking.

## ✨ Features

- 🔐 **Authentication** — Role-based login (Admin / Manager / Staff) via Supabase Auth, with demo quick-login accounts
- 📦 **Product Management** — CRUD for products across 3 categories with stock & reorder alerts
- 🧾 **Purchasing** — Track purchase orders, suppliers, buying prices, and payment status
- 💰 **Sales** — Record sales, generate invoices, track payment status (paid/credit/partial)
- 🚚 **Transportation** — Track deliveries linked to purchases/sales (vehicle, driver, route, cost, status)
- 📊 **Dashboard** — Revenue, cost, and profit/loss visualized with animated charts and filters
- 📁 **Reports** — Exportable sales, purchase, transportation, and profit/loss reports
- 🎨 **UI** — Clean, light, professional design with Framer Motion animations, fully responsive

## 🛠 Tech Stack

| Layer      | Technology                                  |
|------------|----------------------------------------------|
| Frontend   | React (Vite), React Router, Tailwind CSS, Framer Motion, Recharts |
| Backend    | Supabase (PostgreSQL, Auth, Row Level Security) |
| Auth       | Supabase Auth (email/password, role-based)   |

## 📂 Project Structure

```
HardwareHub usecase/
├── frontend/           # React application
│   ├── src/
│   │   ├── pages/       # Login, Dashboard, Products, Purchases, Sales, Transportation, Reports
│   │   ├── components/  # Reusable UI components
│   │   ├── lib/          # Supabase client setup
│   │   └── ...
│   ├── package.json
│   └── .env.example
├── supabase/
│   ├── schema.sql       # Database schema + RLS policies
│   └── seed.sql         # Demo/sample data
└── walkthrough.md       # Index of files & implementation notes
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+) and npm
- A [Supabase](https://supabase.com) project (free tier works)

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/hardwarehub.git
cd hardwarehub/frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the `frontend` folder (copy from `.env.example`):
```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Set up the database
In the Supabase SQL Editor, run:
1. `supabase/schema.sql` — creates all tables and RLS policies
2. `supabase/seed.sql` — populates demo data (products, suppliers, customers, purchases, sales, transportation records, and demo user profiles)

### 5. Run the app locally
```bash
npm run dev
```
Open the printed local URL (usually `http://localhost:5173`) in your browser.

## 🔑 Demo Credentials

| Role    | Email              | Password    |
|---------|---------------------|-------------|
| Admin   | admin@demo.com      | Admin@123   |
| Manager | manager@demo.com    | Manager@123 |
| Staff   | staff@demo.com      | Staff@123   |

Use the **"Use Demo Account"** buttons on the login page to auto-fill credentials.

## 🗄 Database Schema Overview

- `profiles` — user accounts and roles
- `categories` — Electronics / Vehicles / Hardware
- `products` — inventory items linked to a category and supplier
- `suppliers`, `customers`
- `purchases`, `purchase_items` — buying records
- `sales`, `sale_items` — selling records
- `transportation` — delivery tracking linked to purchases/sales
- `expenses` — additional costs for accurate profit/loss

## 📈 Roadmap / Ideas

- Multi-warehouse support
- Automated low-stock email alerts
- PDF invoice generation
- Customer credit limit tracking

## 📄 License

This project is licensed under the MIT License — feel free to use and modify.

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

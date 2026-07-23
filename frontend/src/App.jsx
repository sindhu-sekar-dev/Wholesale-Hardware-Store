import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PageLoader } from './components/ui/Spinner';

// Layout
import AppLayout from './layouts/AppLayout';

// Pages
import Login      from './pages/Login';
import Dashboard  from './pages/Dashboard';
import Products   from './pages/Products';
import Purchases  from './pages/Purchases';
import Sales      from './pages/Sales';
import Transport  from './pages/Transport';
import Reports    from './pages/Reports';

// ── Protected Route Guard ──────────────────────────────────────
function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useAuth();

  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // If not authorized for this specific section, redirect back to home dashboard
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Login Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Main Application Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            {/* Dashboard (Allowed for Admin, Manager, Staff) */}
            <Route index element={<Dashboard />} />

            {/* Products Catalog (Allowed for Admin, Manager, Staff) */}
            <Route path="products" element={<Products />} />

            {/* Purchases Logs (Allowed for Admin and Manager only) */}
            <Route 
              path="purchases" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'manager']}>
                  <Purchases />
                </ProtectedRoute>
              } 
            />

            {/* Sales Registries (Allowed for Admin, Manager, Staff) */}
            <Route path="sales" element={<Sales />} />

            {/* Transportation Logs (Allowed for Admin, Manager, Staff) */}
            <Route path="transport" element={<Transport />} />

            {/* Reports and Profit-Loss ledgers (Allowed for Admin and Manager only) */}
            <Route 
              path="reports" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'manager']}>
                  <Reports />
                </ProtectedRoute>
              } 
            />
          </Route>

          {/* Fallback Catch All */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Global Toast Alerts */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              borderRadius: '16px',
              background: '#ffffff',
              color: '#1e293b',
              fontSize: '13px',
              fontWeight: '600',
              border: '1px solid #f1f5f9',
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            },
            success: {
              iconTheme: {
                primary: '#2563eb',
                secondary: '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff',
              },
            },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}

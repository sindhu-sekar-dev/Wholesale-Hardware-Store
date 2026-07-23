import { createContext, useContext, useState, useEffect } from 'react';
import { DEMO_CREDENTIALS } from '../utils/constants';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('hh_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch (_) { /* ignore */ }
    }
    setLoading(false);
  }, []);

  /**
   * Login with email + password (demo mock only)
   * @param {string} email
   * @param {string} password
   */
  const login = async (email, password) => {
    // Simulate API delay
    await new Promise(r => setTimeout(r, 800));

    const matchKey = Object.keys(DEMO_CREDENTIALS).find(
      key => DEMO_CREDENTIALS[key].email.toLowerCase() === email.trim().toLowerCase() && 
             DEMO_CREDENTIALS[key].password === password
    );

    if (!matchKey) {
      return { success: false, error: 'Invalid email or password.' };
    }

    const cred = DEMO_CREDENTIALS[matchKey];
    const sessionUser = {
      id:        cred.role === 'admin' ? 'a1a1a1a1-b1b1-c1c1-d1d1-e1e1e1e1e1e1' 
                 : cred.role === 'manager' ? 'm2m2m2m2-b2b2-c2c2-d2d2-e2e2e2e2e2e2' 
                 : 's3s3s3s3-b3b3-c3c3-d3d3-e3e3e3e3e3e3',
      email:     cred.email,
      role:      cred.role,
      full_name: cred.name,
    };
    
    setUser(sessionUser);
    localStorage.setItem('hh_user', JSON.stringify(sessionUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hh_user');
  };

  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager';
  const isStaff = user?.role === 'staff';

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin, isManager, isStaff }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

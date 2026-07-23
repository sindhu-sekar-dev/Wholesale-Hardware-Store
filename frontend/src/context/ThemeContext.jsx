import { createContext, useContext, useState, useEffect } from 'react';

// ── Theme Context ─────────────────────────────────────────────
const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    // Persist preference in localStorage
    const saved = localStorage.getItem('hh_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply / remove the `dark` class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('hh_theme', dark ? 'dark' : 'light');
  }, [dark]);

  const toggleTheme = () => setDark(prev => !prev);

  return (
    <ThemeContext.Provider value={{ dark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}

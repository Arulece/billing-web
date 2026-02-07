import React, { createContext, useContext, useEffect, useState } from 'react';

const THEME_KEY = 'dh_theme_v1';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // role: 'Admin' | 'Staff'
  const [role, setRole] = useState('Staff');
  const [user, setUser] = useState({ id: 'local_user', name: 'Local User' });

  // theme: 'light' | 'dark'
  const [theme, setTheme] = useState(() => {
    try {
      return window.localStorage.getItem(THEME_KEY) || 'light';
    } catch (e) {
      return 'light';
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      // ignore
    }
    // apply to document for CSS selectors
    try {
      document.documentElement.setAttribute('data-theme', theme);
    } catch (e) {
      // ignore
    }
  }, [theme]);

  const loginAs = (newRole) => {
    setRole(newRole);
  };

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  // Animated theme transition: briefly add a class to enable smoother CSS transitions
  const toggleThemeAnimated = () => {
    try {
      const el = document.documentElement;
      el.classList.add('theme-transition');
      // Allow the transition class to apply before updating theme
      window.setTimeout(() => {
        setTheme((t) => (t === 'light' ? 'dark' : 'light'));
        // remove the transition helper after animation finishes
        window.setTimeout(() => el.classList.remove('theme-transition'), 420);
      }, 10);
    } catch (e) {
      // fallback
      setTheme((t) => (t === 'light' ? 'dark' : 'light'));
    }
  };

  return (
    <AuthContext.Provider value={{ role, user, loginAs, theme, toggleTheme }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

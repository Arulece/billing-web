import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { seedSampleMaster } from '../utils/seedData';
import { useApp } from '../store/AppContext';

export default function Nav() {
  const { role, loginAs, theme, toggleThemeAnimated, toggleTheme } = useAuth();
  const { state } = useApp();
  return (
    <nav className="nav">
      <div style={{display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}>
        <div className="brand">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{verticalAlign:'middle',marginRight:8}}>
            <rect x="2" y="4" width="20" height="14" rx="3" fill="url(#g)" />
            <defs>
              <linearGradient id="g" x1="0" x2="1">
                <stop offset="0" stopColor="#0066ff" />
                <stop offset="1" stopColor="#4fb6ff" />
              </linearGradient>
            </defs>
          </svg>
          Desktop Hotel
          <small>POS & Billing</small>
        </div>
        <div className="links">
          <Link to="/">Billing</Link>
          <Link to="/items">Items</Link>
          <Link to="/reports">Reports</Link>
          <Link to="/employees">Employees</Link>
          <Link to="/expenses">Expenses</Link>
        </div>
      </div>
      <div className="role">
        <label style={{ marginRight: 8 }}>Role:</label>
        <select value={role} onChange={(e) => loginAs(e.target.value)}>
          <option value="Staff">Staff</option>
          <option value="Admin">Admin</option>
        </select>
        <button title="Toggle theme" onClick={toggleThemeAnimated || toggleTheme} className="btn-ghost btn-sm" style={{marginLeft:8}}>
          {theme === 'light' ? '🌞' : '🌙'}
        </button>
        <button title="Load sample dishes" onClick={async () => { await seedSampleMaster(); window.location.reload(); }} className="btn-ghost btn-sm" style={{marginLeft:8}}>
          Load Sample Dishes
        </button>
      </div>
    </nav>
  );
}

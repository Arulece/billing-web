import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { seedSampleMaster } from '../utils/seedData';
import { useApp } from '../store/AppContext';

export default function Nav() {
  const { role, user, logout, theme, toggleThemeAnimated, toggleTheme } = useAuth();
  const { state } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
          Priya Hotel
          <small>POS & Billing</small>
        </div>
        <div className="links">
          <Link to="/">Billing</Link>
          {role === 'Admin' && (
            <>
              <Link to="/items">Items</Link>
              <Link to="/reports">Reports</Link>
              <Link to="/employees">Employees</Link>
              <Link to="/expenses">Expenses</Link>
            </>
          )}
        </div>
      </div>
      <div className="role" style={{display:'flex',alignItems:'center',gap:8}}>
        <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',marginRight:8}}>
          <strong style={{fontSize:'0.9em'}}>{user?.name || 'User'}</strong>
          <span style={{fontSize:'0.75em',color:'#666',fontWeight:'500'}}>
            {role}
          </span>
        </div>
        <button title="Toggle theme" onClick={toggleThemeAnimated || toggleTheme} className="btn-ghost btn-sm">
          {theme === 'light' ? '🌞' : '🌙'}
        </button>
        {/* <button title="Load sample dishes" onClick={async () => { await seedSampleMaster(); window.location.reload(); }} className="btn-ghost btn-sm">
          Load Sample Dishes
        </button> */}
        <button 
          onClick={handleLogout} 
          className="btn-ghost btn-sm"
          style={{
            backgroundColor: '#dc3545',
            color: 'white',
            padding: '6px 12px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.85em'
          }}
          title="Logout"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

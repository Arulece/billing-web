import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { useApp } from '../store/AppContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isAuthenticated } = useAuth();
  const { state } = useApp();
  const navigate = useNavigate();

  // Redirect to home page if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Check for default admin credentials
    if (username === 'admin' && password === 'admin') {
      login({ id: 'admin_default', name: 'Admin', username: 'admin' }, 'Admin');
      navigate('/', { replace: true });
      return;
    }

    // Check employee credentials
    const employees = state.master?.employees || [];
    const employee = employees.find(
      (emp) => emp.username === username && emp.password === password
    );

    if (employee) {
      // Check employee status
      const employeeStatus = employee.status || 'Live';
      
      if (employeeStatus === 'Terminated') {
        setError('Access denied: Your employment has been terminated. Please contact administration.');
        return;
      }
      
      if (employeeStatus === 'Resigned') {
        setError('Access denied: Your employment status is marked as resigned. Please contact administration.');
        return;
      }
      
      if (employeeStatus === 'Login Restricted') {
        setError('Access denied: Your login has been restricted. Please contact administration.');
        return;
      }
      
      // Only allow login if status is 'Live'
      if (employeeStatus === 'Live') {
        login(
          { id: employee.id, name: employee.name, username: employee.username },
          employee.role
        );
        navigate('/', { replace: true });
      } else {
        setError('Access denied: Invalid employee status. Please contact administration.');
      }
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f5f5f5',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '40px',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#333',
            marginBottom: '8px'
          }}>
            Welcome Back
          </h1>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Sign in to access your account
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#333'
            }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              style={{
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '15px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#007bff'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#333'
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              style={{
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '15px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#007bff'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>

          {error && (
            <div style={{
              padding: '12px',
              backgroundColor: '#fee',
              border: '1px solid #fcc',
              borderRadius: '8px',
              color: '#c33',
              fontSize: '14px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            style={{
              padding: '14px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              marginTop: '8px'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
          >
            Sign In
          </button>
        </form>

        <div style={{
          marginTop: '24px',
          padding: '16px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          fontSize: '13px',
          color: '#666'
        }}>
          <strong style={{ display: 'block', marginBottom: '8px', color: '#333' }}>
            Default Admin Login:
          </strong>
          <div style={{ fontFamily: 'monospace' }}>
            Username: <strong>admin</strong><br />
            Password: <strong>admin</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

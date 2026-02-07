import React, { useState } from 'react';
import { useApp } from '../store/AppContext';

export default function EmployeesPage() {
  const { state, addEmployee, updateEmployee, deleteEmployee } = useApp();
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState('Staff');
  const [team, setTeam] = useState('Kitchen');
  const [salaryDaily, setSalaryDaily] = useState(0);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState('Live');
  const [editingId, setEditingId] = useState(null);

  const resetForm = () => {
    setName('');
    setMobile('');
    setAddress('');
    setRole('Staff');
    setTeam('Kitchen');
    setSalaryDaily(0);
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setStatus('Live');
    setEditingId(null);
  };

  const handleEdit = (emp) => {
    setName(emp.name || '');
    setMobile(emp.mobile || '');
    setAddress(emp.address || '');
    setRole(emp.role || 'Staff');
    setTeam(emp.team || 'Kitchen');
    setSalaryDaily(emp.salaryRule?.daily || 0);
    setUsername(emp.username || '');
    setPassword('');
    setConfirmPassword('');
    setStatus(emp.status || 'Live');
    setEditingId(emp.id);
  };

  const handleDelete = async (empId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      await deleteEmployee(empId);
    }
  };

  const submit = async () => {
    // Validate required fields
    if (!name.trim()) {
      alert('Please enter employee name');
      return;
    }

    if (!username.trim()) {
      alert('Please enter a username');
      return;
    }

    // For new employees, password is required
    if (!editingId && !password) {
      alert('Please enter a password');
      return;
    }

    // Check password confirmation when password is provided
    if (password && password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Check for duplicate username
    const existingEmployee = (state.master?.employees || []).find(
      emp => emp.username === username && emp.id !== editingId
    );
    if (existingEmployee) {
      alert('Username already exists. Please choose a different username.');
      return;
    }

    const employeeData = {
      name,
      mobile,
      address,
      role,
      team,
      salaryRule: { daily: Number(salaryDaily) },
      username,
      status
    };

    // Only include password if it's provided (for updates, password is optional)
    if (password) {
      employeeData.password = password;
    }

    if (editingId) {
      await updateEmployee(editingId, employeeData);
    } else {
      await addEmployee(employeeData);
    }
    resetForm();
  };

  return (
    <div className="container">
      <header className="page-header">
        <h1 className="page-title">Employees</h1>
        <p className="page-sub">Manage staff, attendance and salary rules (admin only).</p>
      </header>
      <div className="card" style={{display:'grid',gap:16,gridTemplateColumns:'1fr 1fr'}}>
        <div style={{display:'flex',flexDirection:'column',gap:6}}>
          <label style={{fontSize:'0.9em',fontWeight:'600',color:'#333'}}>Name *</label>
          <input 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            style={{padding:'10px',border:'1px solid #ddd',borderRadius:'6px',fontSize:'1em'}}
          />
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:6}}>
          <label style={{fontSize:'0.9em',fontWeight:'600',color:'#333'}}>Mobile Number</label>
          <input 
            value={mobile} 
            onChange={(e) => setMobile(e.target.value)} 
            style={{padding:'10px',border:'1px solid #ddd',borderRadius:'6px',fontSize:'1em'}}
          />
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:6,gridColumn:'1 / -1'}}>
          <label style={{fontSize:'0.9em',fontWeight:'600',color:'#333'}}>Address</label>
          <input 
            value={address} 
            onChange={(e) => setAddress(e.target.value)} 
            style={{padding:'10px',border:'1px solid #ddd',borderRadius:'6px',fontSize:'1em'}}
          />
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:6}}>
          <label style={{fontSize:'0.9em',fontWeight:'600',color:'#333'}}>Role</label>
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
            style={{padding:'10px',border:'1px solid #ddd',borderRadius:'6px',fontSize:'1em',backgroundColor:'white'}}
          >
            <option>Staff</option>
            <option>Admin</option>
          </select>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:6}}>
          <label style={{fontSize:'0.9em',fontWeight:'600',color:'#333'}}>Team</label>
          <select 
            value={team} 
            onChange={(e) => setTeam(e.target.value)}
            style={{padding:'10px',border:'1px solid #ddd',borderRadius:'6px',fontSize:'1em',backgroundColor:'white'}}
          >
            <option>Kitchen</option>
            <option>Service</option>
            <option>Management</option>
            <option>Cleaning</option>
            <option>Security</option>
          </select>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:6}}>
          <label style={{fontSize:'0.9em',fontWeight:'600',color:'#333'}}>Status</label>
          <select 
            value={status} 
            onChange={(e) => setStatus(e.target.value)}
            style={{padding:'10px',border:'1px solid #ddd',borderRadius:'6px',fontSize:'1em',backgroundColor:'white'}}
          >
            <option>Live</option>
            <option>Terminated</option>
            <option>Resigned</option>
            <option>Login Restricted</option>
          </select>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:6}}>
          <label style={{fontSize:'0.9em',fontWeight:'600',color:'#333'}}>Salary per Day *</label>
          <input 
            type="number" 
            value={salaryDaily} 
            onChange={(e) => setSalaryDaily(e.target.value)} 
            style={{padding:'10px',border:'1px solid #ddd',borderRadius:'6px',fontSize:'1em'}}
          />
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:6,gridColumn:'1 / -1',borderTop:'1px solid #e0e0e0',paddingTop:16,marginTop:8}}>
          <h3 style={{fontSize:'1em',fontWeight:'600',color:'#333',marginBottom:8}}>Login Credentials</h3>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:6}}>
          <label style={{fontSize:'0.9em',fontWeight:'600',color:'#333'}}>Username *</label>
          <input 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            placeholder="Enter username for login"
            style={{padding:'10px',border:'1px solid #ddd',borderRadius:'6px',fontSize:'1em'}}
          />
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:6}}>
          <label style={{fontSize:'0.9em',fontWeight:'600',color:'#333'}}>
            Password {editingId ? '(leave blank to keep current)' : '*'}
          </label>
          <input 
            type="password"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder={editingId ? 'Enter new password to change' : 'Enter password'}
            style={{padding:'10px',border:'1px solid #ddd',borderRadius:'6px',fontSize:'1em'}}
          />
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:6}}>
          <label style={{fontSize:'0.9em',fontWeight:'600',color:'#333'}}>
            Confirm Password {editingId && !password ? '' : '*'}
          </label>
          <input 
            type="password"
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            placeholder="Re-enter password"
            style={{padding:'10px',border:'1px solid #ddd',borderRadius:'6px',fontSize:'1em'}}
          />
        </div>
        <div style={{gridColumn:'1 / -1',display:'flex',gap:8}}>
          <button 
            onClick={submit} 
            style={{
              flex:1,
              padding:'12px',
              backgroundColor:editingId ? '#28a745' : '#007bff',
              color:'white',
              border:'none',
              borderRadius:'6px',
              fontSize:'1em',
              fontWeight:'600',
              cursor:'pointer',
              transition:'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = editingId ? '#218838' : '#0056b3'}
            onMouseOut={(e) => e.target.style.backgroundColor = editingId ? '#28a745' : '#007bff'}
          >
            {editingId ? 'Update Employee' : 'Add Employee'}
          </button>
          {editingId && (
            <button 
              onClick={resetForm} 
              style={{
                padding:'12px 20px',
                backgroundColor:'#6c757d',
                color:'white',
                border:'none',
                borderRadius:'6px',
                fontSize:'1em',
                fontWeight:'600',
                cursor:'pointer',
                transition:'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#5a6268'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#6c757d'}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
      <ul className="list" style={{marginTop:12,display:'grid',gap:12}}>
        {(state.master?.employees || []).map((emp) => (
          <li key={emp.id} className="card" style={{display:'grid',gap:8,backgroundColor:editingId === emp.id ? '#e7f3ff' : 'white'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <strong style={{fontSize:'1.1em'}}>{emp.name}</strong>
              <div style={{display:'flex',gap:8,alignItems:'center'}}>
                <span className="muted">{emp.role}</span>
                <button
                  onClick={() => handleEdit(emp)}
                  style={{
                    padding:'6px 12px',
                    backgroundColor:'#ffc107',
                    color:'#000',
                    border:'none',
                    borderRadius:'4px',
                    fontSize:'0.85em',
                    fontWeight:'600',
                    cursor:'pointer'
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(emp.id)}
                  style={{
                    padding:'6px 12px',
                    backgroundColor:'#dc3545',
                    color:'white',
                    border:'none',
                    borderRadius:'4px',
                    fontSize:'0.85em',
                    fontWeight:'600',
                    cursor:'pointer'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'auto 1fr',gap:'8px 16px',fontSize:'0.95em'}}>
              {emp.mobile && (
                <>
                  <span className="muted">Mobile:</span>
                  <span>{emp.mobile}</span>
                </>
              )}
              {emp.address && (
                <>
                  <span className="muted">Address:</span>
                  <span>{emp.address}</span>
                </>
              )}
              {emp.team && (
                <>
                  <span className="muted">Team:</span>
                  <span>{emp.team}</span>
                </>
              )}
              <span className="muted">Salary:</span>
              <span>₹{emp.salaryRule?.daily || 0}/day</span>
              {emp.username && (
                <>
                  <span className="muted">Username:</span>
                  <span>{emp.username}</span>
                </>
              )}
              <span className="muted">Status:</span>
              <span>
                <span style={{
                  display: 'inline-block',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '0.85em',
                  fontWeight: '600',
                  backgroundColor: 
                    emp.status === 'Live' ? '#d4edda' :
                    emp.status === 'Terminated' ? '#f8d7da' :
                    emp.status === 'Resigned' ? '#fff3cd' :
                    emp.status === 'Login Restricted' ? '#f8d7da' : '#e2e3e5',
                  color: 
                    emp.status === 'Live' ? '#155724' :
                    emp.status === 'Terminated' ? '#721c24' :
                    emp.status === 'Resigned' ? '#856404' :
                    emp.status === 'Login Restricted' ? '#721c24' : '#383d41'
                }}>
                  {emp.status || 'Live'}
                </span>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

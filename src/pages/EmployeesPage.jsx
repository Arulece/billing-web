import React, { useState } from 'react';
import { useApp } from '../store/AppContext';

export default function EmployeesPage() {
  const { state, addEmployee } = useApp();
  const [name, setName] = useState('');
  const [role, setRole] = useState('Staff');
  const [salaryDaily, setSalaryDaily] = useState(0);

  const submit = async () => {
    await addEmployee({ name, role, salaryRule: { daily: Number(salaryDaily) } });
    setName(''); setSalaryDaily(0);
  };

  return (
    <div className="container">
      <header className="page-header">
        <h1 className="page-title">Employees</h1>
        <p className="page-sub">Manage staff, attendance and salary rules (admin only).</p>
      </header>
      <div className="card" style={{display:'flex',gap:8,flexWrap:'wrap'}}>
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option>Staff</option>
          <option>Admin</option>
        </select>
        <input placeholder="Daily salary" type="number" value={salaryDaily} onChange={(e) => setSalaryDaily(e.target.value)} />
        <button onClick={submit}>Add Employee</button>
      </div>
      <ul className="list" style={{marginTop:12,display:'grid',gap:12}}>
        {(state.master?.employees || []).map((emp) => (
          <li key={emp.id} className="card">{emp.name} <div className="muted">{emp.role} • {emp.salaryRule?.daily || 0}/day</div></li>
        ))}
      </ul>
    </div>
  );
}

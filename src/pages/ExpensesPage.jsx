import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { useAuth } from '../store/AuthContext';

export default function ExpensesPage() {
  const { state, addExpense } = useApp();
  const { user } = useAuth();
  const [category, setCategory] = useState('');
  const [expenseType, setExpenseType] = useState('Gas');
  const [employeeName, setEmployeeName] = useState('');
  const [routine, setRoutine] = useState('Daily');
  const [amount, setAmount] = useState(0);
  const [notes, setNotes] = useState('');

  const employees = state.master?.employees || [];

  const handleEmployeeChange = (selectedName) => {
    setEmployeeName(selectedName);
    if (selectedName) {
      const selectedEmployee = employees.find(emp => emp.name === selectedName);
      if (selectedEmployee && selectedEmployee.salaryRule?.daily) {
        setAmount(selectedEmployee.salaryRule.daily);
      }
    } else {
      setAmount(0);
    }
  };

  const submit = async () => {
    const expenseData = { 
      category, 
      expenseType,
      routine,
      amount: Number(amount), 
      notes,
      createdBy: {
        userId: user?.id,
        userName: user?.name,
        username: user?.username,
        timestamp: new Date().toISOString()
      }
    };
    
    if (expenseType === 'Salary' && employeeName) {
      expenseData.employeeName = employeeName;
    }
    
    await addExpense(expenseData);
    setCategory(''); 
    setExpenseType('Gas');
    setEmployeeName('');
    setRoutine('Daily');
    setAmount(0); 
    setNotes('');
  };

  return (
    <div className="container">
      <header className="page-header">
        <h1 className="page-title">Expenses</h1>
        <p className="page-sub">Record daily expenses and track spending.</p>
      </header>
      <div className="card" style={{display:'grid',gap:16,gridTemplateColumns:'1fr 1fr'}}>
        <div style={{display:'flex',flexDirection:'column',gap:6}}>
          <label style={{fontSize:'0.9em',fontWeight:'600',color:'#333'}}>Category *</label>
          <input 
            value={category} 
            onChange={(e) => setCategory(e.target.value)} 
            style={{padding:'10px',border:'1px solid #ddd',borderRadius:'6px',fontSize:'1em'}}
          />
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:6}}>
          <label style={{fontSize:'0.9em',fontWeight:'600',color:'#333'}}>Expense Type *</label>
          <select 
            value={expenseType} 
            onChange={(e) => setExpenseType(e.target.value)}
            style={{padding:'10px',border:'1px solid #ddd',borderRadius:'6px',fontSize:'1em',backgroundColor:'white'}}
          >
            <option>Gas</option>
            <option>Salary</option>
            <option>Electricity Bill</option>
            <option>Grocery Bill</option>
            <option>Rent</option>
            <option>Service or Repair</option>
            <option>Oil</option>
            <option>Chicken</option>
            <option>Egg</option>
            <option>Vegetables</option>
            <option>Others</option>
          </select>
        </div>
        {expenseType === 'Salary' && (
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            <label style={{fontSize:'0.9em',fontWeight:'600',color:'#333'}}>Employee Name *</label>
            <select 
              value={employeeName} 
              onChange={(e) => handleEmployeeChange(e.target.value)}
              style={{padding:'10px',border:'1px solid #ddd',borderRadius:'6px',fontSize:'1em',backgroundColor:'white'}}
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.name}>{emp.name}</option>
              ))}
            </select>
          </div>
        )}
        <div style={{display:'flex',flexDirection:'column',gap:6}}>
          <label style={{fontSize:'0.9em',fontWeight:'600',color:'#333'}}>Routine *</label>
          <select 
            value={routine} 
            onChange={(e) => setRoutine(e.target.value)}
            style={{padding:'10px',border:'1px solid #ddd',borderRadius:'6px',fontSize:'1em',backgroundColor:'white'}}
          >
            <option>Daily</option>
            <option>Weekly</option>
            <option>Monthly</option>
          </select>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:6}}>
          <label style={{fontSize:'0.9em',fontWeight:'600',color:'#333'}}>Amount *</label>
          <input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            style={{padding:'10px',border:'1px solid #ddd',borderRadius:'6px',fontSize:'1em'}}
          />
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:6,gridColumn:'1 / -1'}}>
          <label style={{fontSize:'0.9em',fontWeight:'600',color:'#333'}}>Notes</label>
          <input 
            value={notes} 
            onChange={(e) => setNotes(e.target.value)} 
            style={{padding:'10px',border:'1px solid #ddd',borderRadius:'6px',fontSize:'1em'}}
          />
        </div>
        <button 
          onClick={submit}
          style={{
            gridColumn:'1 / -1',
            padding:'12px',
            backgroundColor:'#007bff',
            color:'white',
            border:'none',
            borderRadius:'6px',
            fontSize:'1em',
            fontWeight:'600',
            cursor:'pointer',
            transition:'background-color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
        >
          Add Expense
        </button>
      </div>
      <ul className="list" style={{marginTop:12,display:'grid',gap:12}}>
        {(state.master?.expenses || []).map((exp) => (
          <li key={exp.id} className="card">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <strong style={{fontSize:'1.05em'}}>{exp.category}</strong>
                {exp.expenseType && <span className="muted" style={{marginLeft:8}}>• {exp.expenseType}</span>}
                {exp.employeeName && <span className="muted" style={{marginLeft:8}}>• {exp.employeeName}</span>}
                {exp.routine && <span className="muted" style={{marginLeft:8}}>• {exp.routine}</span>}
              </div>
              <div className="muted">{exp.date}</div>
            </div>
            <div style={{fontWeight:700,fontSize:'1.1em',marginTop:4}}>₹{exp.amount}</div>
            {exp.notes && <div className="muted" style={{fontSize:'0.9em',marginTop:4}}>{exp.notes}</div>}
            {exp.createdBy && (
              <div style={{
                marginTop: 8,
                paddingTop: 8,
                borderTop: '1px solid #e0e0e0',
                fontSize: '0.85em',
                color: '#666',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}>
                <span>Added by:</span>
                <strong style={{color: '#333'}}>{exp.createdBy.userName}</strong>
                <span className="muted">({exp.createdBy.username})</span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

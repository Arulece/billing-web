import React, { useState } from 'react';
import { useApp } from '../store/AppContext';

export default function ExpensesPage() {
  const { state, addExpense } = useApp();
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState(0);
  const [notes, setNotes] = useState('');

  const submit = async () => {
    await addExpense({ category, amount: Number(amount), notes });
    setCategory(''); setAmount(0); setNotes('');
  };

  return (
    <div className="container">
      <header className="page-header">
        <h1 className="page-title">Expenses</h1>
        <p className="page-sub">Record daily expenses and track spending.</p>
      </header>
      <div className="card" style={{display:'flex',gap:8,flexWrap:'wrap'}}>
        <input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
        <input placeholder="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <input placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
        <button onClick={submit}>Add Expense</button>
      </div>
      <ul className="list" style={{marginTop:12,display:'grid',gap:12}}>
        {(state.master?.expenses || []).map((exp) => (
          <li key={exp.id} className="card"><div style="display:flex;justify-content:space-between"><div>{exp.category}</div><div className="muted">{exp.date}</div></div><div style={{fontWeight:700}}>{exp.amount}</div></li>
        ))}
      </ul>
    </div>
  );
}

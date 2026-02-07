import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { calcTotals } from '../utils/reports';

export default function ReportsPage() {
  const { state } = useApp();
  const [range, setRange] = useState({ from: null, to: null });

  const result = state.master ? calcTotals(state.master, range) : null;

  return (
    <div className="container">
      <header className="page-header">
        <h1 className="page-title">Reports</h1>
        <p className="page-sub">Overview of sales, expenses and net profit. Filter by date range.</p>
      </header>
      <div className="card" style={{display:'flex',gap:12,flexWrap:'wrap'}}>
        <div style={{flex:1}}>
          <label>From</label>
          <input type="date" onChange={(e) => setRange((r) => ({ ...r, from: e.target.value }))} />
        </div>
        <div style={{flex:1}}>
          <label>To</label>
          <input type="date" onChange={(e) => setRange((r) => ({ ...r, to: e.target.value }))} />
        </div>
      </div>
      {result && (
        <div className="card" style={{marginTop:12,display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:12}}>
          <div className="card"><div className="muted">Total sales</div><div style={{fontSize:20,fontWeight:700}}>{result.totalSales}</div></div>
          <div className="card"><div className="muted">Total expenses</div><div style={{fontSize:20,fontWeight:700}}>{result.totalExpenses}</div></div>
          <div className="card"><div className="muted">Salaries</div><div style={{fontSize:20,fontWeight:700}}>{result.salaries}</div></div>
          <div className="card"><div className="muted">Net profit</div><div style={{fontSize:20,fontWeight:700}}>{result.netProfit}</div></div>
        </div>
      )}
    </div>
  );
}

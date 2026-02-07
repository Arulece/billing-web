import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import BillForm from '../components/BillForm';

export default function BillingPage() {
  const { state, deleteBill } = useApp();
  const navigate = useNavigate();
  const bills = state.master?.bills || [];
  const [activeBillId, setActiveBillId] = useState(null);
  const [formResetKey, setFormResetKey] = useState(0);

  const openBills = bills.filter((b) => b.state === 'OPEN');
  const closedBills = bills.filter((b) => b.state !== 'OPEN');
  const selectedBill = bills.find((b) => b.id === activeBillId) || null;
  
  const handleNewBill = () => {
    setActiveBillId(null);
    setFormResetKey(prev => prev + 1); // Force form to remount
  };

  const handleDeleteBill = async (billId) => {
    if (!confirm('Are you sure you want to delete this bill? This action cannot be undone.')) {
      return;
    }
    try {
      await deleteBill(billId);
      // If the deleted bill was selected, clear the selection
      if (activeBillId === billId) {
        setActiveBillId(null);
      }
      alert('Bill deleted successfully.');
    } catch (err) {
      alert('Failed to delete bill: ' + err.message);
    }
  };

  const handlePrintBill = (billId) => {
    // Open print page in a new window
    window.open(`/print/${billId}`, '_blank');
  };

  return (
    <div className="container">
      <header className="page-header">
        <h1 className="page-title">Billing</h1>
        <p className="page-sub">Create bills quickly; print invoices for customers.</p>
      </header>

      <div style={{display:'flex',gap:16,alignItems:'center',marginBottom:24,flexWrap:'wrap'}}>
        <button className="primary btn-lg" onClick={handleNewBill}>+ New Bill</button>
        {selectedBill && (
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <span className={`badge ${selectedBill.state === 'OPEN' ? 'badge-success' : 'badge-info'}`}>
              {selectedBill.state === 'OPEN' ? '✎ Editing' : '👁 Viewing'}
            </span>
            <span style={{fontWeight:600,color:'var(--text-primary)'}}>
              {selectedBill.id}
            </span>
            <span className="muted">—</span>
            <span style={{fontWeight:500}}>{selectedBill.customerName || 'Guest'}</span>
          </div>
        )}
      </div>

      <div className="card">
        <BillForm key={selectedBill?.id || `new-bill-${formResetKey}`} existingBill={selectedBill} />
      </div>

      <hr />
      <h3 style={{marginTop:24,marginBottom:20,fontSize:'var(--text-2xl)',fontWeight:700,display:'flex',alignItems:'center',gap:12}}>
        <span style={{width:4,height:24,background:'var(--success)',borderRadius:'var(--radius-full)'}}></span>
        Open Bills
        <span className="badge badge-success" style={{fontSize:'var(--text-xs)',marginLeft:8}}>{openBills.length}</span>
      </h3>
      {openBills.length === 0 ? (
        <div className="card" style={{textAlign:'center',padding:'var(--space-2xl)',background:'var(--surface-elevated)'}}>
          <div style={{fontSize:'48px',marginBottom:12}}>📝</div>
          <p className="muted" style={{fontSize:'var(--text-lg)'}}>No open bills. Create a new bill to get started.</p>
        </div>
      ) : (
        <ul className="list">
          {openBills.map((b) => (
            <li key={b.id} className={`card${b.id === activeBillId ? ' active' : ''}`} style={{marginBottom:16,display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:16}}>
              <div style={{display:'flex',alignItems:'center',gap:16,flex:1}}>
                <div style={{width:48,height:48,borderRadius:'var(--radius)',background:'var(--success-light)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'24px'}}>
                  🧾
                </div>
                <div>
                  <div style={{fontWeight:700,fontSize:'var(--text-lg)',marginBottom:4,color:'var(--text-primary)'}}>{b.customerName || 'Guest'}</div>
                  <div style={{display:'flex',gap:12,fontSize:'var(--text-sm)',color:'var(--text-secondary)',flexWrap:'wrap'}}>
                    <span>ID: {b.id}</span>
                    <span>•</span>
                    <span>{b.items.length} {b.items.length === 1 ? 'item' : 'items'}</span>
                    {b.createdBy && (
                      <>
                        <span>•</span>
                        <span>By: <strong>{b.createdBy.userName}</strong></span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div style={{display:'flex',gap:8}}>
                <button className="secondary" onClick={() => setActiveBillId(b.id)}>✎ Edit</button>
                <button className="btn-ghost btn-sm" onClick={() => handlePrintBill(b.id)} title="Print bill">🖨️ Print</button>
                <button className="danger btn-sm" onClick={() => handleDeleteBill(b.id)} title="Delete bill">🗑️</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <h3 style={{marginTop:32,marginBottom:20,fontSize:'var(--text-2xl)',fontWeight:700,display:'flex',alignItems:'center',gap:12}}>
        <span style={{width:4,height:24,background:'var(--info)',borderRadius:'var(--radius-full)'}}></span>
        Closed / Paid Bills
        <span className="badge badge-info" style={{fontSize:'var(--text-xs)',marginLeft:8}}>{closedBills.length}</span>
      </h3>
      {closedBills.length === 0 ? (
        <div className="card" style={{textAlign:'center',padding:'var(--space-2xl)',background:'var(--surface-elevated)'}}>
          <div style={{fontSize:'48px',marginBottom:12}}>✓</div>
          <p className="muted" style={{fontSize:'var(--text-lg)'}}>No closed bills yet.</p>
        </div>
      ) : (
        <ul className="list">
          {closedBills.map((b) => (
            <li key={b.id} className="card" style={{marginBottom:16,display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:16,opacity:0.85}}>
              <div style={{display:'flex',alignItems:'center',gap:16,flex:1}}>
                <div style={{width:48,height:48,borderRadius:'var(--radius)',background:'var(--info-light)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'24px'}}>
                  ✓
                </div>
                <div>
                  <div style={{fontWeight:700,fontSize:'var(--text-lg)',marginBottom:4,color:'var(--text-primary)'}}>{b.customerName || 'Guest'}</div>
                  <div style={{display:'flex',gap:12,fontSize:'var(--text-sm)',color:'var(--text-secondary)',flexWrap:'wrap'}}>
                    <span>ID: {b.id}</span>
                    <span>•</span>
                    <span>{b.items.length} {b.items.length === 1 ? 'item' : 'items'}</span>
                    <span>•</span>
                    <span className={`badge ${b.state === 'PAID' ? 'badge-success' : 'badge-default'}`} style={{fontSize:'10px',padding:'2px 8px'}}>
                      {b.state}
                    </span>
                    {b.createdBy && (
                      <>
                        <span>•</span>
                        <span>By: <strong>{b.createdBy.userName}</strong></span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div style={{display:'flex',gap:8}}>
                <button className="secondary btn-sm" onClick={() => setActiveBillId(b.id)}>👁 View</button>
                <button className="btn-ghost btn-sm" onClick={() => handlePrintBill(b.id)} title="Print bill">🖨️ Print</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

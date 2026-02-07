import React, { useState, useMemo, useEffect } from 'react';
import billingService from '../services/billingService';
import { useApp } from '../store/AppContext';

export default function BillForm({ existingBill }) {
  const { createBill, updateBill, closeBill, state } = useApp();
  const dishes = state.master?.dishes || [];

  const [items, setItems] = useState(existingBill?.items || []);
  const [customerName, setCustomerName] = useState(existingBill?.customerName || '');
  const [phone, setPhone] = useState(existingBill?.phone || '');

  useEffect(() => {
    setItems(existingBill?.items || []);
    setCustomerName(existingBill?.customerName || '');
    setPhone(existingBill?.phone || '');
  }, [existingBill]);

  const editable = !existingBill || existingBill.state === 'OPEN';

  const markPaid = async () => {
    if (!existingBill) return;
    if (!confirm('Mark this bill as PAID?')) return;
    try {
      await closeBill(existingBill.id, { markPaid: true });
      // storage and state refreshed in context; BillForm will receive updated existingBill (or null) from parent
      alert('Bill marked as paid.');
    } catch (err) {
      alert('Failed to mark paid: ' + err.message);
    }
  };

  const addItem = () => setItems([...items, { id: `i_${Date.now()}`, dishId: null, name: '', price: 0, quantity: 1 }]);

  const removeItem = (idx) => setItems(items.filter((_, i) => i !== idx));

  const onSelectDish = (idx, dishId) => {
    const copy = [...items];
    const d = dishes.find((x) => x.id === dishId);
    if (d) {
      copy[idx] = {
        ...copy[idx],
        dishId: d.id,
        name: d.name,
        price: d.price,
        discountPercent: d.discountPercent || 0,
        discountAmount: d.discountAmount || 0,
        discountType: d.discountType || 'percent',
        image: d.image,
      };
    } else {
      copy[idx] = { ...copy[idx], dishId: null };
    }
    setItems(copy);
  };

  const updateItemField = (idx, field, value) => {
    const copy = [...items];
    copy[idx] = { ...copy[idx], [field]: value };
    setItems(copy);
  };

  const incQty = (idx, delta) => {
    const copy = [...items];
    copy[idx].quantity = Math.max(1, (copy[idx].quantity || 0) + delta);
    setItems(copy);
  };

  const totals = useMemo(() => billingService.calculateTotals(items, 0.00), [items]);
  const subtotal = totals.subtotal;

  const save = async () => {
    // ensure all items have a selected dish (price/discount must come from master data)
    const missing = items.find((it) => !it.dishId);
    if (missing) {
      alert('Please select a dish for all items. Prices and discounts come from the master menu.');
      return;
    }

    const payload = { items, customerName, phone };
    if (existingBill) {
      await updateBill(existingBill.id, payload);
    } else {
      await createBill(payload);
    }
  };

  return (
    <div className="form-row">
      <div className="row">
        <div className="col">
          <label>Customer Name</label>
          <input 
            type="text"
            value={customerName} 
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Enter customer name"
            style={{
              fontSize: 'var(--text-base)',
              fontWeight: 500,
              padding: '14px 16px',
              borderRadius: 'var(--radius)',
              border: '2px solid var(--border)',
              background: 'var(--surface)',
              transition: 'all var(--transition-fast)'
            }}
          />
        </div>
        <div className="col" style={{maxWidth: 300}}>
          <label>Phone Number</label>
          <input 
            type="tel"
            value={phone} 
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter phone number"
            style={{
              fontSize: 'var(--text-base)',
              fontWeight: 500,
              padding: '14px 16px',
              borderRadius: 'var(--radius)',
              border: '2px solid var(--border)',
              background: 'var(--surface)',
              transition: 'all var(--transition-fast)'
            }}
          />
        </div>
      </div>

      <div className="card">
        <h4 style={{fontSize:'var(--text-xl)',marginBottom:'var(--space-lg)'}}>Order Items</h4>
        <div className="row" style={{gap:12,marginBottom:16,fontWeight:700,fontSize:'var(--text-xs)',color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'0.05em'}}>
          <div style={{flex:1}}>Item</div>
          <div style={{width:120}}>Name</div>
          <div style={{width:120}}>Qty</div>
          <div style={{width:120}}>Price</div>
          <div style={{width:120}}>Discount</div>
          <div style={{width:120}}>Total</div>
          <div style={{width:80}}>Action</div>
        </div>

        {items.map((it, idx) => (
          <div key={it.id} className="row" style={{alignItems:'center',padding:16,borderRadius:'var(--radius)',border:'2px solid var(--border)',marginBottom:12,background:'var(--surface)',transition:'all var(--transition-fast)'}}>
            <div style={{display:'flex',alignItems:'center',gap:12,flex:1}}>
              { (it.image || (dishes.find(x=>x.id===it.dishId)?.image)) && (
                <img src={it.image || (dishes.find(x=>x.id===it.dishId)?.image)} alt="thumb" style={{width:64,height:64,objectFit:'cover',borderRadius:'var(--radius)',border:'2px solid var(--border)',boxShadow:'var(--shadow-sm)'}} />
              ) }
              <select 
                disabled={!editable} 
                value={it.dishId || ''} 
                onChange={(e) => onSelectDish(idx, e.target.value || null)} 
                style={{
                  flex:1,
                  fontWeight:500,
                  fontSize: 'var(--text-base)',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius)',
                  border: '2px solid var(--border)',
                  background: 'var(--surface)',
                  cursor: editable ? 'pointer' : 'not-allowed',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <option value="">-- Select a dish --</option>
                {dishes.map((d) => (
                  <option key={d.id} value={d.id}>{d.name} — ₹{d.price}</option>
                ))}
              </select>
            </div>

            {/* Name is readonly and comes from master data */}
            <div style={{flex:1,fontWeight:500}}>{it.name || <span className="muted" style={{fontStyle:'italic'}}>Select an item</span>}</div>

            <div style={{display:'flex',alignItems:'center',gap:8,width:120}}>
              <button 
                type="button" 
                className="btn-sm secondary" 
                disabled={!editable} 
                onClick={() => incQty(idx, -1)} 
                style={{
                  width:36,
                  height:36,
                  padding:0,
                  display:'flex',
                  alignItems:'center',
                  justifyContent:'center',
                  fontSize:'18px',
                  borderRadius:'var(--radius)',
                  fontWeight:700
                }}
              >
                −
              </button>
              <input 
                type="number" 
                disabled={!editable} 
                value={it.quantity} 
                onChange={(e) => updateItemField(idx, 'quantity', Number(e.target.value) || 1)} 
                style={{
                  width:52,
                  textAlign:'center',
                  fontWeight:700,
                  fontSize:'var(--text-base)',
                  padding:'10px 8px',
                  borderRadius:'var(--radius)',
                  border:'2px solid var(--border)',
                  background:'var(--surface)',
                  transition: 'all var(--transition-fast)'
                }} 
              />
              <button 
                type="button" 
                className="btn-sm secondary" 
                disabled={!editable} 
                onClick={() => incQty(idx, 1)} 
                style={{
                  width:36,
                  height:36,
                  padding:0,
                  display:'flex',
                  alignItems:'center',
                  justifyContent:'center',
                  fontSize:'18px',
                  borderRadius:'var(--radius)',
                  fontWeight:700
                }}
              >
                +
              </button>
            </div>

            {/* Price & discount read-only from master data */}
            <div style={{width:120,fontWeight:500,color:'var(--text-secondary)'}}>₹{it.price}</div>
            <div style={{width:120,fontSize:'var(--text-sm)'}} className="muted">
              {it.discountPercent ? `${it.discountPercent}%` : it.discountAmount ? `₹${it.discountAmount}` : '—'}
            </div>

            <div style={{width:120,fontWeight:700,fontSize:'var(--text-lg)',color:'var(--accent)'}}>
              ₹{billingService.calculateLineTotal(it).total}
            </div>

            {editable ? (
              <button type="button" className="danger btn-sm" onClick={() => removeItem(idx)} style={{width:80}}>✕</button>
            ) : (
              <div className="muted" style={{fontSize:'var(--text-xs)'}}>Locked</div>
            )}
          </div>
        ))}

        <div style={{marginTop:24,display:'flex',gap:16,alignItems:'flex-end',flexWrap:'wrap',borderTop:'2px solid var(--border-light)',paddingTop:24}}>
          {editable && <button className="secondary btn-lg" onClick={addItem} style={{flexShrink:0}}>+ Add Item</button>}
          <div style={{marginLeft:'auto',textAlign:'right',minWidth:280,background:'var(--surface-elevated)',padding:'var(--space-lg)',borderRadius:'var(--radius-lg)',border:'1px solid var(--border)'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
              <span className="muted" style={{fontWeight:500}}>Subtotal:</span>
              <span style={{fontWeight:600}}>₹{totals.subtotal}</span>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
              <span className="muted" style={{fontWeight:500}}>Discount:</span>
              <span style={{fontWeight:600,color:'var(--danger)'}}>-₹{totals.totalDiscount}</span>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:12,paddingBottom:12,borderBottom:'1px solid var(--border-light)'}}>
              <span className="muted" style={{fontWeight:500}}>Tax (0%):</span>
              <span style={{fontWeight:600}}>₹{totals.tax}</span>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{fontWeight:700,fontSize:'var(--text-xl)'}}>Total:</span>
              <span style={{fontWeight:800,fontSize:'var(--text-3xl)',color:'var(--accent)'}}>₹{totals.total}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{marginTop:24,display:'flex',gap:12,alignItems:'center',flexWrap:'wrap'}}>
        {editable ? (
          <>
            <button className="primary btn-lg" onClick={save} style={{minWidth:160}}>💾 Save Bill</button>
            {existingBill && existingBill.state === 'OPEN' && (
              <button className="success btn-lg" onClick={markPaid} style={{minWidth:160}}>✓ Mark Paid</button>
            )}
          </>
        ) : (
          <div className="badge badge-info" style={{padding:'12px 20px',fontSize:'var(--text-sm)'}}>
            {existingBill?.state || 'CLOSED'} - Read Only
          </div>
        )}
      </div>
    </div>
  );
}

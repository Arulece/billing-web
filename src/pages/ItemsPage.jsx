import React, { useState } from 'react';
import { useApp } from '../store/AppContext';

export default function ItemsPage(){
  const { state, addDish, updateDish, deleteDish } = useApp();
  const dishes = state.master?.dishes || [];

  const [form, setForm] = useState({ id: '', name: '', price: 0, image: '', category: '', discountPercent: 0 });
  const [editing, setEditing] = useState(null);

  const edit = (d) => { setEditing(d.id); setForm({ ...d }); };
  const reset = () => { setEditing(null); setForm({ id:'', name:'', price:0, image:'', category:'', discountPercent:0 }); };

  const submit = async () => {
    const payload = { name: form.name, price: Number(form.price)||0, image: form.image || null, category: form.category || 'Uncategorized', discountPercent: Number(form.discountPercent)||0 };
    if (editing) {
      await updateDish(editing, payload);
    } else {
      await addDish({ ...payload, id: form.id || undefined });
    }
    reset();
  };

  return (
    <div className="container">
      <header className="page-header">
        <h1 className="page-title">Items</h1>
        <p className="page-sub">Add or edit menu items (image, price, discount). Changes update master data and appear in billing.</p>
      </header>

      <div className="card" style={{marginBottom:12}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 160px',gap:12}}>
          <div>
            <label>Name</label>
            <input value={form.name} onChange={(e)=>setForm(f=>({...f,name:e.target.value}))} style={{
              fontSize: 'var(--text-base)',
              fontWeight: 500,
              padding: '14px 16px',
              borderRadius: 'var(--radius)',
              border: '2px solid var(--border)',
              background: 'var(--surface)',
              transition: 'all var(--transition-fast)'
            }}/>
            <label>Category</label>
            <input value={form.category} onChange={(e)=>setForm(f=>({...f,category:e.target.value}))} style={{
              fontSize: 'var(--text-base)',
              fontWeight: 500,
              padding: '14px 16px',
              borderRadius: 'var(--radius)',
              border: '2px solid var(--border)',
              background: 'var(--surface)',
              transition: 'all var(--transition-fast)'
            }}/>
            <label>Price</label>
            <input type="number" value={form.price} onChange={(e)=>setForm(f=>({...f,price:e.target.value}))} />
            <label>Discount %</label>
            <input type="number" value={form.discountPercent} onChange={(e)=>setForm(f=>({...f,discountPercent:e.target.value}))} />
          </div>
          <div>
            <label>Image URL</label>
            <input value={form.image} onChange={(e)=>setForm(f=>({...f,image:e.target.value}))} />
            {form.image && <img src={form.image} alt="preview" style={{width:'100%',borderRadius:8,marginTop:8}} />}
          </div>
        </div>
        <div style={{marginTop:12,display:'flex',gap:8}}>
          <button onClick={submit}>{editing ? 'Update Item' : 'Add Item'}</button>
          <button className="secondary" onClick={reset}>Reset</button>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:12}}>
        {dishes.map((d) => (
          <div key={d.id} className="card">
            <div style={{display:'flex',gap:12}}>
              {d.image && <img src={d.image} alt={d.name} style={{width:96,height:64,objectFit:'cover',borderRadius:8}} />}
              <div style={{flex:1}}>
                <div style={{fontWeight:700}}>{d.name}</div>
                <div className="muted">{d.category} • ₹{d.price} {d.discountPercent ? `• ${d.discountPercent}% off` : ''}</div>
                <div style={{marginTop:8}}>{d.description}</div>
              </div>
            </div>
            <div style={{marginTop:12,display:'flex',gap:8}}>
              <button onClick={()=>edit(d)}>Edit</button>
              <button className="secondary" onClick={()=>{ if (confirm('Delete this item?')) deleteDish(d.id); }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

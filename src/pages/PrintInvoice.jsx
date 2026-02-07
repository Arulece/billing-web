import React, { useRef } from 'react';
import billingService from '../services/billingService';

export default function PrintInvoice({ bill }) {
  const ref = useRef();

  if (!bill) return <div className="container">No bill selected</div>;

  const totals = billingService.calculateTotals(bill.items, 0.00);
  const { subtotal, totalDiscount, tax, total } = totals;

  const handlePrint = () => window.print();

  const fmt = (v) => `₹${Number(v || 0).toFixed(2)}`;

  return (
    <div ref={ref} className="container print-invoice">
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:12}}>
          <div>
            <h2 style={{margin:0}}>Sunrise Hotel & Restaurant</h2>
            <div className="muted">No. 12, MG Road, Chennai, Tamil Nadu</div>
            <div className="muted">Phone: +91 98765 43210 • GSTIN: 33ABCDE1234F1Z5</div>
            <div style={{marginTop:8}}>Invoice: <strong>{bill.invoiceNumber || '—'}</strong></div>
            <div>Date: <strong>{bill.paidAt || bill.createdAt}</strong></div>
          </div>
          <div style={{textAlign:'right'}}>
            {bill.customerName && <div>Customer: {bill.customerName}</div>}
            {bill.phone && <div>Phone: {bill.phone}</div>}
            <div style={{marginTop:12,fontSize:12,color:'#666'}}>Bill ID: {bill.id}</div>
          </div>
        </div>
        <hr />

        <table className="responsive-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Discount</th>
              <th>Line Total</th>
            </tr>
          </thead>
          <tbody>
            {bill.items.map((it) => {
              const ln = billingService.calculateLineTotal(it);
              const discLabel = ln.discount ? fmt(ln.discount) : (it.discountPercent ? `${it.discountPercent}%` : '—');
              return (
                <tr key={it.id}>
                  <td>{it.name}</td>
                  <td>{it.quantity}</td>
                  <td>{fmt(it.price)}</td>
                  <td>{discLabel}</td>
                  <td>{fmt(ln.total)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <hr />
        <div style={{display:'flex',justifyContent:'flex-end',flexDirection:'column',gap:6}}>
          <div className="muted">Subtotal: {fmt(subtotal)}</div>
          <div className="muted">Discounts: -{fmt(totalDiscount)}</div>
          <div className="muted">Tax: {fmt(tax)}</div>
          <div style={{fontWeight:700,fontSize:18}}>Total: {fmt(total)}</div>
        </div>

        <div style={{ marginTop: 16, display:'flex',justifyContent:'space-between',alignItems:'center' }}>
          <div style={{maxWidth:420,fontSize:12,color:'#444'}}>
            <div style={{fontWeight:700,marginBottom:6}}>Thank you for dining with us!</div>
            <div className="muted">This is a computer-generated receipt. Please retain for your records. Returns/complaints within 7 days with receipt.</div>
            <div style={{marginTop:8}} className="muted">Cashier: {bill.cashier || '—'}</div>
          </div>

          <div style={{textAlign:'center'}}>
            <div style={{marginBottom:6}}>Scan for digital invoice</div>
            <img alt="qr" src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(bill.invoiceNumber || bill.id || '')}`} style={{width:120,height:120,borderRadius:8,border:'1px solid #eee'}} />
          </div>
        </div>
      </div>
    </div>
  );
}

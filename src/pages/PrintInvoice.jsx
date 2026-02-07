import React, { useRef } from 'react';
import billingService from '../services/billingService';

export default function PrintInvoice({ bill }) {
  const ref = useRef();

  React.useEffect(() => {
    // Auto-print after a short delay to allow content to load
    const timer = setTimeout(() => {
      // Only auto-print if we have a valid bill
      if (bill && bill.items && bill.items.length > 0) {
        window.print();
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [bill]);

  if (!bill) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '40px' }}>
        <h2>No Bill Found</h2>
        <p>Unable to load bill data. Please close this window and try again.</p>
        <button 
          onClick={() => window.close()} 
          style={{
            marginTop: '20px',
            padding: '12px 24px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Close Window
        </button>
      </div>
    );
  }

  const totals = billingService.calculateTotals(bill.items, 0.00);
  const { subtotal, totalDiscount, tax, total } = totals;

  const handlePrint = () => window.print();

  const fmt = (v) => `₹${Number(v || 0).toFixed(2)}`;

  return (
    <>
      <div className="no-print" style={{
        padding: '12px',
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #dee2e6',
        display: 'flex',
        gap: '12px',
        justifyContent: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <button 
          onClick={handlePrint}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px'
          }}
        >
          🖨️ Print Invoice
        </button>
        <button 
          onClick={() => window.close()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px'
          }}
        >
          Close Window
        </button>
      </div>
      <div ref={ref} className="container print-invoice">
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:12}}>
          <div>
            <h2 style={{margin:0}}>Priya Hotel & Restaurant</h2>
            <div className="muted">No. 2B, Aandavar nagar, Belur, Salem, Tamil Nadu</div>
            <div className="muted">Phone: +91 99430 04175 • GSTIN: 33ABCDE1234F1Z5</div>
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
    </>
  );
}

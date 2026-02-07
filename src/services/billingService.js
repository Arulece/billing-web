import storage from './storageService';

// Billing service: pure functions that operate on master JSON

const generateInvoiceNumber = (master) => {
  // Simple incrementing invoice using timestamp + counter in master
  const meta = master._meta || {};
  meta.invoiceCounter = (meta.invoiceCounter || 0) + 1;
  master._meta = meta;
  const ts = Date.now();
  return `INV-${ts}-${meta.invoiceCounter}`;
};

const createBill = async (master, billData) => {
  if (!master) master = { dishes: [], employees: [], expenses: [], bills: [], _meta: {} };
  const bill = {
    id: `bill_${Date.now()}`,
    invoiceNumber: null,
    state: 'OPEN',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    items: billData.items || [],
    customerName: billData.customerName || null,
    phone: billData.phone || null,
    people: billData.people || null,
    tableNumber: billData.tableNumber || null,
  };
  master.bills = master.bills || [];
  master.bills.push(bill);
  await storage.saveMaster(master);
  return bill;
};

const updateBill = async (master, billId, patch) => {
  master.bills = master.bills || [];
  const idx = master.bills.findIndex((b) => b.id === billId);
  if (idx === -1) throw new Error('Bill not found');
  const existing = master.bills[idx];
  if (existing.state !== 'OPEN') throw new Error('Cannot edit non-open bill');
  const updated = { ...existing, ...patch, updatedAt: new Date().toISOString() };
  master.bills[idx] = updated;
  await storage.saveMaster(master);
  return updated;
};

const closeBill = async (master, billId, opts = {}) => {
  master.bills = master.bills || [];
  const idx = master.bills.findIndex((b) => b.id === billId);
  if (idx === -1) throw new Error('Bill not found');
  const bill = master.bills[idx];
  if (bill.state !== 'OPEN') throw new Error('Bill not open');
  bill.state = opts.markPaid ? 'PAID' : 'CLOSED';
  bill.invoiceNumber = generateInvoiceNumber(master);
  bill.paidAt = new Date().toISOString();
  bill.updatedAt = new Date().toISOString();
  master.bills[idx] = bill;

  // store a simplified transaction history array if needed
  master.transactions = master.transactions || [];
  master.transactions.push({
    id: `tx_${Date.now()}`,
    invoiceNumber: bill.invoiceNumber,
    billId: bill.id,
    amount: calculateTotal(bill.items),
    createdAt: new Date().toISOString(),
  });

  await storage.saveMaster(master);
  return bill;
};

const calculateSubtotal = (items) => {
  return (items || []).reduce((s, it) => s + (it.quantity || 0) * (it.price || 0), 0);
};

const calculateTax = (subtotal, taxRate = 0.05) => {
  return +(subtotal * taxRate);
};

const calculateTotal = (items, taxRate = 0.05) => {
  const sub = calculateSubtotal(items);
  const tax = calculateTax(sub, taxRate);
  return +(sub + tax);
};

const calculateLineTotal = (item) => {
  const price = Number(item.price || 0);
  const qty = Number(item.quantity || 0);
  const subtotal = price * qty;
  let discount = 0;
  if (item.discountPercent) discount = subtotal * (Number(item.discountPercent) / 100);
  else if (item.discountAmount) discount = Number(item.discountAmount || 0);
  const total = +(subtotal - discount);
  return { subtotal, discount, total };
};

const calculateTotals = (items, taxRate = 0.00) => {
  let subtotal = 0;
  let totalDiscount = 0;
  for (const it of (items || [])) {
    const ln = calculateLineTotal(it);
    subtotal += ln.subtotal;
    totalDiscount += ln.discount;
  }
  const taxable = Math.max(0, subtotal - totalDiscount);
  const tax = +(taxable * taxRate);
  const total = +(taxable + tax);
  return { subtotal, totalDiscount, taxable, tax, total };
};

export default {
  createBill,
  updateBill,
  closeBill,
  calculateSubtotal,
  calculateTax,
  calculateTotal,
  calculateLineTotal,
  calculateTotals,
};

// MongoDB-style JSON schemas (informal JS objects)

export const MasterSchema = {
  _meta: { invoiceCounter: 0 },
  dishes: [], // { id, name, price }
  employees: [], // { id, name, role, salaryRule }
  expenses: [], // { id, date, category, amount, notes }
  bills: [], // billing records
  transactions: [], // closed bills summary
};

export const BillItem = {
  id: null,
  name: '',
  price: 0,
  quantity: 1,
};

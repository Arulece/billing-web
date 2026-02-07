import billingService from '../services/billingService';

const toDate = (iso) => new Date(iso);

export const filterTransactionsByRange = (transactions, from, to) => {
  const f = from ? toDate(from) : null;
  const t = to ? toDate(to) : null;
  return (transactions || []).filter((tx) => {
    const d = new Date(tx.createdAt);
    if (f && d < f) return false;
    if (t && d > t) return false;
    return true;
  });
};

export const calcTotals = (master, { from, to } = {}) => {
  const transactions = filterTransactionsByRange(master.transactions || [], from, to);
  const expenses = filterTransactionsByRange((master.expenses || []).map((e) => ({ ...e, createdAt: e.date })), from, to);

  const totalSales = transactions.reduce((s, t) => s + (t.amount || 0), 0);
  const totalExpenses = expenses.reduce((s, e) => s + (e.amount || 0), 0);

  // Salary payouts: sum employees salary for period - simplified: assume daily salary in employee.salaryRule.daily
  const salaries = (master.employees || []).reduce((s, emp) => s + ((emp.salaryPaid || 0) || 0), 0);

  const netProfit = totalSales - totalExpenses - salaries;

  return { totalSales, totalExpenses, salaries, netProfit, transactionsCount: transactions.length };
};

export default { filterTransactionsByRange, calcTotals };

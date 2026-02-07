import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AppProvider, useApp } from './store/AppContext';
import { AuthProvider, useAuth } from './store/AuthContext';
import BillingPage from './pages/BillingPage';
import ReportsPage from './pages/ReportsPage';
import EmployeesPage from './pages/EmployeesPage';
import ExpensesPage from './pages/ExpensesPage';
import PrintInvoice from './pages/PrintInvoice';
import Nav from './components/Nav';
import ItemsPage from './pages/ItemsPage';

const RoleGuard = ({ children, allowed = [] }) => {
  const { role } = useAuth();
  if (!allowed.includes(role)) return <Navigate to="/" replace />;
  return children;
};

const PrintWrapper = () => {
  const { id } = useParams();
  const { state } = useApp();
  const bill = (state.master?.bills || []).find((b) => b.id === id);
  return <PrintInvoice bill={bill} />;
};

export default function AppRoot() {
  return (
    <AppProvider>
      <AuthProvider>
        <BrowserRouter>
          <Nav />
          <Routes>
            <Route path="/" element={<BillingPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/items" element={<ItemsPage />} />
            <Route path="/employees" element={<RoleGuard allowed={["Admin"]}><EmployeesPage /></RoleGuard>} />
            <Route path="/expenses" element={<RoleGuard allowed={["Admin"]}><ExpensesPage /></RoleGuard>} />
            <Route path="/print/:id" element={<PrintWrapper />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </AppProvider>
  );
}

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AppProvider, useApp } from './store/AppContext';
import { AuthProvider, useAuth } from './store/AuthContext';
import BillingPage from './pages/BillingPage';
import ReportsPage from './pages/ReportsPage';
import EmployeesPage from './pages/EmployeesPage';
import ExpensesPage from './pages/ExpensesPage';
import PrintInvoice from './pages/PrintInvoice';
import LoginPage from './pages/LoginPage';
import Nav from './components/Nav';
import ItemsPage from './pages/ItemsPage';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

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

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated && <Nav />}
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} />
        <Route path="/print/:id" element={<PrintWrapper />} />
        <Route path="/" element={<PrivateRoute><BillingPage /></PrivateRoute>} />
        <Route path="/reports" element={<PrivateRoute><ReportsPage /></PrivateRoute>} />
        <Route path="/items" element={<PrivateRoute><ItemsPage /></PrivateRoute>} />
        <Route path="/employees" element={<PrivateRoute><RoleGuard allowed={["Admin"]}><EmployeesPage /></RoleGuard></PrivateRoute>} />
        <Route path="/expenses" element={<PrivateRoute><RoleGuard allowed={["Admin"]}><ExpensesPage /></RoleGuard></PrivateRoute>} />
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
      </Routes>
    </>
  );
};

export default function AppRoot() {
  return (
    <AppProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </AppProvider>
  );
}

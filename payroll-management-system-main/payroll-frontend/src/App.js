import React from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import AddEmployeeRecords from './pages/AddEmployeeRecords';
import ProtectedRoute from "./components/ProtectedRoute";

import { Toaster } from 'react-hot-toast';

import PageTransition from "./components/PageTransition";

function App() {
  const navigate = useNavigate();
  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: '#0F0D17',
            color: '#F0E6FF',
            border: '1px solid #7B2FFF',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<PageTransition><Landing onAdminClick={() => navigate('/login?role=admin')} onEmployeeClick={() => navigate('/login?role=employee')} /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />

        <Route path="/admin-dashboard" element={
          <ProtectedRoute requiredRole="admin">
            <PageTransition><AdminDashboard /></PageTransition>
          </ProtectedRoute>
        } />

        <Route path="/employee-dashboard" element={
          <ProtectedRoute>
            <PageTransition><EmployeeDashboard /></PageTransition>
          </ProtectedRoute>
        } />

        <Route path="/add-records" element={
          <ProtectedRoute requiredRole="admin">
            <PageTransition><AddEmployeeRecords /></PageTransition>
          </ProtectedRoute>
        } />

        {/* Redirect old routes */}
        <Route path="/admin-login" element={<Navigate to="/login" replace />} />
        <Route path="/employee-login" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;

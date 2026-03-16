import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Landing from "./pages/Landing";
import AdminLogin from "./pages/AdminLogin";
import EmployeeLogin from "./pages/EmployeeLogin";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import AddEmployeeRecords from './pages/AddEmployeeRecords';

import { Toaster } from 'react-hot-toast';

function App() {
  const navigate = useNavigate();
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Landing onAdminClick={() => navigate('/admin-login')} onEmployeeClick={() => navigate('/employee-login')} />} />

      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/employee-login" element={<EmployeeLogin />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
      <Route path="/add-records" element={<AddEmployeeRecords />} />
    </Routes>
    </>
  );
}

export default App;

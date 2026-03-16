import React, { useState } from "react";
import AddEmployee from "./AddEmployee";
import UpdateDeleteEmployee from "./UpdateDeleteEmployee";
import ViewEmployeeDetails from "./ViewEmployeeDetails";
import AddEmployeeRecords from "./AddEmployeeRecords";
import LeaveRequest from "../components/LeaveRequest";
import { FiUserPlus, FiEdit, FiSearch, FiFileText, FiCalendar, FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [selected, setSelected] = useState("view");
  const navigate = useNavigate();

  const menuItems = [
    { id: 'view', label: 'View Employees', icon: <FiSearch /> },
    { id: 'add', label: 'Add Employee', icon: <FiUserPlus /> },
    { id: 'update', label: 'Manage Data', icon: <FiEdit /> },
    { id: 'records', label: 'Add Records', icon: <FiFileText /> },
    { id: 'leaves', label: 'Leave Requests', icon: <FiCalendar /> },
  ];

  return (
    <div className="min-h-screen bg-bg-main flex">
      {/* Sidebar */}
      <aside className="w-72 bg-bg-sidebar border-r border-border-glass flex flex-col p-6">
        <div className="mb-10 px-2">
          <h1 className="text-2xl font-black tracking-tighter text-white">
            PAYROLL<span className="text-primary">.</span>
          </h1>
          <p className="text-xs text-text-muted mt-1 uppercase tracking-widest font-bold">Admin Panel</p>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelected(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                selected === item.id 
                  ? 'bg-primary text-white shadow-lg shadow-primary-soft' 
                  : 'text-text-secondary hover:bg-white-5 hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <button 
          onClick={() => navigate('/')}
          className="mt-auto flex items-center gap-3 px-4 py-3 text-text-muted hover:text-danger transition-colors"
        >
          <FiLogOut />
          Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-auto">
        <header className="mb-10 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-white capitalize">{selected.replace('-', ' ')}</h2>
            <p className="text-text-secondary mt-1">Manage your organization's payroll and employees.</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-accent"></div>
             <div className="text-sm">
                <p className="text-white font-bold">Admin Account</p>
                <p className="text-text-muted">Superuser</p>
             </div>
          </div>
        </header>

        <div className="animate-fade-in">
          <div className="glass rounded-3xl p-8 min-h-600">
            {selected === "add" && <AddEmployee />}
            {selected === "update" && <UpdateDeleteEmployee />}
            {selected === "view" && <ViewEmployeeDetails />}
            {selected === "records" && <AddEmployeeRecords />}
            {selected === "leaves" && <LeaveRequest />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

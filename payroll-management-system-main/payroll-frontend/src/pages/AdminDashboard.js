import React, { useState } from "react";
import { motion } from "framer-motion";
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
  const adminData = JSON.parse(localStorage.getItem('userData') || '{}');

  const menuItems = [
    { id: 'view', label: 'Fleet Overview', icon: <FiSearch /> },
    { id: 'add', label: 'Onboard Node', icon: <FiUserPlus /> },
    { id: 'update', label: 'Database Control', icon: <FiEdit /> },
    { id: 'records', label: 'System Logs', icon: <FiFileText /> },
    { id: 'leaves', label: 'Queue Requests', icon: <FiCalendar /> },
  ];

  const handleSignOut = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-midnight text-primary flex">
      {/* Sidebar */}
      <aside className="w-72 bg-surface border-r border-neon flex flex-col p-6">
        <div className="mb-10 px-2">
          <h1 className="text-2xl font-black tracking-tighter text-white uppercase">
            Core<span className="text-accent">.</span>Logic
          </h1>
          <p className="text-[10px] text-accent mt-1 uppercase tracking-[0.2em] font-black">Command Console</p>
        </div>

        <nav className="flex-1 space-y-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelected(item.id)}
              className={`sidebar-btn ${selected === item.id ? 'active' : ''}`}
            >
              <div className="icon-box" style={{ flexShrink: 0 }}>
                {item.icon}
              </div>
              <span className="font-black" style={{ whiteSpace: 'nowrap' }}>{item.label}</span>
            </button>
          ))}
        </nav>

        <button
          onClick={handleSignOut}
          className="mt-auto flex items-center gap-3 px-4 py-3 text-text-muted hover:text-error transition-colors uppercase text-xs font-black tracking-widest"
        >
          <FiLogOut />
          Abort Session
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-auto">
        <header className="mb-10 flex justify-between items-center">
          <div>
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-1">
              {selected.replace('-', ' ')}
            </h2>
            <p className="text-text-secondary text-sm tracking-wide">Interface active // Access level: Administrator</p>
          </div>
          <div className="flex items-center gap-4 bg-surface p-2 pr-6 rounded-full border border-neon">
            <div className="h-10 w-10 rounded-full bg-accent-primary shadow-neon flex items-center justify-center text-white font-black">
              {adminData.first_name?.[0]}{adminData.last_name?.[0]}
            </div>
            <div>
              <p className="text-white text-xs font-black uppercase tracking-widest">{adminData.first_name} {adminData.last_name}</p>
              <p className="text-cyan text-[10px] font-bold uppercase tracking-widest">Administrator</p>
            </div>
          </div>
        </header>

        <div className="animate-fade-in shadow-neon">
          <div className="bg-surface rounded-xl p-8 min-h-600 border border-neon">
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

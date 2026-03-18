import React, { useState } from "react";
import AddEmployee from "./AddEmployee";
import UpdateDeleteEmployee from "./UpdateDeleteEmployee";
import ViewEmployeeDetails from "./ViewEmployeeDetails";
import AddEmployeeRecords from "./AddEmployeeRecords";
import LeaveRequest from "../components/LeaveRequest";
import { FiUserPlus, FiEdit, FiSearch, FiFileText, FiCalendar, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [selected, setSelected] = useState("view");
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
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
    <div className="h-screen w-full overflow-hidden bg-midnight text-primary flex relative">
      {/* Sidebar Overlay for mobile */}
      {isSidebarOpen && window.innerWidth <= 768 && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`relative z-50 h-full bg-surface flex flex-col py-6 transition-all duration-300 ${isSidebarOpen ? 'border-r border-neon' : 'border-none'}`}
        style={{
          width: isSidebarOpen ? '18rem' : '0px',
          minWidth: isSidebarOpen ? '18rem' : '0px',
          paddingLeft: isSidebarOpen ? '1.5rem' : '0px',
          paddingRight: isSidebarOpen ? '1.5rem' : '0px',
          opacity: isSidebarOpen ? 1 : 0,
          visibility: isSidebarOpen ? 'visible' : 'hidden',
          overflow: 'hidden',
          transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)'
        }}
      >
        <div className="w-60 flex flex-col h-full shrink-0">
          <div className="mb-10 px-2 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-black tracking-tighter text-white uppercase">
                Core<span className="text-accent">.</span>Logic
              </h1>
              <p className="text-[10px] text-accent mt-1 uppercase tracking-[0.2em] font-black">Command Console</p>
            </div>
            <button 
              className="text-text-secondary hover:text-white"
              onClick={() => setIsSidebarOpen(false)}
            >
              <FiX size={24} />
            </button>
          </div>

          <nav className="flex-1 space-y-3">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setSelected(item.id);
                  if (window.innerWidth <= 768) setIsSidebarOpen(false);
                }}
                className={`sidebar-btn w-full ${selected === item.id ? 'active' : ''}`}
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
            className="mt-auto sidebar-btn w-full"
          >
            <div className="icon-box" style={{ flexShrink: 0 }}>
              <FiLogOut />
            </div>
            <span className="font-black" style={{ whiteSpace: 'nowrap' }}>Abort Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-x-hidden overflow-y-auto transition-all duration-300 min-w-0">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 w-full">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-3 bg-surface border border-neon rounded-xl text-white hover:text-accent transition-colors shadow-lg shrink-0"
            >
              <FiMenu className="text-2xl" />
            </button>
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter mb-1">
                {selected.replace('-', ' ')}
              </h2>
              <p className="text-text-secondary text-xs md:text-sm tracking-wide">Interface active // Access level: Administrator</p>
            </div>
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

        <div className="animate-fade-in shadow-neon w-full max-w-full">
          <div className="bg-surface rounded-xl p-4 md:p-8 min-h-600 border border-neon w-full max-w-full overflow-x-hidden">
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

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiDollarSign, FiCalendar, FiClock, FiDownload, FiMail, FiLogOut, FiBriefcase } from "react-icons/fi";
import jsPDF from "jspdf";
import toast from "react-hot-toast";
import EmployeeLeaveForm from "../components/EmployeeLeaveForm";

const EmployeeDashboard = () => {
    const navigate = useNavigate();
    const employee = JSON.parse(localStorage.getItem('userData') || '{}');
    const token = localStorage.getItem('token');
    const [selected, setSelected] = useState("dashboard");

    const getNextSyncDate = () => {
        const today = new Date();
        const nextSync = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        return nextSync.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const [stats] = useState({
        netSalary: null,
        nextPayroll: getNextSyncDate()
    });

    const [recentActivity, setRecentActivity] = useState([]);

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}/getRecentActivity/${employee.employee_id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.activity) {
                    setRecentActivity(data.activity);
                }
            } catch (error) {
                console.error("Failed to load execution logs");
            }
        };

        if (employee.employee_id) {
            fetchActivity();
        }
    }, [employee.employee_id, token]);

    const handleSignOut = () => {
        localStorage.clear();
        navigate('/');
    };

    const handleDownloadPayslip = () => {
        const doc = new jsPDF();
        doc.setFont("helvetica", "bold");
        doc.text("OFFICIAL PAYSLIP", 105, 20, { align: "center" });
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Employee: ${employee.first_name || 'User'} ${employee.last_name || ''}`, 20, 40);
        doc.text(`Designation: ${employee.job_title || 'Personnel'}`, 20, 50);
        doc.text(`Net Salary: ₹${stats.netSalary || '45,000'}`, 20, 60);
        doc.save(`Payslip_${employee.first_name || 'employee'}.pdf`);
    };

    return (
        <div className="min-h-screen bg-midnight text-primary flex">
            {/* Sidebar */}
            <aside className="w-72 bg-surface border-r border-neon flex flex-col p-6">
                <div className="mb-10 px-2">
                    <h1 className="text-2xl font-black tracking-tighter text-white uppercase">
                        NODE<span className="text-accent">.</span>OP
                    </h1>
                    <p className="text-[10px] text-accent mt-1 uppercase tracking-[0.2em] font-black">Personnel Interface</p>
                </div>

                <nav className="flex-1 space-y-3">
                    <button onClick={() => setSelected("dashboard")} className={`sidebar-btn ${selected === 'dashboard' ? 'active' : ''}`}>
                        <div className="icon-box" style={{ flexShrink: 0 }}>
                            <FiBriefcase />
                        </div>
                        <span className="font-black" style={{ whiteSpace: 'nowrap' }}>Dashboard</span>
                    </button>
                    <button onClick={handleDownloadPayslip} className={`sidebar-btn ${selected === 'payslips' ? 'active' : ''}`}>
                        <div className="icon-box" style={{ flexShrink: 0 }}>
                            <FiDownload />
                        </div>
                        <span className="font-black" style={{ whiteSpace: 'nowrap' }}>My Payslips</span>
                    </button>
                    <button onClick={() => setSelected("leave")} className={`sidebar-btn ${selected === 'leave' ? 'active' : ''}`}>
                        <div className="icon-box" style={{ flexShrink: 0 }}>
                            <FiCalendar />
                        </div>
                        <span className="font-black" style={{ whiteSpace: 'nowrap' }}>Leave Request</span>
                    </button>
                </nav>

                <button
                    onClick={handleSignOut}
                    className="mt-auto sidebar-btn"
                >
                    <div className="icon-box" style={{ flexShrink: 0 }}>
                        <FiLogOut />
                    </div>
                    <span className="font-black" style={{ whiteSpace: 'nowrap' }}>Abort Session</span>
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-10 overflow-auto">
                <header className="mb-12 flex justify-between items-end">
                    <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                        <p className="text-cyan font-black tracking-[0.3em] uppercase text-[10px] mb-2">Workspace: Active</p>
                        <h2 className="text-5xl font-black text-white uppercase tracking-tighter">Welcome, {employee.first_name || 'Node'}</h2>
                    </motion.div>
                    <div className="text-right">
                        <p className="text-white font-black uppercase text-sm tracking-widest">{employee.job_title || 'Authorized Personnel'}</p>
                        <p className="text-accent font-bold text-xs tracking-wide">{employee.email || 'node@system.io'}</p>
                    </div>
                </header>

                {selected === "dashboard" && (
                    <>
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                            <StatCard icon={<FiDollarSign />} label="Net Earning" value={`₹${stats.netSalary || '45,000'}`} />
                            <StatCard icon={<FiCalendar />} label="Next Sync" value={stats.nextPayroll} />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Activity Feed */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="lg:col-span-2 bg-surface rounded-xl p-8 border border-neon"
                            >
                                <h3 className="text-xs font-black text-accent-primary uppercase tracking-[0.2em] mb-6">Execution Logs</h3>
                                <div className="space-y-6">
                                    {recentActivity.length > 0 ? recentActivity.map((activity, i) => (
                                        <div key={i} className="flex items-start gap-4 border-l-2 border-accent-primary opacity-30 pl-4 py-1">
                                            <p className="text-secondary text-sm font-medium tracking-wide">{activity}</p>
                                        </div>
                                    )) : (
                                        <div className="flex items-start gap-4 border-l-2 border-white-10 opacity-30 pl-4 py-1">
                                            <p className="text-secondary text-sm font-medium tracking-wide">No recent execution logs found.</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>

                            {/* Quick Actions */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="bg-surface rounded-xl p-8 border border-neon"
                            >
                                <h3 className="text-xs font-black text-accent uppercase tracking-[0.2em] mb-6">Macro Controls</h3>
                                <div className="space-y-4">
                                    <ActionButton icon={<FiDownload />} label="Pull Latest Slip" onClick={handleDownloadPayslip} primary />
                                    <ActionButton icon={<FiCalendar />} label="Request Time-Out" onClick={() => setSelected("leave")} />
                                    <ActionButton icon={<FiMail />} label="Secure HR Comms" onClick={() => window.location.href = 'mailto:hr@payroll.io'} />
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}

                {selected === "leave" && (
                    <EmployeeLeaveForm employeeId={employee.employee_id} />
                )}
            </main>
        </div>
    );
};

const StatCard = ({ icon, label, value }) => (
    <motion.div whileHover={{ scale: 1.02 }} className="bg-surface p-6 rounded-xl border border-neon shadow-neon">
        <div className="w-10 h-10 bg-midnight rounded-lg flex items-center justify-center text-accent-primary border border-neon mb-4">
            {icon}
        </div>
        <p className="text-text-secondary text-[10px] uppercase font-black tracking-widest">{label}</p>
        <p className="text-2xl font-black text-white mt-1 uppercase tracking-tighter" style={{ fontFamily: 'monospace' }}>{value}</p>
    </motion.div>
);

const ActionButton = ({ icon, label, onClick, primary }) => (
    <button
        onClick={onClick}
        className={`sidebar-btn ${primary ? 'active' : ''}`}
    >
        <div className="icon-box" style={{ flexShrink: 0 }}>
            {icon}
        </div>
        <span className="font-black" style={{ whiteSpace: 'nowrap' }}>{label}</span>
    </button>
);

export default EmployeeDashboard;

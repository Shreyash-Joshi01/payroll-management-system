import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiDollarSign, FiCalendar, FiClock, FiDownload, FiMail, FiLogOut, FiBriefcase } from "react-icons/fi";
import jsPDF from "jspdf";

const EmployeeDashboard = () => {
    const navigate = useNavigate();
    const employee = JSON.parse(localStorage.getItem('userData') || '{}');

    const [stats] = useState({
        netSalary: null,
        leaveBalance: "15/20",
        attendanceRate: "98%",
        nextPayroll: "Oct 31, 2024"
    });

    const [recentActivity] = useState([
        "Salary credited for September 2024",
        "Leave request for Oct 5 approved",
        "Updated bank details successfully"
    ]);

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
                    <button className="sidebar-btn active">
                        <div className="icon-box">
                            <FiBriefcase />
                        </div>
                        <span className="font-black">Dashboard</span>
                    </button>
                    <button onClick={handleDownloadPayslip} className="sidebar-btn">
                        <div className="icon-box">
                            <FiDownload />
                        </div>
                        <span className="font-black">My Payslips</span>
                    </button>
                    <button className="sidebar-btn">
                        <div className="icon-box">
                            <FiCalendar />
                        </div>
                        <span className="font-black">Leave Request</span>
                    </button>
                </nav>

                <button
                    onClick={handleSignOut}
                    className="mt-auto flex items-center gap-3 px-4 py-3 text-text-muted hover:text-error transition-colors uppercase text-xs font-black tracking-widest"
                >
                    <FiLogOut /> Abort Session
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

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <StatCard icon={<FiDollarSign />} label="Net Earning" value={`₹${stats.netSalary || '45,000'}`} />
                    <StatCard icon={<FiCalendar />} label="Leave Credits" value={stats.leaveBalance} />
                    <StatCard icon={<FiClock />} label="Clock Rate" value={stats.attendanceRate} />
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
                            {recentActivity.map((activity, i) => (
                                <div key={i} className="flex items-start gap-4 border-l-2 border-accent-primary opacity-30 pl-4 py-1">
                                    <p className="text-secondary text-sm font-medium tracking-wide">{activity}</p>
                                </div>
                            ))}
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
                            <ActionButton icon={<FiCalendar />} label="Request Time-Out" />
                            <ActionButton icon={<FiMail />} label="Secure HR Comms" onClick={() => window.location.href = 'mailto:hr@payroll.io'} />
                        </div>
                    </motion.div>
                </div>
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
        className={`w-full flex items-center gap-3 px-4 py-4 rounded-lg font-black text-xs uppercase tracking-widest transition-all ${primary
            ? 'bg-accent text-white shadow-neon hover:shadow-neon-lg'
            : 'bg-bg-elevated text-text-secondary hover:text-white border border-border'
            }`}
    >
        {icon}
        {label}
    </button>
);

export default EmployeeDashboard;

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../apiConfig';
import { FiDollarSign, FiCalendar, FiClock, FiDownload, FiMail, FiLogOut, FiBriefcase } from "react-icons/fi";
import jsPDF from "jspdf";
import toast from "react-hot-toast";

const EmployeeDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const employee = location.state?.employee || JSON.parse(localStorage.getItem('userData'));
    const token = localStorage.getItem('token');

    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!employee) {
            navigate('/login');
            return;
        }

        const fetchActivity = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/getRecentActivity/${employee.employee_id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                setRecentActivity(data.activity || []);
            } catch (err) {
                console.error("Activity fetch failed:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchActivity();
    }, [employee, navigate, token]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        localStorage.removeItem('role');
        toast.success("Safe logout successful");
        navigate('/');
    };

    const generatePayslipPDF = () => {
        const doc = new jsPDF();
        doc.setFont("helvetica", "bold");
        doc.text("EMPLOYEE PAYSLIP (PREVIEW)", 105, 20, { align: "center" });
        doc.line(20, 25, 190, 25);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Employee Name: ${employee.first_name} ${employee.last_name}`, 20, 40);
        doc.text(`Position: ${employee.job_title}`, 20, 50);
        doc.text(`Current Salary: ₹${employee.salary.toLocaleString()}`, 20, 60);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 70);
        doc.save(`${employee.first_name}_Payslip.pdf`);
    };

    if (!employee) return null;

    return (
        <div className="min-h-screen bg-primary p-4 md:p-8">
            <div className="blob blob-1"></div>
            <div className="blob blob-2"></div>

            <div className="max-w-7xl mx-auto space-y-8 animate-fade-in relative z-10">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 glass p-8 rounded-[2rem] border border-white-10">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-primary-10 rounded-2xl flex items-center justify-center text-primary border border-primary-20 shadow-neon">
                            <span className="text-2xl font-black">{employee.first_name[0]}{employee.last_name[0]}</span>
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Welcome, {employee.first_name}</h1>
                            <div className="flex items-center gap-3 mt-1">
                                <span className="text-text-secondary text-sm font-medium">{employee.job_title}</span>
                                <span className="w-1 h-1 bg-white-20 rounded-full"></span>
                                <span className="text-primary text-xs font-black uppercase tracking-widest bg-primary-10 px-2 py-0.5 rounded-md border border-primary-20">{employee.departments?.department_name || "MEMBER"}</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="flex items-center gap-2 bg-white-5 hover:bg-danger/10 text-white hover:text-danger px-6 py-3 rounded-2xl border border-white-10 transition-all font-black text-xs uppercase tracking-widest">
                        <FiLogOut size={16} /> Secure Logout
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatCard icon={<FiDollarSign />} label="Net Salary" value={`₹${employee.salary.toLocaleString()}`} color="primary" />
                            <StatCard icon={<FiCalendar />} label="Status" value={employee.status} color="success" />
                            <StatCard icon={<FiClock />} label="Shift" value="Regular (9-5)" color="accent" />
                        </div>

                        <div className="glass rounded-[2rem] p-8 border border-white-10">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-xl font-black text-white uppercase tracking-tight">Recent Activity Log</h3>
                                <FiBriefcase className="text-text-muted" />
                            </div>
                            {loading ? (
                                <div className="py-12 flex flex-col items-center gap-3">
                                    <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                                    <p className="text-text-muted text-xs font-black uppercase tracking-widest">Syncing Records...</p>
                                </div>
                            ) : recentActivity.length > 0 ? (
                                <div className="space-y-4">
                                    {recentActivity.map((activity, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-5 bg-white-5 rounded-2xl border border-white-5 hover:border-white-10 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-midnight rounded-xl flex items-center justify-center text-primary border border-white-10">
                                                    <FiClock size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-white font-bold text-sm uppercase tracking-tight">{activity.action_type}</p>
                                                    <p className="text-text-muted text-xs">{new Date(activity.timestamp).toLocaleString()}</p>
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-black text-secondary uppercase tracking-widest bg-midnight px-3 py-1.5 rounded-lg border border-white-10">Verified</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 bg-white-5 rounded-2xl border border-dashed border-white-10 text-center">
                                    <p className="text-text-muted text-sm font-medium">No recent system transactions logged.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="glass rounded-[2rem] p-8 border border-white-10 overflow-hidden relative">
                            <div className="relative z-10">
                                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">Internal Assets</h3>
                                <p className="text-text-secondary text-xs mb-8">Quick access to secure documents.</p>
                                <div className="space-y-4">
                                    <button onClick={generatePayslipPDF} className="w-full flex items-center justify-between p-5 bg-primary rounded-2xl text-white font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary-soft">
                                        Download PDF Payslip <FiDownload size={18} />
                                    </button>
                                    <div className="p-5 bg-white-5 rounded-2xl border border-white-10 space-y-3">
                                        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Network Details</p>
                                        <div className="flex items-center gap-3 text-white text-sm">
                                            <FiMail className="text-primary" />
                                            <span className="font-bold truncate">{employee.email}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-primary to-accent p-8 rounded-[2rem] text-white shadow-2xl shadow-primary/20">
                            <h4 className="font-black text-lg uppercase tracking-tight mb-2">Neural Link Active</h4>
                            <p className="text-white/80 text-xs leading-relaxed">Your account is synchronized with the central payroll ledger. All updates are real-time.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, color }) => (
    <div className="glass p-6 rounded-3xl border border-white-10 hover:border-white-20 transition-all">
        <div className={`w-10 h-10 bg-${color}-10 rounded-xl flex items-center justify-center text-${color} mb-4 border border-${color}-20 shadow-lg shadow-${color}-soft`}>
            {React.cloneElement(icon, { size: 20 })}
        </div>
        <p className="text-text-muted text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
        <p className="text-white text-2xl font-black tracking-tight">{value}</p>
    </div>
);

export default EmployeeDashboard;

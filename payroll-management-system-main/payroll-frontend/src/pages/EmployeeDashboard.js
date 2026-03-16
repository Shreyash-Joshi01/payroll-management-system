import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiDollarSign, FiCalendar, FiClock, FiDownload, FiMail, FiLogOut, FiBriefcase } from "react-icons/fi";
import jsPDF from "jspdf";

const EmployeeDashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const employee = location.state?.employee;

    const [stats, setStats] = useState({
        netSalary: null,
        leaveBalance: "15/20",
        attendanceRate: "98%",
        nextPayroll: "Oct 31, 2024"
    });

    const [recentActivity, setRecentActivity] = useState([
        "Salary credited for September 2024",
        "Leave request for Oct 5 approved",
        "Updated bank details successfully"
    ]);

    useEffect(() => {
        if (!employee) {
            navigate('/employee-login');
            return;
        }
        // Data fetching logic would go here, refactored for Supabase client or API
    }, [employee, navigate]);

    const handleDownloadPayslip = () => {
        const doc = new jsPDF();
        doc.setFont("helvetica", "bold");
        doc.text("OFFICIAL PAYSLIP", 105, 20, { align: "center" });
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Employee: ${employee?.first_name} ${employee?.last_name}`, 20, 40);
        doc.text(`Designation: ${employee?.job_title}`, 20, 50);
        doc.text(`Net Salary: ₹${stats.netSalary || '45,000'}`, 20, 60);
        doc.save(`Payslip_${employee?.first_name}.pdf`);
    };

    const handleContactHR = () => {
        window.location.href = 'mailto:hr@payroll.com?subject=Employee Query';
    };

    return (
        <div className="min-h-screen bg-bg-main flex">
            {/* Sidebar */}
            <aside className="w-72 bg-bg-sidebar border-r border-border-glass flex flex-col p-6">
                <div className="mb-10 px-2">
                    <h1 className="text-2xl font-black tracking-tighter text-white">
                        PAYROLL<span className="text-primary">.</span>
                    </h1>
                    <p className="text-xs text-text-muted mt-1 uppercase tracking-widest font-bold">Employee Portal</p>
                </div>

                <nav className="flex-1 space-y-2">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium bg-primary text-white shadow-lg shadow-primary-soft">
                        <FiBriefcase /> Dashboard
                    </button>
                    <button onClick={handleDownloadPayslip} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-text-secondary hover:bg-white-5 hover:text-white transition-all">
                        <FiDownload /> My Payslips
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-text-secondary hover:bg-white-5 hover:text-white transition-all">
                        <FiCalendar /> Leave Requests
                    </button>
                </nav>

                <button 
                  onClick={() => navigate('/')}
                  className="mt-auto flex items-center gap-3 px-4 py-3 text-text-muted hover:text-danger transition-colors underline-offset-4 hover:underline"
                >
                    <FiLogOut /> Sign Out
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-10 overflow-auto">
                <header className="mb-12 flex justify-between items-end">
                    <div>
                        <p className="text-primary font-bold tracking-widest uppercase text-xs mb-2">Workspace Overview</p>
                        <h2 className="text-4xl font-bold text-white">Welcome, {employee?.first_name}!</h2>
                    </div>
                    <div className="text-right">
                        <p className="text-white font-bold">{employee?.job_title}</p>
                        <p className="text-text-muted text-sm">{employee?.email}</p>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <StatCard icon={<FiDollarSign />} label="Monthly Net Salary" value={`₹${stats.netSalary || '45,000'}`} />
                    <StatCard icon={<FiCalendar />} label="Leave Balance" value={stats.leaveBalance} />
                    <StatCard icon={<FiClock />} label="Attendance" value={stats.attendanceRate} />
                    <StatCard icon={<FiCalendar />} label="Next Payout" value={stats.nextPayroll} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Activity Feed */}
                    <div className="lg:col-span-2 glass rounded-3xl p-8">
                        <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
                        <div className="space-y-6">
                            {recentActivity.map((activity, i) => (
                                <div key={i} className="flex items-start gap-4 animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                                    <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                                    <p className="text-text-secondary">{activity}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="glass rounded-3xl p-8">
                        <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
                        <div className="space-y-4">
                            <ActionButton icon={<FiDownload />} label="Download Latest Payslip" onClick={handleDownloadPayslip} primary />
                            <ActionButton icon={<FiCalendar />} label="Request Time Off" />
                            <ActionButton icon={<FiMail />} label="Contact HR Support" onClick={handleContactHR} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

const StatCard = ({ icon, label, value }) => (
    <div className="glass glass-hover p-6 rounded-3xl">
        <div className="w-10 h-10 bg-white-5 rounded-xl flex items-center justify-center text-primary mb-4">
            {icon}
        </div>
        <p className="text-text-muted text-sm font-medium">{label}</p>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
    </div>
);

const ActionButton = ({ icon, label, onClick, primary }) => (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl font-semibold transition-all ${
        primary 
          ? 'bg-primary text-white shadow-lg shadow-primary-soft hover:bg-primary-hover' 
          : 'bg-white-5 text-text-secondary hover:bg-white-10 hover:text-white'
      }`}
    >
        {icon}
        {label}
    </button>
);

export default EmployeeDashboard;

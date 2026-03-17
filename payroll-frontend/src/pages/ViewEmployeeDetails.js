import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import { FiFileText, FiDownload, FiX, FiUsers, FiSearch } from "react-icons/fi";
import toast from "react-hot-toast";

const PayslipModal = ({ employeeId, onClose }) => {
  const [payslip, setPayslip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}/getPayslip/${employeeId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setPayslip(data.payslip);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to fetch payslip details.");
        setLoading(false);
      });
  }, [employeeId]);

  const handleDownloadPDF = () => {
    if (!payslip) return;
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.text("OFFICIAL PAYSLIP", 105, 15, { align: "center" });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Employee: ${payslip.first_name} ${payslip.last_name}`, 20, 35);
    doc.text(`Designation: ${payslip.job_title}`, 20, 45);
    doc.text(`Department: ${payslip.department_name}`, 20, 55);
    doc.text(`Period: ${payslip.payslip_date}`, 20, 65);
    doc.line(20, 70, 190, 70);
    doc.setFont("helvetica", "bold");
    doc.text(`Total Earnings: ₹${payslip.gross_salary}`, 20, 80);
    doc.text(`Total Deductions: ₹${payslip.total_deductions || 0}`, 20, 90);
    doc.text(`NET PAYABLE: ₹${payslip.net_salary}`, 20, 105);
    doc.save(`Payslip_${payslip.first_name}.pdf`);
  };

  if (loading) return null;

  return (
    <div className="fixed inset-0 bg-black-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass rounded-3xl p-8 w-full max-w-lg relative animate-fade-in border border-white-20">
        <button className="absolute top-6 right-6 text-text-muted hover:text-white transition-colors" onClick={onClose}>
          <FiX size={24} />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiFileText size={32} className="text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-white uppercase tracking-tight">Employee Payslip</h2>
          <p className="text-text-secondary text-sm">Review detailed salary breakdown</p>
        </div>

        <div className="space-y-4 bg-white-5 rounded-2xl p-6 border border-white-5 mb-8">
          <DetailRow label="Employee Name" value={`${payslip.first_name} ${payslip.last_name}`} />
          <DetailRow label="Job Title" value={payslip.job_title} />
          <DetailRow label="Department" value={payslip.department_name} />
          <div className="h-px bg-white-10 my-2"></div>
          <DetailRow label="Gross Salary" value={`₹${payslip.gross_salary}`} />
          <DetailRow label="Net Payable" value={`₹${payslip.net_salary}`} highlight />
        </div>

        <button
          className="w-full py-4 bg-primary hover:bg-primary-hover text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary-soft"
          onClick={handleDownloadPDF}
        >
          <FiDownload /> Download Statement (PDF)
        </button>
      </div>
    </div>
  );
};

const DetailRow = ({ label, value, highlight }) => (
  <div className="flex justify-between items-center text-sm">
    <span className="text-text-muted font-medium">{label}</span>
    <span className={`font-bold ${highlight ? 'text-primary text-lg' : 'text-white'}`}>{value}</span>
  </div>
);

const ViewEmployeeDetails = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPayslip, setShowPayslip] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}/getAllEmployees`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setEmployees(data.employees || []);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load employee data.");
        setLoading(false);
      });
  }, []);

  const filteredEmployees = employees.filter(emp =>
    `${emp.first_name} ${emp.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.job_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 animate-pulse">
      <FiUsers size={48} className="text-text-muted mb-4" />
      <p className="text-text-muted">Fetching latest records...</p>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Employee Directory</h2>
          <p className="text-text-secondary mt-1">Found {filteredEmployees.length} registered members.</p>
        </div>
        <div className="relative w-full md:w-80 group">
          <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-cyan to-transparent opacity-0 group-focus-within:opacity-100 transition-all duration-500 shadow-[0_1px_10px_rgba(0,240,255,0.3)]"></div>
          <div className="relative flex items-center bg-midnight border-b border-neon px-4 py-3 group-focus-within:border-cyan transition-all duration-300">
            <div className="flex items-center justify-center mr-3 text-muted group-focus-within:text-cyan transition-colors">
              <FiSearch size={18} />
            </div>
            <input
              type="text"
              placeholder="SEARCH DIRECTORY..."
              className="w-full bg-transparent !bg-none border-none text-white focus:outline-none placeholder:text-muted text-[10px] font-black tracking-[0.2em]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="glass rounded-3xl overflow-hidden animate-fade-in">
        <div className="overflow-x-auto">
          <table className="w-full text-left" style={{ tableLayout: 'fixed' }}>
            <thead>
              <tr className="bg-midnight text-xs text-secondary uppercase tracking-widest border-b border-neon">
                <th className="px-6 py-5 font-black" style={{ width: '8%' }}>ID</th>
                <th className="px-6 py-5 font-black" style={{ width: '22%' }}>Member</th>
                <th className="px-6 py-5 font-black" style={{ width: '20%' }}>Department</th>
                <th className="px-6 py-5 font-black" style={{ width: '18%' }}>Salary</th>
                <th className="px-6 py-5 font-black text-cyan" style={{ width: '15%' }}>Status</th>
                <th className="px-6 py-5 font-black text-right" style={{ width: '17%' }}>Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neon">
              {filteredEmployees.map(emp => (
                <tr key={emp.employee_id} className="text-sm text-text-secondary hover:bg-white-5 transition-colors group">
                  <td className="px-6 py-5 font-mono text-xs text-cyan opacity-70">{emp.employee_id}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-midnight border border-neon flex items-center justify-center text-secondary font-bold text-xs shadow-neon">
                        {emp.first_name[0]}{emp.last_name[0]}
                      </div>
                      <div>
                        <p className="text-white font-black tracking-tight">{emp.first_name} {emp.last_name}</p>
                        <p className="text-xs text-secondary">{emp.job_title}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">{emp.departments?.department_name || "N/A"}</td>
                  <td className="px-6 py-5 font-medium text-white">₹{emp.salary.toLocaleString()}</td>
                  <td className="px-6 py-5">
                    <span className={`px-2 py-1 rounded-md text-xs font-black uppercase ${emp.status === 'Active' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                      }`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button
                      className="bg-primary-10 text-primary hover:bg-primary border border-primary-20 hover:text-midnight px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
                      onClick={() => setShowPayslip(emp.employee_id)}
                    >
                      View Slip
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showPayslip && <PayslipModal employeeId={showPayslip} onClose={() => setShowPayslip(null)} />}
    </div>
  );
};

export default ViewEmployeeDetails;

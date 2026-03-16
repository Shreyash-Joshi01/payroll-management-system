import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import { FiFileText, FiDownload, FiX, FiUsers, FiSearch } from "react-icons/fi";
import toast from "react-hot-toast";

const PayslipModal = ({ employeeId, onClose }) => {
  const [payslip, setPayslip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/getPayslip/${employeeId}`)
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
    fetch("http://localhost:5000/getAllEmployees")
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
        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <input 
            type="text" 
            placeholder="Search by name or title..." 
            className="w-full bg-white-5 border border-white-10 rounded-2xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-primary transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="glass rounded-3xl overflow-hidden animate-fade-in">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white-5 text-xs text-text-muted uppercase tracking-widest">
                <th className="px-6 py-5 font-black">ID</th>
                <th className="px-6 py-5 font-black">Member</th>
                <th className="px-6 py-5 font-black">Department</th>
                <th className="px-6 py-5 font-black">Salary</th>
                <th className="px-6 py-5 font-black">Status</th>
                <th className="px-6 py-5 font-black text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white-5">
              {filteredEmployees.map(emp => (
                <tr key={emp.employee_id} className="text-sm text-text-secondary hover:bg-white-5 transition-colors group">
                  <td className="px-6 py-5 font-mono text-xs">{emp.employee_id}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-20 flex items-center justify-center text-primary font-bold text-xs">
                        {emp.first_name[0]}{emp.last_name[0]}
                      </div>
                      <div>
                        <p className="text-white font-bold">{emp.first_name} {emp.last_name}</p>
                        <p className="text-xs">{emp.job_title}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">{emp.department_name || "N/A"}</td>
                  <td className="px-6 py-5 font-medium text-white">₹{emp.salary.toLocaleString()}</td>
                  <td className="px-6 py-5">
                    <span className={`px-2 py-1 rounded-md text-xs font-black uppercase ${
                      emp.status === 'Active' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                    }`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button 
                      className="text-primary hover:text-primary-hover font-bold text-xs uppercase tracking-tight transition-colors"
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

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FiPlus, FiUser, FiLayers, FiFileText } from "react-icons/fi";

const recordTypes = [
    { id: 'Payroll', label: 'Payroll Entry', fields: ['total_earnings', 'total_deductions', 'net_salary', 'payroll_date'] },
    { id: 'Overtime', label: 'Overtime Hours', fields: ['overtime_hours', 'rate_per_hour', 'overtime_pay', 'overtime_date', 'total_amount'] },
    { id: 'Bonuses', label: 'Bonuses & Incentives', fields: ['bonus_amount', 'bonus_date'] },
    { id: 'Attendance', label: 'Attendance Record', fields: ['unpaid_leave_days', 'salary_adjustment', 'attendance_date', 'clock_in_time', 'clock_out_time'] },
    { id: 'LeaveManagement', label: 'Leave Requests', fields: ['leave_type', 'leave_start', 'leave_end'] },
    { id: 'Deductions', label: 'Deductions', fields: ['tax', 'insurance', 'loan_repayment', 'total_deductions', 'deduction_name'] },
    { id: 'Allowances', label: 'Allowances', fields: ['allowance_name', 'amount'] }
];

const AddEmployeeRecords = () => {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [selectedRecordType, setSelectedRecordType] = useState('');
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}/getAllEmployees`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setEmployees(data.employees || []))
            .catch(() => toast.error("Unable to load employees"));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedEmployee || !selectedRecordType) {
            return toast.error("Select employee and record type");
        }

        setLoading(true);
        const loadToast = toast.loading("Saving record...");

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}/addRecord/${selectedRecordType}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ employee_id: selectedEmployee, ...formData })
            });

            if (res.ok) {
                toast.success("Record documented successfully", { id: loadToast });
                setFormData({});
            } else {
                toast.error("Process failed", { id: loadToast });
            }
        } catch {
            toast.error("Network instability", { id: loadToast });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-20">
            <div>
                <h2 className="text-2xl font-bold text-white">Record Documentation</h2>
                <p className="text-text-secondary mt-1">Append payroll, attendance, or performance records to member profiles.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <section className="space-y-4">
                        <h3 className="text-sm font-bold text-primary uppercase tracking-widest flex items-center gap-2 px-1">
                            <FiUser /> Target Member
                        </h3>
                        <select
                            value={selectedEmployee}
                            onChange={(e) => setSelectedEmployee(e.target.value)}
                            className="w-full bg-white-5 border border-white-10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary transition-all appearance-none cursor-pointer"
                        >
                            <option value="" className="bg-bg-sidebar">Select an employee...</option>
                            {employees.map(emp => (
                                <option key={emp.employee_id} value={emp.employee_id} className="bg-bg-sidebar">
                                    {emp.first_name} {emp.last_name} (ID: {emp.employee_id})
                                </option>
                            ))}
                        </select>
                    </section>

                    <section className="space-y-4">
                        <h3 className="text-sm font-bold text-primary uppercase tracking-widest flex items-center gap-2 px-1">
                            <FiLayers /> Record Category
                        </h3>
                        <div className="grid grid-cols-1 gap-2">
                            {recordTypes.map(type => (
                                <button
                                    key={type.id}
                                    onClick={() => { setSelectedRecordType(type.id); setFormData({}); }}
                                    className={`w-full text-left px-6 py-4 rounded-2xl transition-all border ${selectedRecordType === type.id
                                            ? 'bg-primary-10 border-primary text-primary font-bold'
                                            : 'bg-white-5 border-white-5 text-text-muted hover:bg-white-10 hover:text-white'
                                        }`}
                                >
                                    {type.label}
                                </button>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="glass rounded-3xl p-8 flex flex-col">
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2 mb-8">
                        <FiFileText /> Entry Form
                    </h3>

                    {selectedRecordType ? (
                        <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-4">
                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-400">
                                {recordTypes.find(t => t.id === selectedRecordType).fields.map(field => (
                                    <div key={field} className="mb-4">
                                        <label className="text-xs font-black text-text-muted uppercase px-1 tracking-wider mb-1.5 block">
                                            {field.replace(/_/g, ' ')}
                                        </label>
                                        <input
                                            type={field.includes('date') ? 'date' : 'text'}
                                            name={field}
                                            value={formData[field] || ''}
                                            onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                                            className="w-full bg-white-5 border border-white-10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-all"
                                            required
                                        />
                                    </div>
                                ))}
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-primary hover:bg-primary-hover text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-primary-soft"
                            >
                                <FiPlus /> {loading ? 'Processing...' : `Append ${selectedRecordType}`}
                            </button>
                        </form>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 bg-white-5 rounded-2xl flex items-center justify-center text-text-muted mb-4 animate-bounce">
                                <FiPlus size={32} />
                            </div>
                            <p className="text-text-muted max-w-md text-sm font-medium">Please select a category and employee to begin.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddEmployeeRecords;

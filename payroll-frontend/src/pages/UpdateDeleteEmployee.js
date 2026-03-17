import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiEdit2, FiTrash2, FiSearch, FiX, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { API_BASE_URL } from "../apiConfig";

const tables = [
  "Employees", "Salaries", "Payroll", "BankDetails", "Allowances",
  "Bonuses", "Attendance", "Deductions", "LeaveManagement",
  "Overtime", "Taxation", "UserRoles", "SalaryGrades"
];

const UpdateRecordModal = ({ employee, onClose }) => {
  const [selectedTable, setSelectedTable] = useState("Employees");
  const [record, setRecord] = useState(null);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem('token');
    fetch(`${API_BASE_URL}/getRecord/${selectedTable}/${employee.employee_id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setRecord(data.record || null);
        setEditData(data.record || {});
      })
      .catch(() => toast.error("Failed to fetch record details"))
      .finally(() => setLoading(false));
  }, [selectedTable, employee.employee_id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Updating records...");

    try {
      const id = record?.employee_id || record?.salary_id || record?.payroll_id || record?.bank_detail_id || record?.allowance_id || record?.bonus_id || record?.attendance_id || record?.deduction_id || record?.leave_id || record?.overtime_id || record?.tax_id || record?.role_id || record?.grade_id;

      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/updateData/${selectedTable}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ id, updates: editData })
      });

      if (res.ok) {
        toast.success("Changes saved successfully", { id: loadingToast });
      } else {
        toast.error("Update failed", { id: loadingToast });
      }
    } catch (err) {
      toast.error("Network error", { id: loadingToast });
    }
  };

  return (
    <div className="fixed inset-0 bg-black-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass rounded-3xl p-8 w-full max-w-2xl relative animate-fade-in border border-white-20 max-h-90 overflow-hidden flex flex-col">
        <button className="absolute top-6 right-6 text-text-muted hover:text-white transition-colors" onClick={onClose}>
          <FiX size={24} />
        </button>

        <div className="mb-8">
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Modify Member Data</h2>
          <p className="text-secondary text-sm font-bold uppercase tracking-widest mt-1">{employee.first_name} {employee.last_name} (ID: {employee.employee_id})</p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 custom-scrollbar">
          {tables.map(table => (
            <button
              key={table}
              onClick={() => setSelectedTable(table)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${selectedTable === table
                ? 'bg-accent-primary text-white shadow-neon border-neon'
                : 'bg-elevated text-secondary hover:bg-surface hover:text-white border border-neon'
                }`}
            >
              {table}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {loading ? (
            <div className="py-12 flex justify-center">
              <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : record ? (
            <form onSubmit={handleUpdate} className="space-y-4 py-2">
              {Object.entries(record).map(([key, value]) => (
                <div key={key} className="flex flex-col gap-1.5">
                  <label className="text-xs font-black text-muted uppercase px-1 tracking-tighter">{key.replace(/_/g, ' ')}</label>
                  <input
                    className="w-full bg-midnight border border-neon rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan transition-all disabled:opacity-40"
                    value={editData[key] || ""}
                    disabled={key.endsWith('_id') || key === 'employee_id'}
                    onChange={(e) => setEditData({ ...editData, [key]: e.target.value })}
                  />
                </div>
              ))}
              <div className="pt-6 sticky bottom-0 bg-sidebar-glass backdrop-blur pb-2">
                <button type="submit" className="w-full py-4 bg-primary hover:bg-primary-hover text-white rounded-2xl font-bold transition-all shadow-xl shadow-primary-soft">
                  Save Changes to {selectedTable}
                </button>
              </div>
            </form>
          ) : (
            <div className="py-20 text-center">
              <FiAlertCircle size={48} className="text-text-muted mx-auto mb-4" />
              <p className="text-text-muted font-medium">No record found in {selectedTable} for this employee.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const UpdateDeleteEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [updateEmp, setUpdateEmp] = useState(null);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/getAllEmployees`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setEmployees(data.employees || []);
    } catch (err) {
      toast.error("Failed to connect to directory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async (employee_id) => {
    toast((t) => (
      <div className="flex flex-col gap-4">
        <p className="text-sm font-medium">Are you sure you want to delete this employee? This cannot be undone.</p>
        <div className="flex gap-2 justify-end">
          <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1.5 text-xs font-bold text-text-muted">Cancel</button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              const delToast = toast.loading("Deleting member...");
              try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${API_BASE_URL}/deleteData/Employees/${employee_id}`, {
                  method: "DELETE",
                  headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                  toast.success("Employee removed", { id: delToast });
                  setEmployees(employees.filter(e => e.employee_id !== employee_id));
                } else {
                  toast.error("Operation failed", { id: delToast });
                }
              } catch {
                toast.error("Server error", { id: delToast });
              }
            }}
            className="px-3 py-1.5 text-xs font-bold bg-danger text-white rounded-lg"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    ), { duration: 6000 });
  };

  const filtered = employees.filter(emp =>
    `${emp.first_name} ${emp.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Manage Team Members</h2>
          <p className="text-text-secondary mt-1">Update profile information or terminate employment records.</p>
        </div>
        <div className="relative w-full md:w-80 group">
          <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-cyan to-transparent opacity-0 group-focus-within:opacity-100 transition-all duration-500 shadow-[0_1px_10px_rgba(0,240,255,0.3)]"></div>
          <div className="relative flex items-center bg-midnight border-b border-neon px-4 py-3 group-focus-within:border-cyan transition-all duration-300">
            <div className="flex items-center justify-center mr-3 text-muted group-focus-within:text-cyan transition-colors">
              <FiSearch size={18} />
            </div>
            <input
              type="text"
              placeholder="SEARCH NODES..."
              className="w-full bg-transparent !bg-none border-none text-white focus:outline-none placeholder:text-muted text-[10px] font-black tracking-[0.2em]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(emp => (
          <div key={emp.employee_id} className="glass glass-hover p-6 rounded-3xl animate-fade-in group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-primary-10 rounded-2xl flex items-center justify-center text-primary font-black text-lg">
                {emp.first_name[0]}{emp.last_name[0]}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-white font-bold truncate">{emp.first_name} {emp.last_name}</p>
                <p className="text-xs text-text-muted truncate">{emp.job_title}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setUpdateEmp(emp)}
                className="flex-1 py-3 bg-midnight hover:bg-elevated text-white border border-neon rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-neon"
              >
                <FiEdit2 size={14} /> Update
              </button>
              <button
                onClick={() => handleDelete(emp.employee_id)}
                className="w-12 h-12 bg-midnight hover:bg-neon-red/10 text-muted hover:text-white border border-neon rounded-xl flex items-center justify-center transition-all"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {updateEmp && <UpdateRecordModal employee={updateEmp} onClose={() => setUpdateEmp(null)} />}
    </div>
  );
};

export default UpdateDeleteEmployee;

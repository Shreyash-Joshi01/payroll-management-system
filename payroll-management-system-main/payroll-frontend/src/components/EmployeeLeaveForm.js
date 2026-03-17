import React, { useState, useEffect } from "react";
import { FiCalendar, FiSend, FiClock } from "react-icons/fi";
import toast from "react-hot-toast";

const EmployeeLeaveForm = ({ employeeId }) => {
  const [leaveType, setLeaveType] = useState("Sick Leave");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);

  const apiBase = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
  const token = localStorage.getItem("token");

  const fetchMyRequests = async () => {
    try {
      const res = await fetch(`${apiBase}/leave/my-requests/${employeeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setRequests(data.leaveRequests || []);
    } catch {
      toast.error("Failed to load leave history");
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    if (employeeId) fetchMyRequests();
    // eslint-disable-next-line
  }, [employeeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate) return toast.error("Please select dates");
    setLoading(true);

    try {
      const res = await fetch(`${apiBase}/leave/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          employee_id: employeeId,
          leave_type: leaveType,
          leave_start: startDate,
          leave_end: endDate,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Leave request submitted!");
        setStartDate("");
        setEndDate("");

        fetchMyRequests();
      } else {
        toast.error(data.error || "Failed to submit");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (status) => {
    if (status === "Approved") return "color: #39FF14";
    if (status === "Rejected") return "color: #FF2D55";
    return "color: #00F0FF";
  };

  return (
    <div className="space-y-8">
      {/* Submit Form */}
      <div className="bg-surface rounded-xl p-8 border border-neon">
        <h3 className="text-xs font-black uppercase tracking-widest mb-6" style={{ color: "var(--accent-primary)" }}>
          <FiSend style={{ display: "inline", marginRight: "0.5rem" }} />
          Request Time-Out
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-text-muted text-[10px] font-black tracking-widest uppercase mb-2" style={{ display: "block" }}>Leave Type</label>
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-dim)",
                  borderRadius: "0.75rem",
                  color: "#fff",
                  fontSize: "0.875rem",
                  fontFamily: "inherit",
                }}
              >
                <option value="Sick Leave">Sick Leave</option>
                <option value="Casual Leave">Casual Leave</option>
                <option value="Earned Leave">Earned Leave</option>
                <option value="Unpaid Leave">Unpaid Leave</option>
              </select>
            </div>



            <div>
              <label className="text-text-muted text-[10px] font-black tracking-widest uppercase mb-2" style={{ display: "block" }}>Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-dim)",
                  borderRadius: "0.75rem",
                  color: "#fff",
                  fontSize: "0.875rem",
                  fontFamily: "inherit",
                  colorScheme: "dark",
                }}
              />
            </div>

            <div>
              <label className="text-text-muted text-[10px] font-black tracking-widest uppercase mb-2" style={{ display: "block" }}>End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-dim)",
                  borderRadius: "0.75rem",
                  color: "#fff",
                  fontSize: "0.875rem",
                  fontFamily: "inherit",
                  colorScheme: "dark",
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary flex items-center justify-center gap-2"
            style={{ maxWidth: "300px" }}
          >
            <FiSend /> {loading ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      </div>

      {/* My Requests History */}
      <div className="bg-surface rounded-xl p-8 border border-neon">
        <h3 className="text-xs font-black uppercase tracking-widest mb-6" style={{ color: "var(--accent-secondary)" }}>
          <FiClock style={{ display: "inline", marginRight: "0.5rem" }} />
          My Leave History
        </h3>

        {loadingRequests ? (
          <p className="text-text-muted text-sm">Loading...</p>
        ) : requests.length === 0 ? (
          <p className="text-text-muted text-sm">No leave requests found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left" style={{ tableLayout: "fixed" }}>
              <thead>
                <tr className="text-xs text-secondary uppercase tracking-widest border-b border-neon">
                  <th className="px-4 py-3 font-black" style={{ width: "20%" }}>Type</th>
                  <th className="px-4 py-3 font-black" style={{ width: "20%" }}>From</th>
                  <th className="px-4 py-3 font-black" style={{ width: "20%" }}>To</th>
                  <th className="px-4 py-3 font-black" style={{ width: "15%" }}>Status</th>
                  <th className="px-4 py-3 font-black" style={{ width: "25%" }}>Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neon">
                {requests.map((req, i) => (
                  <tr key={i} className="text-sm text-text-secondary">
                    <td className="px-4 py-3">{req.leave_type}</td>
                    <td className="px-4 py-3 font-mono text-xs">{req.leave_start}</td>
                    <td className="px-4 py-3 font-mono text-xs">{req.leave_end}</td>
                    <td className="px-4 py-3">
                      <span className="font-black text-xs uppercase" style={{ cssText: statusColor(req.status) }}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs">{req.approval_notes || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeLeaveForm;

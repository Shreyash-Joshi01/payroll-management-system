import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FiCalendar, FiCheck, FiX, FiClock, FiMessageSquare } from "react-icons/fi";

const LeaveRequest = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      const res = await fetch('http://localhost:5000/getLeaveRequests');
      const data = await res.json();
      setLeaveRequests(data.leaveRequests || []);
    } catch (error) {
      toast.error("Failed to fetch leave requests");
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (status, requestId) => {
    const action = status === 'Approved' ? 'approving' : 'rejecting';
    const loadToast = toast.loading(`Processing ${action}...`);

    try {
      const endpoint = status === 'Approved' ? 'approveLeave' : 'rejectLeave';
      const res = await fetch(`http://localhost:5000/${endpoint}/${requestId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: approvalNotes })
      });

      if (res.ok) {
        toast.success(`Request ${status.toLowerCase()}`, { id: loadToast });
        fetchLeaveRequests();
        setSelectedRequest(null);
        setApprovalNotes('');
      } else {
        toast.error("Operation failed", { id: loadToast });
      }
    } catch {
      toast.error("Network error", { id: loadToast });
    }
  };

  if (loading) return (
    <div className="py-20 flex flex-col items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      <p className="text-text-muted mt-4 text-sm font-medium">Scanning for open requests...</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-1">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Queue Requests</h2>
          <p className="text-secondary mt-1 text-sm tracking-wide">Review and synchronize employee time-off requests.</p>
        </div>
        <div className="flex items-center gap-2 bg-elevated border border-neon px-4 py-2 rounded-xl">
          <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse"></div>
          <span className="text-xs font-black text-white uppercase tracking-widest">{leaveRequests.filter(r => r.status === 'Pending').length} Pending Data Syncs</span>
        </div>
      </div>

      <div className="glass rounded-3xl overflow-hidden animate-fade-in border border-neon shadow-neon">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-midnight text-xs text-secondary uppercase tracking-widest border-neon border-b">
                <th className="px-6 py-5 font-black">Member</th>
                <th className="px-6 py-5 font-black">Category</th>
                <th className="px-6 py-5 font-black text-cyan">Timeline</th>
                <th className="px-6 py-5 font-black">Status</th>
                <th className="px-6 py-5 font-black text-right">Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neon">
              {leaveRequests.map((request) => (
                <tr key={request.leave_id} className="text-sm text-text-secondary hover:bg-white-5 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white-10 flex items-center justify-center font-bold text-xs text-white">
                        {request.employee_name[0]}
                      </div>
                      <div>
                        <p className="text-white font-bold">{request.employee_name}</p>
                        <p className="text-xs uppercase font-bold tracking-tighter opacity-50">{request.department_name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs font-medium bg-white-5 px-2 py-1 rounded-md border border-white-5">
                      {request.leave_type}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-white font-mono text-xs">{new Date(request.leave_start).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                      <span className="text-xs opacity-40">Until {new Date(request.leave_end).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2 py-1 rounded-md text-xs font-black uppercase tracking-widest ${request.status === 'Approved' ? 'bg-success/10 text-success' :
                        request.status === 'Rejected' ? 'bg-danger/10 text-danger' :
                          'bg-warning/10 text-warning'
                      }`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button
                      className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${request.status === 'Pending'
                          ? 'bg-accent-primary text-white shadow-neon hover:bg-accent-secondary'
                          : 'bg-elevated text-muted cursor-not-allowed opacity-40'
                        }`}
                      onClick={() => setSelectedRequest(request)}
                      disabled={request.status !== 'Pending'}
                    >
                      {request.status === 'Pending' ? 'INITIALIZE' : 'AUDITED'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {leaveRequests.length === 0 && (
            <div className="py-20 text-center">
              <FiCheck size={48} className="text-text-muted mx-auto mb-4" />
              <p className="text-text-muted font-medium">All clear! No pending leave requests.</p>
            </div>
          )}
        </div>
      </div>

      {selectedRequest && (
        <div className="fixed inset-0 bg-black-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass rounded-3xl p-8 w-full max-w-md relative animate-fade-in border border-white-20">
            <button className="absolute top-6 right-6 text-text-muted hover:text-white transition-colors" onClick={() => setSelectedRequest(null)}>
              <FiX size={24} />
            </button>
            <h3 className="text-2xl font-black text-white mb-8 tracking-tight">Review Request</h3>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white-5 p-4 rounded-2xl">
                  <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1">Status</p>
                  <p className="text-warning font-black text-xs uppercase tracking-widest flex items-center gap-2">
                    <FiClock /> {selectedRequest.status}
                  </p>
                </div>
                <div className="bg-white-5 p-4 rounded-2xl">
                  <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1">Type</p>
                  <p className="text-white font-black text-xs uppercase tracking-widest">{selectedRequest.leave_type}</p>
                </div>
              </div>

              <div className="bg-white-5 p-4 rounded-2xl border border-white-5">
                <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1">Member</p>
                <p className="text-white font-bold">{selectedRequest.employee_name}</p>
              </div>

              <div className="bg-white-5 p-4 rounded-2xl border border-white-5">
                <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3">Decision Notes</p>
                <textarea
                  className="w-full bg-white-5 border border-white-10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-all"
                  rows="3"
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  placeholder="Optional justification for this decision..."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  className="flex-1 py-4 bg-danger/10 hover:bg-danger text-text-muted hover:text-white rounded-2xl font-bold transition-all border border-danger/20"
                  onClick={() => handleDecision('Rejected', selectedRequest.leave_id)}
                >
                  Reject
                </button>
                <button
                  className="flex-1 py-4 bg-success text-white rounded-2xl font-bold shadow-lg shadow-success-soft hover-scale active:scale-95 transition-all"
                  onClick={() => handleDecision('Approved', selectedRequest.leave_id)}
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveRequest;

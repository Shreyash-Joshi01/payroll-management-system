import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiLock, FiChevronLeft } from "react-icons/fi";
import toast from "react-hot-toast";

const EmployeeLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const logToast = toast.loading("Verifying member ID...");

    try {
      const res = await fetch("http://localhost:5000/loginEmployee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Welcome, ${data.employee.first_name}`, { id: logToast });
        navigate("/employee-dashboard", { state: { employee: data.employee } });
      } else {
        toast.error(data.message || "Credential mismatch", { id: logToast });
      }
    } catch (err) {
      toast.error("Network synchronization error", { id: logToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Background Gradients */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>

      <div className="login-card animate-fade-in">
        <button onClick={() => navigate("/")} className="back-link">
          <FiChevronLeft /> Return Home
        </button>

        <div className="login-header">
             <div className="login-icon" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}>
                <FiUser size={32} />
             </div>
             <h2 className="login-title">Staff Portal</h2>
             <p className="login-subtitle">Access your automated payroll profile.</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-wrapper">
                <FiUser className="input-icon" />
                <input
                    className="form-input"
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrapper">
                <FiLock className="input-icon" />
                <input
                    className="form-input"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
            </div>
          </div>

          <div className="form-action" style={{ marginTop: '2rem' }}>
            <button type="submit" disabled={loading} className="btn btn-primary">
                {loading ? "Synchronizing..." : "Sign In to Dashboard"}
            </button>
          </div>
        </form>
      </div>
      
      <p className="login-footer">
        Powered by <span className="white-text">Finest Digital Infrastructure</span>
      </p>
    </div>
  );
};

export default EmployeeLogin;

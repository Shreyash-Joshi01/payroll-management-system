import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../apiConfig";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const logToast = toast.loading("Authenticating admin...");

    try {
      const res = await fetch(`${API_BASE_URL}/auth/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem('token', data.session.access_token);
        localStorage.setItem('userData', JSON.stringify(data.user));
        toast.success("Welcome back, Administrator", { id: logToast });
        navigate("/admin-dashboard");
      } else {
        toast.error(data.message || "Invalid credentials", { id: logToast });
      }
    } catch (err) {
      toast.error("Auth gateway timeout", { id: logToast });
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
          <FiChevronLeft /> Back to Portal
        </button>

        <div className="login-header">
          <div className="login-icon">
            <FiShield size={32} />
          </div>
          <h2 className="login-title">Admin Console</h2>
          <p className="login-subtitle">Enter credentials to access manager tools.</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">Identity</label>
            <div className="input-wrapper">
              <FiShield className="input-icon" />
              <input
                className="form-input"
                type="email"
                placeholder="admin@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Secret Key</label>
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
              {loading ? "Verifying..." : "Authorize Access"}
            </button>
          </div>
        </form>
      </div>

      <p className="login-footer">
        Secure Managed Environment <span className="white-text">v2.4.0</span>
      </p>
    </div>
  );
};

export default AdminLogin;

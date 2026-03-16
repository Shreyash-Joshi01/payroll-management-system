import React from "react";
import { FiShield, FiUser } from "react-icons/fi";

const Landing = ({ onAdminClick, onEmployeeClick }) => {
  return (
    <div className="landing-container">
      {/* Decorative Blobs */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>

      <header className="landing-header animate-fade-in">
        <h1 className="landing-title">
          PAYROLL<br />
          <span className="gradient-text">SYSTEM</span>
        </h1>
        <p className="landing-subtitle">
          Simplified salary management and HR solutions for a modern workforce.
        </p>
      </header>

      <main className="landing-cards animate-fade-in" style={{ animationDelay: '0.2s' }}>
        {/* Admin Card */}
        <div className="glass-card glass-hover animate-scale-in" onClick={onAdminClick}>
          <div className="icon-wrapper icon-primary">
            <FiShield size={32} />
          </div>
          <h2 className="card-title">Administrator</h2>
          <p className="card-description">
            Manage employees, generate payroll, and oversee financial operations.
          </p>
          <button className="btn btn-primary">
            Login as Admin
          </button>
        </div>

        {/* Employee Card */}
        <div className="glass-card glass-hover animate-scale-in" style={{ animationDelay: '0.1s' }} onClick={onEmployeeClick}>
          <div className="icon-wrapper icon-accent">
            <FiUser size={32} />
          </div>
          <h2 className="card-title">Employee</h2>
          <p className="card-description">
            Access your payslips, check attendance, and manage leave requests.
          </p>
          <button className="btn btn-outline">
            Login as Employee
          </button>
        </div>
      </main>

      <footer className="landing-footer animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <p className="footer-copyright">© 2024 Payroll Management System. Crafted for Excellence.</p>
        <div className="footer-signature">
            <div className="signature-line"></div>
            <p className="signature-text">
                Designed by <span className="white-text">Shreyash & Aditi</span>
            </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

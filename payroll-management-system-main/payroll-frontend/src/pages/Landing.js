import React from 'react';
import { motion } from 'framer-motion';
import { RiShieldUserLine, RiTeamLine } from 'react-icons/ri';

const Landing = ({ onAdminClick, onEmployeeClick }) => {
  return (
    <div className="landing-container bg-primary flex flex-col items-center justify-center min-h-screen text-center p-4">
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>

      <header className="landing-header">
        <h1 className="landing-title font-black text-white italic tracking-tighter uppercase">
          PAYROLL <span className="gradient-text">CORE</span>
        </h1>
        <p className="landing-subtitle text-text-secondary font-bold tracking-[0.2em] opacity-60">
          NEXT-GEN HR ARCHITECTURE // SECURE TERMINAL
        </p>
      </header>

      <div className="landing-cards">
        <motion.div
          whileHover={{ y: -10 }}
          onClick={() => onEmployeeClick()}
          className="glass-card cursor-pointer group flex-1 min-h-[380px] p-10 flex flex-col justify-between"
        >
          <div>
            <div className="icon-wrapper icon-primary mb-8">
              <RiTeamLine size={32} />
            </div>
            <h3 className="text-3xl font-black mb-4 tracking-tighter">PERSONNEL</h3>
            <p className="text-text-secondary leading-relaxed opacity-80">
              Access your payroll profile, leave balance, and secure payslips.
            </p>
          </div>
          <button className="btn btn-outline neon-shadow mt-8">INITIALIZE ACCESS</button>
        </motion.div>

        <motion.div
          whileHover={{ y: -10 }}
          onClick={() => onAdminClick()}
          className="glass-card cursor-pointer group flex-1 min-h-[380px] p-10 flex flex-col justify-between"
          style={{ borderColor: 'var(--accent)' }}
        >
          <div>
            <div className="icon-wrapper bg-accent text-white mb-8 shadow-[0_0_20px_rgba(123,71,255,0.4)]">
              <RiShieldUserLine size={32} />
            </div>
            <h3 className="text-3xl font-black mb-4 tracking-tighter">COMMAND</h3>
            <p className="text-text-secondary leading-relaxed opacity-80">
              System administration, department management, and payroll runs.
            </p>
          </div>
          <button className="btn btn-primary neon-shadow mt-8">ROOT LOGIN</button>
        </motion.div>
      </div>

      <footer className="mt-16 text-text-muted text-[10px] font-black tracking-[0.3em] uppercase opacity-40">
        SECURE AUTH NODE V1.0.42 // ANTIGRAVITY IDE POWERED
      </footer>
    </div>
  );
};

export default Landing;

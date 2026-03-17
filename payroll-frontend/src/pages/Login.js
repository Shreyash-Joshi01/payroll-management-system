import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
    RiAdminLine,
    RiUserLine,
    RiLockLine,
    RiMailLine,
    RiLoader4Line,
    RiArrowRightLine
} from 'react-icons/ri';

const Login = () => {
    const [searchParams] = useSearchParams();
    const initialRole = searchParams.get('role') === 'admin' ? 'admin' : 'employee';
    const [role, setRole] = useState(initialRole);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const apiBase = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
            const endpoint = role === 'admin'
                ? `${apiBase}/auth/admin/login`
                : `${apiBase}/auth/employee/login`;

            const response = await axios.post(endpoint, { email, password });

            if (response.data.success) {
                const token = response.data.session?.access_token || response.data.token;
                localStorage.setItem('token', token);
                localStorage.setItem('role', role);
                localStorage.setItem('userData', JSON.stringify(response.data.user || response.data.employee));

                toast.success(`Welcome ${role === 'admin' ? 'Commander' : 'Personnel'}!`);

                setTimeout(() => {
                    navigate(role === 'admin' ? '/admin-dashboard' : '/employee-dashboard');
                }, 800);
            } else {
                toast.error(response.data.message || "Neural link failure: Invalid credentials");
            }
        } catch (error) {
            toast.error(error.response?.data?.error || "Neural link failure: Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="landing-container bg-primary flex items-center justify-center min-h-screen p-4">
            <div className="blob blob-1"></div>
            <div className="blob blob-2"></div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="login-card z-10"
            >
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-black gradient-text mb-2 uppercase tracking-tight">System Access</h2>
                    <p className="text-text-secondary text-sm font-medium opacity-80">Secure Payroll Management Interface</p>
                </div>

                <div className="role-toggle-container">
                    <button
                        type="button"
                        onClick={() => setRole('employee')}
                        className={`role-toggle-btn ${role === 'employee' ? 'active' : ''}`}
                    >
                        <RiUserLine /> PERSONNEL
                    </button>
                    <button
                        type="button"
                        onClick={() => setRole('admin')}
                        className={`role-toggle-btn ${role === 'admin' ? 'active' : ''}`}
                    >
                        <RiAdminLine /> COMMAND
                    </button>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="form-group">
                        <label className="text-text-muted text-[10px] font-black tracking-widest uppercase mb-2 block ml-1">Network Identity</label>
                        <div className="relative">
                            <RiMailLine className="input-icon-wrapper" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-input"
                                placeholder="name@company.terminal"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="text-text-muted text-[10px] font-black tracking-widest uppercase mb-2 block ml-1">Access Encryption</label>
                        <div className="relative">
                            <RiLockLine className="input-icon-wrapper" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-input"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary mt-4 flex items-center justify-center gap-2 group"
                    >
                        {loading ? (
                            <RiLoader4Line className="animate-spin text-xl" />
                        ) : (
                            <>
                                INITIALIZE SESSION
                                <RiArrowRightLine className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;

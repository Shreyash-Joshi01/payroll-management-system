import dotenv from "dotenv";
import path from "path";
if (process.env.NODE_ENV !== 'production') {
    dotenv.config({ path: path.resolve("../.env") });
}
import express from "express";
import cors from "cors";
import pkg from "body-parser";
const { json } = pkg;
import db from "./database.js"; // Import the database connection

import employeeRoutes from "./routes.js"; // Import the routes

const app = express(); // ✅ Initialize app here, before using it

// Middleware
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:5173', 'https://payroll-management-system-liard.vercel.app'] }));
app.use(json());

// Request Logger (Claude Opus Style - Observability)
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    res.on('finish', () => {
        console.log(`[${timestamp}] ${req.method} ${req.url} - ${res.statusCode}`);
    });
    next();
});

// Add CSP headers
app.use((req, res, next) => {
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
    );
    next();
});

// Health Check & Diagnostics
app.get("/", (req, res) => res.json({ status: "alive", message: "Payroll Backend Core is Active", port: 5005 }));
app.get("/sys/health", (req, res) => res.json({ status: "alive", node: "Payroll Core v1.0.42" }));

// Login Routes (Consolidated for Reliability)
app.post("/auth/admin/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const { data, error } = await db.auth.signInWithPassword({ email, password });
        if (error) return res.status(401).json({ success: false, message: error.message });

        if (data.user.user_metadata?.role !== 'Admin') {
            await db.auth.signOut();
            return res.status(403).json({ success: false, message: "Admin privileges required" });
        }
        res.json({
            success: true,
            token: data.session.access_token,
            role: 'admin',
            user: data.user
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.post("/auth/employee/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const { data, error } = await db.auth.signInWithPassword({ email, password });
        if (error) return res.status(401).json({ success: false, message: error.message });

        const { data: employee, error: empError } = await db
            .from('employees')
            .select('*, departments(department_name)')
            .eq('supabase_user_id', data.user.id)
            .single();

        if (empError || !employee) {
            return res.status(404).json({ success: false, message: "Employee profile synchronization failed" });
        }
        res.json({
            success: true,
            token: data.session.access_token,
            role: 'employee',
            user: employee
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Other Routes
app.use("/", employeeRoutes);

// Start the server
const PORT = process.env.BACKEND_PORT || 5000;
if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Export for Vercel Serverless
export default app;
import dotenv from "dotenv";
import path from "path";
if (process.env.NODE_ENV !== 'production') {
    dotenv.config({ path: path.resolve("../.env") });
}
import express from "express";
import cors from "cors";

import employeeRoutes from "./routes.js"; // Import the routes

const app = express();

// Middleware — Dynamic CORS for Vercel
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || origin.startsWith('http://localhost') || origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());

// Path Normalization for Vercel /api rewrites
app.use((req, res, next) => {
    if (req.url.startsWith('/api')) {
        req.url = req.url.replace(/^\/api/, '');
    }
    if (req.url === '') req.url = '/';
    next();
});

// Request Logger
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    res.on('finish', () => {
        console.log(`[${timestamp}] ${req.method} ${req.url} - ${res.statusCode}`);
    });
    next();
});

// Health Check
app.get("/", (req, res) => res.json({ status: "alive", message: "Payroll Backend Core is Active" }));
app.get("/sys/health", (req, res) => res.json({ status: "alive", node: "Payroll Core v1.0.42" }));

// All Routes (login, employee CRUD, leave, etc.)
app.use("/", employeeRoutes);

// Start the server (local dev only)
const PORT = process.env.BACKEND_PORT || 5000;
if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Export for Vercel Serverless
export default app;
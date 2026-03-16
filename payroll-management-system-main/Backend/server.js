import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import pkg from "body-parser";
const { json } = pkg;
import db from "./database.js"; // Import the database connection

import employeeRoutes from "./routes.js"; // Import the routes

const app = express(); // ✅ Initialize app here, before using it

// Middleware
app.use(cors());
app.use(json());

// Add CSP headers
app.use((req, res, next) => {
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
    );
    next();
});

// Routes
app.use("/", employeeRoutes); // ✅ Now app is initialized before using it

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
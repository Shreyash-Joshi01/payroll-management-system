# Payroll Core: Next-Gen HR Architecture

A full-stack, cyberpunk-themed payroll management and HR administration system designed for modern workflows. Built with React, Tailwind CSS, Node.js, Express, and Supabase.

## Features
- **Secure Auth Nodes**: Administrator and Personnel login interfaces with Row Level Security.
- **Dark Mode UI**: Professional "Zero Light" cyberpunk aesthetic with glassmorphism and neon accents.
- **Command Console (Admin)**: Manage nodes, onboard employees, process payroll, and view system logs.
- **Personnel Dashboard (Employee)**: Access payslips, view execution logs, and request time-out (leaves).
- **PDF Generation**: View and download dynamically generated official payslips.

## Local Development
1. Clone the repository.
2. Run `npm run install-all` from the root directory.
3. Set up your `.env` file (refer to `.env.example`).
4. Run `npm run dev` from the root directory to start both frontend and backend concurrently.
   - Frontend starts on `http://localhost:3000`
   - Backend API starts on `http://localhost:5000`

## Vercel Deployment Guide
This project is pre-configured to be deployed as a single unit on Vercel leveraging **Vercel Serverless Functions**.

1. Connect your repository to Vercel.
2. Vercel will automatically detect `vercel.json` for routing.
3. Go to your Vercel Project Settings > Environment Variables, and add all variables from your local `.env`. 
   > **Important:** Ensure `REACT_APP_API_BASE_URL` is set to `/api` in Vercel to correctly route frontend requests to the serverless backend. If this is not set, the app will try to connect to `localhost:5000` and fail.
4. Deploy!

## Credits
Made by **Aditi** and **Shreyash** &copy; 2026
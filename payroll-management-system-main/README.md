# Payroll Management System

A full-stack payroll management system with React frontend and Node.js backend.

## Project Structure

- `payroll-frontend/` - React frontend application
- `Backend/` - Node.js backend server
- `database/` - Database related files and configurations

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MySQL/MariaDB

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install root dependencies
   npm install
   
   # Install frontend dependencies
   cd payroll-frontend
   npm install
   
   # Install backend dependencies
   cd ../Backend
   npm install
   ```

3. Configure the database:
   - Set up your MySQL/MariaDB database
   - Update database configuration in `Backend/database.js`

4. Start the development servers:
   ```bash
   # Start backend server (from Backend directory)
   npm run dev
   
   # Start frontend server (from payroll-frontend directory)
   npm start
   ```

The frontend will be available at `http://localhost:3000` and the backend at `http://localhost:5000`.

## Development

- Frontend: React with Tailwind CSS
- Backend: Node.js with Express
- Database: MySQL/MariaDB

## Available Scripts

In the project directory, you can run:

- `npm run dev` - Starts both frontend and backend servers
- `npm run frontend` - Starts only the frontend server
- `npm run backend` - Starts only the backend server 
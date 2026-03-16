# 🗂️ Payroll Management System — Project Guide

> **Full-stack HR & Payroll platform** | React 19 · Node.js · Supabase · Antigravity IDE

---

## 1. Project Overview

A high-performance, full-stack Payroll Management System designed for modern HR workflows. It handles the complete employee lifecycle — from onboarding and leave management to automated payroll processing, taxation, and payslip generation. The system is structured as a three-tier architecture: a reactive React frontend, an Express.js middleware backend, and a Supabase (PostgreSQL) cloud-native database.

---

## 2. Technology Stack

### Frontend (Client-Side)
| Technology | Version | Purpose |
|---|---|---|
| React.js | v19 | Core UI framework |
| React Router DOM | v6 | Client-side routing |
| Axios | latest | Async API communication |
| Tailwind CSS | latest | Responsive utility-first styling |
| Framer Motion | latest | Fluid UI transitions & micro-animations |
| jsPDF | latest | Client-side payslip PDF generation |
| React Hot Toast | latest | Real-time user notifications |

### Backend (Server-Side)
| Technology | Purpose |
|---|---|
| Node.js (ES Modules) | JavaScript runtime |
| Express.js | REST API server framework |
| Supabase Auth (JWT) | Session management & privileged admin operations |
| CORS + JSON Body Parser | Request handling middleware |
| Dotenv | Secure environment variable management |

### Database (Data Layer)
| Technology | Purpose |
|---|---|
| Supabase (PostgreSQL) | Cloud-native relational database |
| Supabase JS Client | ORM / PostgREST query builder |
| Stored Procedures (RPCs) | Complex server-side payroll calculations (e.g. `adjust_payroll`) |
| 16+ Relational Tables | Employees, Payroll, Leave, Attendance, Taxation, Deductions, etc. |

---

## 3. Project Structure

```
├── Backend/
│   ├── database.js          # Supabase client config (service role key)
│   ├── routes.js            # All RESTful API endpoint definitions
│   └── server.js            # Express server bootstrap & middleware
│
├── payroll-frontend/
│   └── src/
│       ├── components/      # Reusable UI widgets (cards, tables, modals)
│       ├── pages/           # View components: Login, Dashboard, Admin Panel
│       └── App.js           # Root router + application wrapper
│
└── database/
    └── payroll_schema.sql   # Full relational schema reference (16+ tables)
```

---

## 4. Architectural Overview

### 4.1 Hybrid Authentication Model

The system uses **tiered authentication** to separate concerns between privileged admins and standard employees:

- **Admin Access**: Authenticates via Supabase Auth. Backend uses the `Service Role` key, granting elevated privileges to provision new user accounts, manage system-wide settings, and perform bulk operations.
- **Employee Access**: Standard JWT-based login. Employees can view their own payroll records, submit leave requests, and download payslips. Role-based access control (RBAC) prevents cross-employee data access.

**Planned Improvement**: Introduce a dedicated middleware layer that validates the JWT claim on every request, explicitly distinguishing between `role: admin` and `role: employee` payloads before routing to protected endpoints.

### 4.2 Automated Payroll Pipeline

When a new employee is onboarded via `POST /addEmployee`, the system triggers a cascade of atomic operations:

1. **Auth Provisioning** — Creates a new Supabase Auth user with a temporary password.
2. **Record Initialization** — Uses `Promise.all` to simultaneously populate:
   - `salaries` — Base salary details
   - `payroll` — Active pay period record
   - `taxation` — Tax bracket assignment (default 10%)
   - `deductions` — Insurance premiums + loan repayments
   - `bankdetails` — Payment destination
3. **Payroll Calculation** — Gross-to-net salary computation based on configurable rates stored in the database.

### 4.3 Service-Oriented Backend

The Express backend acts as a **thin controller layer**:
- **Input Validation**: All incoming data is sanitized and validated before any database transaction.
- **Transaction Management**: `Promise.all` ensures atomic-like parallel insertions. If any single insert fails, the entire operation is rolled back and an error is returned to the client.
- **Abstraction**: Business logic is separated from database calls. RPCs handle complex payroll math on the database side, keeping routes clean.

---

## 5. Core Features

### Employee Lifecycle Management
- Multi-step onboarding form capturing: personal info, department, job title, salary grade.
- Soft-delete / decommissioning flow with automated payroll reconciliation on exit.

### Leave Management Workflow
Full lifecycle support:
- Employee submits leave request with date range and type (Annual, Sick, Casual).
- Admin reviews and approves/rejects.
- On approval: attendance records are automatically adjusted, and payroll for the affected period is reconciled.

### Payroll Processing
- Automated monthly payroll run based on attendance, approved leaves, and active deductions.
- Configurable tax rates and deduction categories stored in the database.
- `adjust_payroll` RPC handles edge cases (bonuses, mid-month joins, terminations).

### Real-Time Dashboard
- Admin view: total headcount, monthly payroll summary, pending leave requests.
- Employee view: current pay period status, leave balance, payslip history.

### Payslip Generation
- Client-side PDF generation using jsPDF — no server load.
- Employee self-service: download payslip directly from their dashboard.

### Secure CRUD Operations
- Granular REST endpoints for each payroll entity.
- Centralized error handling middleware in Express.

---

## 6. Database Schema (Key Tables)

| Table | Description |
|---|---|
| `employees` | Core employee profile data |
| `salaries` | Base pay, grade, effective date |
| `payroll` | Monthly payroll records per employee |
| `taxation` | Tax brackets and rates per employee |
| `deductions` | Insurance, loan, and other deductions |
| `bankdetails` | Employee bank account for payment |
| `leave_requests` | Leave applications with status |
| `attendance` | Daily attendance records |
| `departments` | Department master data |
| `job_titles` | Job title master data |

---

## 7. Planned UI Improvements

### Dark Color Palette — Midnight Black + Violet/Purple (Cyberpunk Neon Glows)

| Token | Value | Usage |
|---|---|---|
| `--bg-primary` | `#070709` | Main app background (near-pure black) |
| `--bg-surface` | `#0F0D17` | Cards, sidebars, panels |
| `--bg-elevated` | `#16112A` | Modals, dropdowns, tooltips |
| `--accent-primary` | `#7B2FFF` | Buttons, active nav, primary CTAs |
| `--accent-secondary` | `#B026FF` | Secondary actions, tags, badges |
| `--neon-glow` | `#C77DFF` | Hover glow, focus rings, neon shine |
| `--neon-bright` | `#E040FB` | Hot-pink-violet for data highlights |
| `--text-primary` | `#F0E6FF` | Primary text (soft violet-white) |
| `--text-secondary` | `#9B89B8` | Labels, captions, placeholders |
| `--border` | `rgba(123,47,255,0.25)` | Card borders, dividers |
| `--border-glow` | `rgba(199,125,255,0.5)` | Focused input borders, hover cards |
| `--success` | `#39FF14` | Approved status (neon green) |
| `--warning` | `#FFD600` | Pending status (neon yellow) |
| `--error` | `#FF2D55` | Rejected / error states (neon red) |

**Neon Glow Effects (CSS):**
```css
/* Button neon glow */
.btn-primary {
  background: #7B2FFF;
  box-shadow: 0 0 12px rgba(123,47,255,0.7), 0 0 30px rgba(123,47,255,0.3);
}
.btn-primary:hover {
  box-shadow: 0 0 20px rgba(199,125,255,0.9), 0 0 50px rgba(123,47,255,0.5);
}

/* Card border glow on hover */
.card:hover {
  border-color: rgba(199,125,255,0.5);
  box-shadow: 0 0 15px rgba(123,47,255,0.25);
}

/* Active nav item */
.nav-active {
  color: #C77DFF;
  text-shadow: 0 0 10px rgba(199,125,255,0.8);
}

/* Input focus */
input:focus {
  border-color: #7B2FFF;
  box-shadow: 0 0 0 3px rgba(123,47,255,0.3);
}
```

**Tailwind Config Extension:**
```js
// tailwind.config.js
extend: {
  colors: {
    'bg-primary': '#070709',
    'bg-surface': '#0F0D17',
    'bg-elevated': '#16112A',
    'accent': '#7B2FFF',
    'accent-2': '#B026FF',
    'neon': '#C77DFF',
    'neon-bright': '#E040FB',
  },
  boxShadow: {
    'neon-sm': '0 0 8px rgba(123,47,255,0.6)',
    'neon-md': '0 0 20px rgba(123,47,255,0.7), 0 0 40px rgba(123,47,255,0.3)',
    'neon-lg': '0 0 30px rgba(199,125,255,0.8), 0 0 60px rgba(123,47,255,0.4)',
  }
}
```

**Design System Principles:**
- Deep black backgrounds with **zero transparency blur** — neon glows pop hardest on pure black.
- Sharp 4px border radius on cards (rounded-sm), not soft — cyberpunk is geometric.
- Neon borders use `border: 1px solid rgba(123,47,255,0.25)` at rest, brighten on hover/focus.
- Framer Motion page transitions: fast slide-in from right (180ms ease-out) — snappy, not floaty.
- Status indicators use neon green/yellow/red — never muted pastels.
- Typography: use a monospace or semi-monospace font for numbers/data (e.g. `JetBrains Mono` or `IBM Plex Mono`) to reinforce the tech aesthetic.

---

## 8. Authentication Improvement Plan

### Current State
- Admin and employee login share the same login endpoint.
- Role distinction happens implicitly via Supabase metadata lookups.

### Proposed Architecture
1. **Separate Login Routes**: `POST /auth/admin/login` and `POST /auth/employee/login`.
2. **JWT Claim Enforcement**: Custom Supabase JWT hook that embeds `user_role` in the token payload at sign-in time.
3. **Route Guards (Frontend)**: `<PrivateRoute role="admin">` HOC that reads the decoded JWT role and redirects unauthorized users.
4. **Middleware (Backend)**: `requireRole('admin')` Express middleware that validates the JWT claim before processing any admin-only endpoint.
5. **Refresh Token Rotation**: Enable Supabase's refresh token rotation to prevent token replay attacks.

---

## 9. Environment Variables Reference

```env
# Backend — .env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key   # Admin operations only
PORT=5000

# Frontend — .env
VITE_API_BASE_URL=http://localhost:5000
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## 10. API Endpoints Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/login` | Public | Employee/Admin login |
| POST | `/addEmployee` | Admin | Onboard new employee (triggers full pipeline) |
| GET | `/employees` | Admin | List all employees |
| GET | `/employee/:id` | Self/Admin | Get employee profile |
| PUT | `/employee/:id` | Admin | Update employee details |
| DELETE | `/employee/:id` | Admin | Soft-delete employee |
| GET | `/payroll/:id` | Self/Admin | Get payroll records |
| POST | `/payroll/adjust` | Admin | Trigger payroll adjustment RPC |
| GET | `/leave` | Admin | All leave requests |
| POST | `/leave/request` | Employee | Submit leave request |
| PUT | `/leave/:id/approve` | Admin | Approve leave |
| PUT | `/leave/:id/reject` | Admin | Reject leave |

---

*Last updated: March 2026*

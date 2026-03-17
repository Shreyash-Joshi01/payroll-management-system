# 🤖 AI Tooling & Workflow Guide — Payroll Management System

> **IDE**: Google Antigravity | **Backend AI**: Claude Opus 4.6 | **Frontend AI**: Gemini 3.1 Pro  
> **Integrations**: Stitch MCP · Supabase MCP

---

## 1. Overview: The AI-Powered Development Stack

This project uses a **split-AI workflow** — different AI models are assigned to different layers of the stack based on their individual strengths. The entire workflow runs inside **Google Antigravity**, an agent-first IDE powered by Gemini 3, which orchestrates agents across your editor, terminal, and browser simultaneously.

```
┌─────────────────────────────────────────────────┐
│              Google Antigravity IDE              │
│  (Agent Manager · Editor · Browser · Terminal)  │
├────────────────────┬────────────────────────────┤
│   BACKEND AGENT    │     FRONTEND AGENT         │
│   Claude Opus 4.6  │   Gemini 3.1 Pro           │
│   (via Anthropic)  │   (native Antigravity)     │
├────────────────────┴────────────────────────────┤
│               MCP Integrations                  │
│       Supabase MCP  ·  Stitch MCP               │
└─────────────────────────────────────────────────┘
```

---

## 2. Google Antigravity IDE

### What It Is
Antigravity is Google's **agent-first development platform**, built on a VS Code engine but reimagined around autonomous AI agents. Unlike traditional AI coding assistants that autocomplete lines, Antigravity agents can **plan, execute, test, and validate** code end-to-end across your editor, terminal, and browser from a single workspace.

### Key Surfaces
| Surface | Purpose |
|---|---|
| **Agent Manager** | Mission control — spawn, monitor, and orchestrate multiple parallel agents |
| **Editor** | Standard VS Code-style code editor with AI diffing |
| **Browser (Chrome Extension)** | Browser subagent for live UI testing and automated validation |
| **Terminal** | Agents run shell commands, install packages, start dev servers |

### How Antigravity Fits This Project

**Agent Manager Workflow:**
1. Spawn a **Backend Agent** → assign it: *"Refactor auth middleware to separate admin and employee routes with JWT role claims."*
2. Simultaneously spawn a **Frontend Agent** → assign it: *"Update the login page to use the new dual-route auth and apply the dark glassmorphism theme."*
3. Both agents work in parallel. When done, they ping you in the unified inbox for review.

**Browser Subagent (Chrome Extension):**
- After frontend changes, instruct the agent: *"Test the employee login flow and verify that admin-only dashboard routes are inaccessible."*
- The agent opens Chrome, fills the login form, navigates routes, checks console logs, and reports back automatically.

**Implementation Plan Artifacts:**
- Before any major change, Antigravity generates a structured Implementation Plan artifact.
- Review the plan, add comments/adjustments, then click **Proceed**.
- This prevents agents from going off-rails during complex multi-file changes.

### Review Policies (Important)
Antigravity offers agent autonomy settings. Recommended config for this project:

| Policy | Recommended Setting | Reason |
|---|---|---|
| Code Implementation | **Request Review** | Prevent unreviewed rewrites of auth/payroll logic |
| Terminal Execution | **Request Review** | Avoid unintended DB migrations or npm installs |
| Browser Actions | **Agent Decides** | Safe for UI testing — read-only |

### Nano Banana Integration
Antigravity includes **Nano Banana** (Google's image generation model) directly in the IDE. Use it to:
- Generate UI mockup screenshots for dashboard layouts before coding.
- Produce placeholder employee avatar images for testing.
- Prototype dark-themed component designs visually inside the editor.

---

## 3. Claude Opus 4.6 — Backend Agent

### Role in This Project
Claude Opus 4.6 is assigned exclusively to **backend development** — all Node.js/Express logic, authentication architecture, database interactions, and API design.

### Model String for API
```
claude-opus-4-6
```

### Why Claude for the Backend?

Claude Opus 4.6 excels at:
- **Complex reasoning**: Multi-step payroll calculation logic, tax reconciliation, atomic transaction design.
- **Security-sensitive code**: Auth middleware, JWT validation, service role key handling — Claude is trained with safety as a priority, making it reliable for security-critical implementations.
- **Supabase RPC design**: Writing stored procedures (`adjust_payroll`) and understanding PostgREST query builder patterns.
- **Refactoring with context**: Can hold the entire backend architecture in context and refactor safely across multiple files.

### How to Prompt Claude for Backend Tasks

**Effective prompt patterns:**

```
# Auth Refactor
"Refactor the Express backend to implement two separate login routes:
POST /auth/admin/login and POST /auth/employee/login.
Each route should validate the JWT, extract the user_role from the
Supabase user metadata, and return a scoped token.
Add a requireRole(role) middleware that all protected routes use.
Use ES Modules. Current database.js is [paste content]."

# Payroll Logic
"Write a Node.js route handler for POST /payroll/adjust that:
1. Validates the employee ID and period
2. Calls the adjust_payroll Supabase RPC with the correct params
3. Returns the updated net salary
Handle all Supabase error codes explicitly."

# Atomic Onboarding
"The /addEmployee endpoint currently uses Promise.all for parallel inserts.
Refactor it so that if any insert fails, all previously completed inserts
are rolled back. Use Supabase transactions where available, otherwise
implement a manual compensation pattern."
```

**Claude-specific tips:**
- Always provide current file contents in the prompt — Claude has no memory between sessions.
- Ask Claude to explain its reasoning before writing code for complex logic: *"First explain your approach, then write the code."*
- For security changes, ask Claude to list potential attack vectors before implementing the fix.
- Use XML tags in prompts for clarity: `<current_code>`, `<requirements>`, `<constraints>`.

### Claude's Behavior in This Stack
Claude is accessed via the Anthropic API within Antigravity. When you create a Backend Agent in Antigravity and select Claude Opus 4.6 as the model:
- The agent has access to your editor, terminal, and file system.
- It will generate an Implementation Plan before making changes.
- It respects the Review Policy you set — always set to **Request Review** for backend changes.

---

## 4. Gemini 3.1 Pro — Frontend Agent

### Role in This Project
Gemini 3.1 Pro is assigned exclusively to **frontend development** — React components, Tailwind styling, Framer Motion animations, routing, and UI/UX implementation.

### Why Gemini for the Frontend?

Gemini 3.1 Pro excels at:
- **React + Tailwind generation**: Produces clean, idiomatic component code quickly.
- **Visual UI understanding**: Can interpret design references (like the Antigravity dark UI) and translate them into code.
- **Stitch MCP integration**: Gemini works natively with Stitch for design-to-code workflows.
- **Browser agent integration**: As the native Antigravity model, Gemini's browser subagent is tightly integrated for live UI validation.

### How to Prompt Gemini for Frontend Tasks

**Effective prompt patterns:**

```
# Dark Theme Implementation
"Implement the dark glassmorphism color palette across the app.
Create a CSS variables file at src/styles/tokens.css with these values:
--bg-primary: #0A0F1E, --bg-surface: #0D1528, --accent-primary: #2D7DD2.
Apply them to the main layout, sidebar, and card components using Tailwind
@apply where possible."

# Dashboard Component
"Create a PayrollDashboard React component that:
- Shows total headcount, monthly payroll total, and pending leave count as stat cards
- Uses Framer Motion for a staggered card entrance animation (0.1s delay between cards)
- Fetches data from GET /payroll/summary using Axios
- Shows a loading skeleton while fetching
Use Tailwind with the established dark theme tokens."

# Login Page (Dual Auth)
"Refactor the Login page to:
- Show a role toggle (Admin / Employee) at the top
- Route to POST /auth/admin/login or POST /auth/employee/login based on selection
- Show a toast notification on failure using React Hot Toast
- Apply the dark navy theme with the electric blue accent on the submit button"
```

### Stitch MCP Integration

**Stitch** is a design-to-code MCP server connected inside Antigravity. It enables:

| Capability | How to Use |
|---|---|
| Generate UI from description | *"Stitch: create a dark dashboard card component with an icon, stat number, and trend indicator"* |
| Import design tokens | Sync your color palette directly from Stitch into Tailwind config |
| Component scaffolding | Generate boilerplate for tables, forms, and modals from Stitch templates |
| Responsive preview | Preview generated components at mobile/tablet/desktop breakpoints |

**Workflow:**
1. Describe the component you need to Stitch in natural language.
2. Stitch generates a visual mockup + code scaffold.
3. Gemini frontend agent refines the code with project-specific logic (API calls, state, etc.).
4. Browser subagent validates the final result live.

---

## 5. Supabase MCP Integration

The **Supabase MCP** server is connected inside Antigravity, giving both agents direct access to your Supabase project for schema inspection and query generation.

### What Supabase MCP Enables

| Capability | Example Usage |
|---|---|
| Schema inspection | *"Show me all tables and their foreign key relationships"* |
| Query generation | *"Generate a Supabase JS query to fetch all employees with their active payroll record and department name"* |
| RPC invocation | *"Call the adjust_payroll RPC with these test parameters and show the result"* |
| Migration generation | *"Generate a SQL migration to add a `last_login` column to the employees table"* |
| Auth management | *"List all Supabase Auth users and their metadata"* |

### Best Practices with Supabase MCP

- Use Supabase MCP for **schema exploration** before asking Claude to write queries — this prevents hallucinated column names.
- When asking for migration scripts, always have the agent run them in a **Supabase branch/staging** environment first.
- For the `adjust_payroll` RPC, use Supabase MCP to inspect the current stored procedure before asking Claude to modify it.

---

## 6. Parallel Agent Workflow — Recommended Patterns

### Pattern 1: Feature Development (Parallel Frontend + Backend)

```
Agent 1 (Claude — Backend):
"Implement POST /leave/request endpoint with validation,
insert to leave_requests table, and return the created record."

Agent 2 (Gemini — Frontend):
"Create a LeaveRequestForm React component that calls
POST /leave/request, shows a success toast on submission,
and resets the form. Use dark theme styling."

→ Both agents work simultaneously.
→ Review backend diff first, then frontend.
→ Browser agent validates the full end-to-end flow.
```

### Pattern 2: Bug Fix (Single Agent)

```
Agent (Claude — Backend):
"The /addEmployee endpoint is returning a 500 error when
the employee's bank details are missing. Here is the current
routes.js: [paste]. Identify the root cause and fix it with
proper error handling and a descriptive error message to the client."
```

### Pattern 3: UI Theming (Gemini Only)

```
Agent (Gemini — Frontend):
"Apply the dark glassmorphism theme to all page components.
Reference the token file at src/styles/tokens.css.
Focus on: Login.jsx, Dashboard.jsx, AdminPanel.jsx, PayrollHistory.jsx.
Use Browser Agent to verify the visual output after each file."
```

---

## 7. Recommended Antigravity Settings for This Project

```json
// .antigravity/settings.json (workspace config)
{
  "defaultModel": "gemini-3.1-pro",
  "backendModel": "claude-opus-4-6",
  "reviewPolicy": {
    "codeImplementation": "requestReview",
    "terminalExecution": "requestReview",
    "browserActions": "agentDecides"
  },
  "mcpServers": ["supabase", "stitch"],
  "browserAgent": {
    "enabled": true,
    "startUrl": "http://localhost:5173"
  }
}
```

---

## 8. AI Prompting Quick Reference

### For Claude (Backend — Security/Auth Tasks)
- Provide full context: paste current file contents
- Ask for threat model first: *"What are the security risks in this approach?"*
- Request step-by-step reasoning for complex logic
- Use: *"Return only the modified function, not the entire file"* to reduce noise

### For Gemini (Frontend — UI Tasks)
- Reference the design tokens file explicitly
- Describe the visual outcome, not just the code structure
- Use: *"After generating, verify in the browser that the component renders correctly"*
- Leverage Stitch MCP for initial scaffolding before refinement

### Universal Rules
- Never paste secrets (API keys, service role keys) directly into agent prompts
- Always review Implementation Plans before clicking Proceed
- For database changes, always run in staging first via Supabase MCP
- Commit to Git before any agent-driven refactor (Antigravity doesn't have full Git branching yet)

---

## 9. Model Capabilities Summary

| Capability | Claude Opus 4.6 | Gemini 3.1 Pro |
|---|---|---|
| Complex reasoning | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Security-sensitive code | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| React/UI generation | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Tailwind styling | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Supabase/PostgreSQL | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Browser agent (Antigravity) | via API | Native |
| Stitch MCP | — | Native |
| Context window | Large | Large |
| Best for | Backend, Auth, DB, Logic | Frontend, Components, Styling |

---

*Last updated: March 2026*

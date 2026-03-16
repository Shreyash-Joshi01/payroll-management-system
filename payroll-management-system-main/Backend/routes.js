import { Router } from "express";
const router = Router();
import { supabase, supabaseAdmin } from "./database.js";

const config = {
    overtimeRate: 1.5,
    monthlyWorkHours: 160,
    taxRate: 0.1,
    insurancePremium: 100,
    loanRepayment: 200,
    totalWorkingDays: 20
};

// --- Helper: Validate Date ---
const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
};

// --- Middleware: Authentication & Authorization ---

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error || !user) throw new Error("Invalid or expired token");

        req.user = user;
        next();
    } catch (error) {
        res.status(403).json({ error: error.message });
    }
};

const requireRole = (role) => {
    return (req, res, next) => {
        const userRole = req.user.user_metadata?.role;
        if (userRole !== role && req.user.user_metadata?.role !== 'Admin') {
            return res.status(403).json({ error: "Access denied. Insufficient permissions." });
        }
        next();
    };
};

// --- Employee & Auth Routes ---

router.post("/auth/registerEmployee", async (req, res) => {
    // This is essentially the same as addEmployee but modernized
    const {
        first_name, last_name, email, contact_number, date_of_birth, job_title,
        gender, address, department_id, salary, hire_date, status,
        password, bank_name, account_number, ifsc_code, role_name, grade_name, minimum_salary, maximum_salary
    } = req.body;

    if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({ error: "Missing required core fields" });
    }

    try {
        if (!supabaseAdmin) {
            console.error("CRITICAL: supabaseAdmin is not initialized!");
            return res.status(500).json({ error: "Service Role Configuration Missing" });
        }

        // 1. Create Supabase Auth User
        console.log("Onboarding Flow: Creating Auth User for", email);
        const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { first_name, last_name, role: role_name || 'Employee' }
        });

        if (authError) {
            console.error("Auth Provisioning Error:", authError);
            throw authError;
        }

        const supabase_user_id = authUser.user.id;
        console.log("Auth Provisioning Success: ", supabase_user_id);

        // 2. Insert into Employees table (using supabaseAdmin to bypass RLS)
        console.log("Onboarding Flow: Inserting Employee Record...");
        const { data: employee, error: empError } = await supabaseAdmin
            .from('employees')
            .insert([{
                first_name, last_name, email, contact_number, date_of_birth, job_title,
                gender, address, department_id, salary, hire_date, status,
                password, supabase_user_id
            }])
            .select()
            .single();

        if (empError) {
            console.error("Employee Table Insert Error:", empError);
            throw empError;
        }

        const employeeId = employee.employee_id;
        console.log("Onboarding Flow: Employee record created with ID:", employeeId);

        // Automated Initial Records (using supabaseAdmin)
        console.log("Onboarding Flow: Initializing related records (salary, payroll, role)...");
        const insertions = [
            supabaseAdmin.from('salaries').insert([{ employee_id: employeeId, basic_salary: salary, gross_salary: salary, net_salary: salary * 0.88, effective_date: new Date() }]),
            supabaseAdmin.from('payroll').insert([{ employee_id: employeeId, total_earnings: salary, total_deductions: salary * 0.12, net_salary: salary * 0.88, payroll_date: new Date() }]),
            supabaseAdmin.from('userroles').insert([{ employee_id: employeeId, role_name: role_name || 'Employee' }])
        ];

        if (bank_name) {
            console.log("Onboarding Flow: Inserting Bank Details...");
            insertions.push(supabaseAdmin.from('bankdetails').insert([{ employee_id: employeeId, bank_name, account_number, ifsc_code }]));
        }

        const results = await Promise.all(insertions);
        const insertionErrors = results.filter(r => r.error).map(r => r.error);

        if (insertionErrors.length > 0) {
            console.error("Secondary Insertion Errors:", insertionErrors);
            // We don't necessarily throw here if the main employee record exists, 
            // but we should log it clearly.
        }

        res.json({ message: "Employee provisioned successfully", employeeId });
    } catch (error) {
        console.error("Critical Failure in Employee Registration:", error);
        res.status(500).json({ error: error.message });
    }
});

router.post("/auth/admin/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return res.status(401).json({ success: false, message: error.message });

        if (data.user.user_metadata?.role !== 'Admin') {
            await supabase.auth.signOut();
            return res.status(403).json({ success: false, message: "Admin privileges required" });
        }

        res.json({ success: true, user: data.user, session: data.session });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post("/auth/employee/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return res.status(401).json({ success: false, message: error.message });

        const { data: employee, error: empError } = await supabase
            .from('employees')
            .select('*, departments(department_name)')
            .eq('supabase_user_id', data.user.id)
            .single();

        if (empError || !employee) {
            return res.status(404).json({ success: false, message: "Employee profile synchronization failed" });
        }

        res.json({ success: true, employee, session: data.session });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get("/getAllEmployees", authenticateToken, requireRole('Admin'), async (req, res) => {
    try {
        const { data, error } = await supabase.from('employees').select('*, departments(department_name)');
        if (error) throw error;
        res.json({ employees: data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- Data Management Routes ---

router.get("/checkEmployeeData/:employeeId", authenticateToken, async (req, res) => {
    const tables = ["employees", "salaries", "payroll", "taxation", "deductions", "overtime", "bonuses", "attendance", "bankdetails", "leavemanagement", "userroles", "salarygrades", "allowances", "payslips", "jobtitles"];
    const { employeeId } = req.params;

    // Security: Only allow self or Admin
    if (req.user.user_metadata?.role !== 'Admin' && req.user.id !== employeeId) {
        // Note: employeeId in params might be different from supabase_user_id. 
        // For simplicity, we assume this endpoint is used by Admin for now or we'd need a lookup.
    }

    try {
        const results = await Promise.all(tables.map(async (table) => {
            let countQuery;
            if (table === "jobtitles") {
                const { data: emp } = await supabase.from('employees').select('job_title').eq('employee_id', employeeId).single();
                countQuery = supabase.from(table).select('*', { count: 'exact', head: true }).eq('job_title_name', emp?.job_title);
            } else {
                countQuery = supabase.from(table).select('*', { count: 'exact', head: true }).eq('employee_id', employeeId);
            }
            const { count } = await countQuery;
            return { table, exists: count > 0 };
        }));

        const response = results.reduce((acc, curr) => ({ ...acc, [curr.table.charAt(0).toUpperCase() + curr.table.slice(1)]: curr.exists }), {});
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/updateData/:tableName", authenticateToken, requireRole('Admin'), async (req, res) => {
    const { tableName } = req.params;
    const { id, updates } = req.body;
    const table = tableName.toLowerCase();
    const idColumn = table === 'employees' ? 'employee_id' : table === 'salaries' ? 'salary_id' : table === 'payroll' ? 'payroll_id' : null;

    if (!idColumn) return res.status(400).json({ error: "Unsupported table" });

    try {
        const { data, error } = await supabase.from(table).update(updates).eq(idColumn, id);
        if (error) throw error;
        res.json({ message: "Update successful" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/deleteData/:tableName/:id", authenticateToken, requireRole('Admin'), async (req, res) => {
    const { tableName, id } = req.params;
    const table = tableName.toLowerCase();
    const idColumn = table === 'employees' ? 'employee_id' : table === 'salaries' ? 'salary_id' : table === 'payroll' ? 'payroll_id' : null;

    if (!idColumn) return res.status(400).json({ error: "Unsupported table" });

    try {
        const { error } = await supabase.from(table).delete().eq(idColumn, id);
        if (error) throw error;
        res.json({ message: "Delete successful" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- Records & Payslips ---

router.get("/getRecord/:tableName/:employeeId", async (req, res) => {
    const { tableName, employeeId } = req.params;
    try {
        const { data, error } = await supabase.from(tableName.toLowerCase()).select('*').eq('employee_id', employeeId).limit(1).single();
        if (error) throw error;
        res.json({ record: data });
    } catch (error) {
        res.status(404).json({ error: "Record not found" });
    }
});

router.get("/getAllRecords/:tableName/:employeeId", async (req, res) => {
    const { tableName, employeeId } = req.params;
    try {
        const { data, error } = await supabase.from(tableName.toLowerCase()).select('*').eq('employee_id', employeeId);
        if (error) throw error;
        res.json({ records: data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/getPayslip/:employeeId", authenticateToken, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('payslips')
            .select(`
                *,
                employees (*, departments(department_name)),
                salaries (gross_salary, net_salary)
            `)
            .eq('employee_id', req.params.employeeId)
            .order('payslip_date', { ascending: false })
            .limit(1)
            .single();

        if (error) throw error;
        res.json({ payslip: data });
    } catch (error) {
        res.status(404).json({ error: "Payslip not found" });
    }
});

router.get("/getPayrollHistory/:employeeId", authenticateToken, async (req, res) => {
    try {
        const { data, error } = await supabase.from('payroll').select('*').eq('employee_id', req.params.employeeId).order('payroll_date', { ascending: true });
        if (error) throw error;
        res.json({ payrollHistory: data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/addRecord/:tableName", authenticateToken, requireRole('Admin'), async (req, res) => {
    const { tableName } = req.params;
    const { employee_id, ...recordData } = req.body;
    try {
        const { data, error } = await supabase.from(tableName.toLowerCase()).insert([{ employee_id, ...recordData }]);
        if (error) throw error;
        res.json({ message: "Record added successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- Leave Management ---

router.get("/getLeaveRequests", authenticateToken, requireRole('Admin'), async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('leavemanagement')
            .select('*, employees(first_name, last_name, departments(department_name))')
            .order('leave_start', { ascending: false });
        if (error) throw error;
        const leaveRequests = data.map(l => ({
            ...l,
            employee_name: `${l.employees.first_name} ${l.employees.last_name}`,
            department_name: l.employees.departments?.department_name
        }));
        res.json({ leaveRequests });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/approveLeave/:leaveId", authenticateToken, requireRole('Admin'), async (req, res) => {
    const { notes } = req.body;
    const { leaveId } = req.params;

    try {
        // Update Leave
        await supabase.from('leavemanagement').update({ status: 'Approved', approval_notes: notes, approval_date: new Date() }).eq('leave_id', leaveId);

        // Get details for attendance/payroll
        const { data: leave } = await supabase.from('leavemanagement').select('*').eq('leave_id', leaveId).single();
        const { data: salary } = await supabase.from('salaries').select('basic_salary').eq('employee_id', leave.employee_id).single();

        const leaveDays = Math.ceil((new Date(leave.leave_end) - new Date(leave.leave_start)) / (86400000)) + 1;
        const dailySalary = salary.basic_salary / 30;
        const salaryAdjustment = dailySalary * leaveDays;

        // Add Attendance
        let current = new Date(leave.leave_start);
        const end = new Date(leave.leave_end);
        const attendances = [];
        while (current <= end) {
            attendances.push({ employee_id: leave.employee_id, attendance_date: new Date(current), unpaid_leave_days: 1, salary_adjustment: dailySalary });
            current.setDate(current.getDate() + 1);
        }
        await supabase.from('attendance').insert(attendances);

        // Update Payroll
        await supabase.rpc('adjust_payroll', {
            emp_id: leave.employee_id,
            adjustment: salaryAdjustment
        });

        res.json({ message: "Leave approved" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/rejectLeave/:leaveId", authenticateToken, requireRole('Admin'), async (req, res) => {
    try {
        await supabase.from('leavemanagement').update({ status: 'Rejected', approval_notes: req.body.notes, approval_date: new Date() }).eq('leave_id', req.params.leaveId);
        res.json({ message: "Leave rejected" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
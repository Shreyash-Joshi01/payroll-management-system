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

// --- Employee & Auth Routes ---

router.post("/addEmployee", async (req, res) => {
    const {
        first_name, last_name, email, contact_number, date_of_birth, job_title,
        gender, address, department_id, salary, hire_date, status,
        password,
        bank_name, account_number, ifsc_code, role_name, grade_name, minimum_salary, maximum_salary
    } = req.body;

    if (!first_name || !last_name || !email || !contact_number || !date_of_birth || !job_title || !gender || !address || !department_id || !salary || !hire_date || !status || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        if (!supabaseAdmin) {
            return res.status(500).json({ error: "System not configured for administrative registration. Missing Service Role Key." });
        }

        // 1. Create Supabase Auth User
        const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { first_name, last_name, role: role_name || 'Employee' }
        });

        if (authError) throw authError;

        // 2. Insert into Employees table with supabase_user_id
        const { data: employee, error: empError } = await supabase
            .from('employees')
            .insert([{
                first_name, last_name, email, contact_number, date_of_birth, job_title,
                gender, address, department_id, salary, hire_date, status, 
                password, // keeping for legacy compatibility if needed, but not used for auth
                supabase_user_id: authUser.user.id
            }])
            .select()
            .single();


        if (empError) throw empError;

        const employeeId = employee.employee_id;
        const basicSalary = salary;
        const grossSalary = basicSalary;
        const taxDeduction = grossSalary * 0.1;
        const totalDeductions = taxDeduction + 100 + 200;
        const netSalary = grossSalary - totalDeductions;

        const insertions = [
            supabase.from('salaries').insert([{ employee_id: employeeId, basic_salary: basicSalary, gross_salary: grossSalary, net_salary: netSalary }]),
            supabase.from('payroll').insert([{ employee_id: employeeId, total_earnings: grossSalary, total_deductions: totalDeductions, net_salary: netSalary, payroll_date: new Date() }]),
            supabase.from('taxation').insert([{ employee_id: employeeId, tax_amount: taxDeduction, tax_percentage: 10, tax_year: new Date().getFullYear() }]),
            supabase.from('deductions').insert([{ employee_id: employeeId, tax: taxDeduction, insurance: 100, loan_repayment: 200, total_deductions: totalDeductions, deduction_name: "default_deduction", amount: totalDeductions }]),
            supabase.from('userroles').insert([{ employee_id: employeeId, role_name: role_name || 'Employee' }]),
            supabase.from('jobtitles').upsert([{ job_title_name: job_title }], { onConflict: 'job_title_name' })
        ];

        if (bank_name && account_number && ifsc_code) {
            insertions.push(supabase.from('bankdetails').insert([{ employee_id: employeeId, bank_name, account_number, ifsc_code }]));
        }

        if (grade_name) {
            insertions.push(supabase.from('salarygrades').upsert([{ grade_name, minimum_salary, maximum_salary }], { onConflict: 'grade_name' }));
        }

        const results = await Promise.all(insertions);
        const errors = results.filter(r => r.error).map(r => r.error);
        if (errors.length > 0) throw errors[0];

        const { data: payrollEntry } = await supabase.from('payroll').select('payroll_id').eq('employee_id', employeeId).order('payroll_date', { ascending: false }).limit(1).single();
        if (payrollEntry) {
            await supabase.from('payslips').insert([{ employee_id: employeeId, payroll_id: payrollEntry.payroll_id, payslip_date: new Date() }]);
        }

        res.json({ message: "Employee added successfully with full payroll processing!", employeeId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/loginAdmin", async (req, res) => {
    const { email, password } = req.body;
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) return res.status(401).json({ success: false, message: error.message });

        // Check if the user has admin role in metadata
        const isAdmin = data.user.user_metadata?.role === 'Admin';
        
        if (!isAdmin) {
            await supabase.auth.signOut();
            return res.status(403).json({ success: false, message: "Unauthorized: Admin access required" });
        }

        res.json({ success: true, role: "admin", session: data.session });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post("/loginEmployee", async (req, res) => {
    const { email, password } = req.body; // Changed from employee_id to email for standard auth
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) return res.status(401).json({ success: false, message: error.message });

        // Fetch employee details from the table
        const { data: employee, error: empError } = await supabase
            .from('employees')
            .select('*')
            .eq('supabase_user_id', data.user.id)
            .single();

        if (empError || !employee) {
            return res.status(404).json({ success: false, message: "Profile not found" });
        }

        res.json({ success: true, role: "employee", employee, session: data.session });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get("/getAllEmployees", async (req, res) => {
    try {
        const { data, error } = await supabase.from('employees').select('*, departments(department_name)');
        if (error) throw error;
        res.json({ employees: data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- Data Management Routes ---

router.get("/checkEmployeeData/:employeeId", async (req, res) => {
    const tables = ["employees", "salaries", "payroll", "taxation", "deductions", "overtime", "bonuses", "attendance", "bankdetails", "leavemanagement", "userroles", "salarygrades", "allowances", "payslips", "jobtitles"];
    const { employeeId } = req.params;

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

router.put("/updateData/:tableName", async (req, res) => {
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

router.delete("/deleteData/:tableName/:id", async (req, res) => {
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

router.get("/getPayslip/:employeeId", async (req, res) => {
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

router.get("/getPayrollHistory/:employeeId", async (req, res) => {
    try {
        const { data, error } = await supabase.from('payroll').select('*').eq('employee_id', req.params.employeeId).order('payroll_date', { ascending: true });
        if (error) throw error;
        res.json({ payrollHistory: data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/addRecord/:tableName", async (req, res) => {
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

router.get("/getLeaveRequests", async (req, res) => {
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

router.post("/approveLeave/:leaveId", async (req, res) => {
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

router.post("/rejectLeave/:leaveId", async (req, res) => {
    try {
        await supabase.from('leavemanagement').update({ status: 'Rejected', approval_notes: req.body.notes, approval_date: new Date() }).eq('leave_id', req.params.leaveId);
        res.json({ message: "Leave rejected" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
-- Payroll Management System Database Schema

-- Departments Table
CREATE TABLE Departments (
  department_id INT AUTO_INCREMENT PRIMARY KEY,
  department_name VARCHAR(255) NOT NULL UNIQUE
);

-- Employees Table
CREATE TABLE Employees (
  employee_id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  contact_number VARCHAR(30) NOT NULL UNIQUE,
  date_of_birth DATE NOT NULL,
  job_title VARCHAR(255) NOT NULL,
  gender ENUM('Male', 'Female', 'Other') NOT NULL,
  address TEXT NOT NULL,
  department_id INT,
  salary DECIMAL(10, 2) NOT NULL,
  hire_date DATE NOT NULL,
  status VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL, -- hashed password for login
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES Departments(department_id)
);

-- JobTitles Table
CREATE TABLE JobTitles (
  job_title_id INT AUTO_INCREMENT PRIMARY KEY,
  job_title_name VARCHAR(255) NOT NULL UNIQUE
);

-- SalaryGrades Table
CREATE TABLE SalaryGrades (
  grade_id INT AUTO_INCREMENT PRIMARY KEY,
  grade_name VARCHAR(100) NOT NULL UNIQUE,
  minimum_salary INT,
  maximum_salary INT
);

-- Deductions Table
CREATE TABLE Deductions (
  deduction_id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT,
  tax DECIMAL(10, 2) NOT NULL,
  insurance DECIMAL(10, 2) NOT NULL,
  loan_repayment DECIMAL(10, 2) NOT NULL,
  total_deductions DECIMAL(10, 2) NOT NULL,
  deduction_name VARCHAR(255),
  amount DECIMAL(10,2),
  FOREIGN KEY (employee_id) REFERENCES Employees(employee_id) ON DELETE CASCADE
);

-- Payroll Table
CREATE TABLE Payroll (
  payroll_id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT,
  total_earnings DECIMAL(10, 2) NOT NULL,
  total_deductions DECIMAL(10, 2) NOT NULL,
  net_salary DECIMAL(10, 2) NOT NULL,
  payroll_date DATE NOT NULL,
  FOREIGN KEY (employee_id) REFERENCES Employees(employee_id) ON DELETE CASCADE
);

-- Taxation Table
CREATE TABLE Taxation (
  tax_id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT,
  tax_amount DECIMAL(10, 2) NOT NULL,
  tax_percentage DECIMAL(5, 2) NOT NULL,
  tax_year YEAR NOT NULL,
  FOREIGN KEY (employee_id) REFERENCES Employees(employee_id) ON DELETE CASCADE
);

-- Allowances Table
CREATE TABLE Allowances (
  allowance_id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT,
  allowance_name VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (employee_id) REFERENCES Employees(employee_id) ON DELETE CASCADE
);

-- LeaveManagement Table
CREATE TABLE LeaveManagement (
  leave_id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT,
  leave_type VARCHAR(100) NOT NULL,
  leave_start DATE NOT NULL,
  leave_end DATE NOT NULL,
  status VARCHAR(50) NOT NULL,
  approval_notes TEXT,
  approved_by INT,
  approval_date DATE,
  FOREIGN KEY (employee_id) REFERENCES Employees(employee_id) ON DELETE CASCADE
);

-- Attendance Table
CREATE TABLE Attendance (
  attendance_id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL,
  clock_in_time DATETIME,
  clock_out_time DATETIME,
  unpaid_leave_days INT DEFAULT 0,
  salary_adjustment DECIMAL(10,2) NOT NULL,
  attendance_date DATE NOT NULL,
  FOREIGN KEY (employee_id) REFERENCES Employees(employee_id) ON DELETE CASCADE
);

-- Bonuses Table
CREATE TABLE Bonuses (
  bonus_id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT,
  bonus_amount DECIMAL(10, 2) NOT NULL,
  bonus_date DATE NOT NULL,
  FOREIGN KEY (employee_id) REFERENCES Employees(employee_id) ON DELETE CASCADE
);

-- Overtime Table
CREATE TABLE Overtime (
  overtime_id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT,
  overtime_hours DECIMAL(5, 2) NOT NULL,
  rate_per_hour DECIMAL(10, 2) NOT NULL,
  overtime_pay DECIMAL(10, 2) NOT NULL,
  overtime_date DATE NOT NULL,
  total_amount DECIMAL(10,2),
  FOREIGN KEY (employee_id) REFERENCES Employees(employee_id) ON DELETE CASCADE
);

-- BankDetails Table
CREATE TABLE BankDetails (
  bank_detail_id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT,
  bank_name VARCHAR(255) NOT NULL,
  account_number VARCHAR(255) NOT NULL UNIQUE,
  ifsc_code VARCHAR(50) NOT NULL,
  FOREIGN KEY (employee_id) REFERENCES Employees(employee_id) ON DELETE CASCADE
);

-- PaySlips Table
CREATE TABLE PaySlips (
  payslip_id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT,
  payroll_id INT,
  payslip_date DATE NOT NULL,
  FOREIGN KEY (employee_id) REFERENCES Employees(employee_id) ON DELETE CASCADE,
  FOREIGN KEY (payroll_id) REFERENCES Payroll(payroll_id) ON DELETE CASCADE
);

-- UserRoles Table
CREATE TABLE UserRoles (
  role_id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT,
  role_name VARCHAR(100) NOT NULL,
  FOREIGN KEY (employee_id) REFERENCES Employees(employee_id) ON DELETE CASCADE
);

-- Salaries Table
CREATE TABLE Salaries (
  salary_id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT,
  basic_salary DECIMAL(10, 2) NOT NULL,
  gross_salary DECIMAL(10, 2) NOT NULL,
  net_salary DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (employee_id) REFERENCES Employees(employee_id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_employee_email ON Employees(email);
CREATE INDEX idx_employee_department ON Employees(department_id);
CREATE INDEX idx_payroll_employee ON Payroll(employee_id);
CREATE INDEX idx_attendance_employee ON Attendance(employee_id); 
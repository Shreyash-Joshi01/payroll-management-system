import React, { useState } from "react";
import toast from "react-hot-toast";
import { FiUser, FiMail, FiPhone, FiCalendar, FiBriefcase, FiMapPin, FiCreditCard, FiLock } from "react-icons/fi";

const initialState = {
  first_name: "", last_name: "", email: "", password: "", confirm_password: "",
  contact_number: "", date_of_birth: "",
  job_title: "", gender: "Male", address: "", department_id: "", salary: "",
  hire_date: "", status: "Active", bank_name: "",
  account_number: "", ifsc_code: "", role_name: "Employee",
  grade_name: "", minimum_salary: "", maximum_salary: ""
};

const AddEmployee = () => {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (form.password.length < 6) {
      return toast.error("Password must be at least 6 characters.");
    }
    if (form.password !== form.confirm_password) {
      return toast.error("Passwords do not match.");
    }

    setLoading(true);
    const loadingToast = toast.loading("Registering employee...");

    try {
      const { confirm_password, ...submitData } = form;
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}/auth/registerEmployee`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...submitData,
          department_id: Number(form.department_id),
          salary: Number(form.salary),
          minimum_salary: Number(form.minimum_salary),
          maximum_salary: Number(form.maximum_salary)
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.emailNote || "Employee registered! Credentials emailed.", { id: loadingToast });
        setForm(initialState);
      } else {
        toast.error(data.error || "Failed to add employee", { id: loadingToast });
      }
    } catch (err) {
      toast.error("Network error. Please try again.", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">Register New Employee</h2>
        <p className="text-text-secondary mt-1">Fill in the details to create a new employee profile and payroll record.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-primary uppercase tracking-widest flex items-center gap-2">
            <FiUser /> Personal Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="First Name" name="first_name" value={form.first_name} onChange={handleChange} required />
            <Input label="Last Name" name="last_name" value={form.last_name} onChange={handleChange} required />
            <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
            <Input label="Contact Number" name="contact_number" value={form.contact_number} onChange={handleChange} required />
            <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} required placeholder="Min 6 characters" />
            <Input label="Confirm Password" name="confirm_password" type="password" value={form.confirm_password} onChange={handleChange} required />
            <Input label="Date of Birth" name="date_of_birth" type="date" value={form.date_of_birth} onChange={handleChange} required />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-text-muted uppercase px-1">Gender</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full bg-elevated border border-neon rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-primary transition-all"
              >
                <option value="Male" className="bg-midnight text-white">Male</option>
                <option value="Female" className="bg-midnight text-white">Female</option>
                <option value="Other" className="bg-midnight text-white">Other</option>
              </select>
            </div>
          </div>
          <div className="w-full relative">
            <label className="text-xs font-bold text-text-muted uppercase px-1 mb-1 block">Residential Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows="2"
              className="w-full bg-white-5 border border-white-10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-all"
              required
            />
          </div>
        </section>

        {/* Job & Salary Information */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-primary uppercase tracking-widest flex items-center gap-2">
            <FiBriefcase /> Employment & Salary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Job Title" name="job_title" value={form.job_title} onChange={handleChange} required />
            <Input label="Department ID" name="department_id" type="number" value={form.department_id} onChange={handleChange} required />
            <Input label="Basic Salary" name="salary" type="number" value={form.salary} onChange={handleChange} required />
            <Input label="Hire Date" name="hire_date" type="date" value={form.hire_date} onChange={handleChange} required />
            <Input label="Grade Name" name="grade_name" value={form.grade_name} onChange={handleChange} required />
            <Input label="Role" name="role_name" value={form.role_name} onChange={handleChange} required />
            <Input label="Min Salary Range" name="minimum_salary" type="number" value={form.minimum_salary} onChange={handleChange} required />
            <Input label="Max Salary Range" name="maximum_salary" type="number" value={form.maximum_salary} onChange={handleChange} required />

          </div>
        </section>

        {/* Bank Information */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-primary uppercase tracking-widest flex items-center gap-2">
            <FiCreditCard /> Bank Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Bank Name" name="bank_name" value={form.bank_name} onChange={handleChange} required />
            <Input label="Account Number" name="account_number" value={form.account_number} onChange={handleChange} required />
            <Input label="IFSC Code" name="ifsc_code" value={form.ifsc_code} onChange={handleChange} required />
          </div>
        </section>

        <div className="pt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-accent-primary hover:bg-accent-secondary text-white rounded-2xl font-black shadow-neon transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:transform-none uppercase tracking-widest"
          >
            {loading ? "Processing..." : "Confirm Employee Registration"}
          </button>
        </div>
      </form>
    </div>
  );
};

const Input = ({ label, ...props }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold text-text-muted uppercase px-1">{label}</label>
    <input
      {...props}
      className="w-full bg-elevated border border-neon rounded-xl px-4 py-3 text-white placeholder:text-muted focus:outline-none focus:border-accent-primary transition-all"
    />
  </div>
);

export default AddEmployee;

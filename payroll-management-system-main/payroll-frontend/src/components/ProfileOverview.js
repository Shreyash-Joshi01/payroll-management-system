import React from 'react';

const ProfileOverview = ({ employee }) => {
  if (!employee) return (
    <div className="bg-card rounded-lg p-4 mb-4 shadow">
      <h3 className="text-lg font-bold mb-2">Profile Overview</h3>
      <div className="text-gray-400">No employee data available.</div>
    </div>
  );
  return (
    <div className="bg-card rounded-lg p-4 mb-4 shadow">
      <h3 className="text-lg font-bold mb-2">Profile Overview</h3>
      <div><span className="font-bold">Name:</span> {employee.first_name} {employee.last_name}</div>
      <div><span className="font-bold">Job Title:</span> {employee.job_title}</div>
      <div><span className="font-bold">Department:</span> {employee.department_id}</div>
      <div><span className="font-bold">Email:</span> {employee.email}</div>
      <div><span className="font-bold">Contact:</span> {employee.contact_number}</div>
      <div><span className="font-bold">Hire Date:</span> {employee.hire_date}</div>
      <div><span className="font-bold">Status:</span> {employee.status}</div>
    </div>
  );
};

export default ProfileOverview; 

import React from 'react';

const Notifications = () => {
  // In a real app, fetch notifications from backend or context
  const notifications = [
    'Your leave request has been approved.',
    'Upcoming payroll date: 30th June.',
    'Salary structure updated for FY 2024.'
  ];
  return (
    <div className="bg-card rounded-lg p-4 mb-4 shadow">
      <h3 className="text-lg font-bold mb-2">Notifications & Reminders</h3>
      <ul>
        {notifications.map((note, idx) => (
          <li key={idx} className="mb-1">{note}</li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications; 

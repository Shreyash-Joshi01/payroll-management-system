import React, { useEffect, useState } from 'react';

const PaySlipsDownload = ({ employeeId }) => {
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!employeeId) return;
    setLoading(true);
    fetch(`/getAllRecords/Payroll/${employeeId}`)
      .then(res => res.json())
      .then(result => {
        if (result.records) {
          setPayslips(result.records);
        } else {
          setPayslips([]);
        }
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load payslips');
        setLoading(false);
      });
  }, [employeeId]);

  const handleDownload = (payslip) => {
    // For now, just alert. Implement PDF/CSV download as needed.
    alert(`Download payslip for ${payslip.payroll_date}`);
  };

  return (
    <div className="bg-card rounded-lg p-4 mb-4 shadow">
      <h3 className="text-lg font-bold mb-2">Download Pay Slips</h3>
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : error ? (
        <div className="text-red-400">{error}</div>
      ) : payslips.length === 0 ? (
        <div className="text-gray-400">No payslips available.</div>
      ) : (
        <ul>
          {payslips.map((p, idx) => (
            <li key={idx} className="flex items-center justify-between mb-2">
              <span>{p.payroll_date ? p.payroll_date.slice(0, 10) : 'Payslip'}</span>
              <button className="bg-green text-white px-3 py-1 rounded" onClick={() => handleDownload(p)}>
                Download
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PaySlipsDownload; 

import React, { useEffect, useState } from 'react';

const TaxationSummary = ({ employeeId }) => {
  const [tax, setTax] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!employeeId) return;
    setLoading(true);
    fetch(`/getRecord/Taxation/${employeeId}`)
      .then(res => res.json())
      .then(result => {
        if (result.record) {
          setTax(result.record);
        } else {
          setTax(null);
        }
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load taxation data');
        setLoading(false);
      });
  }, [employeeId]);

  const handleDownload = () => {
    // For now, just alert. Implement PDF/CSV download as needed.
    alert('Download tax certificate/summary');
  };

  return (
    <div className="bg-card rounded-lg p-4 mb-4 shadow">
      <h3 className="text-lg font-bold mb-2">Taxation Summary</h3>
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : error ? (
        <div className="text-red-400">{error}</div>
      ) : !tax ? (
        <div className="text-gray-400">No taxation data available.</div>
      ) : (
        <div>
          <div>Tax Paid: <span className="font-bold">${tax.tax_amount}</span></div>
          <div>Tax Percentage: <span className="font-bold">{tax.tax_percentage}%</span></div>
          <div>Tax Year: <span className="font-bold">{tax.tax_year}</span></div>
          <button className="bg-green text-white px-3 py-1 rounded mt-2" onClick={handleDownload}>
            Download Tax Certificate
          </button>
        </div>
      )}
    </div>
  );
};

export default TaxationSummary; 

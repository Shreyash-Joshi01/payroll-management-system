import React, { useEffect, useState } from 'react';

const maskAccount = (acc) => acc ? acc.replace(/.(?=.{4})/g, '*') : '';

const BankDetails = ({ employeeId }) => {
  const [bank, setBank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requested, setRequested] = useState(false);

  useEffect(() => {
    if (!employeeId) return;
    setLoading(true);
    fetch(`/getRecord/BankDetails/${employeeId}`)
      .then(res => res.json())
      .then(result => {
        if (result.record) {
          setBank(result.record);
        } else {
          setBank(null);
        }
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load bank details');
        setLoading(false);
      });
  }, [employeeId]);

  const handleRequestUpdate = () => {
    setRequested(true);
    // Implement actual request logic as needed
  };

  return (
    <div className="bg-card rounded-lg p-4 mb-4 shadow">
      <h3 className="text-lg font-bold mb-2">Bank Details</h3>
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : error ? (
        <div className="text-red-400">{error}</div>
      ) : !bank ? (
        <div className="text-gray-400">No bank details available.</div>
      ) : (
        <div>
          <div>Bank: <span className="font-bold">{bank.bank_name}</span></div>
          <div>Account: <span className="font-bold">{maskAccount(bank.account_number)}</span></div>
          <div>IFSC: <span className="font-bold">{bank.ifsc_code}</span></div>
          <button className="bg-green text-white px-3 py-1 rounded mt-2" onClick={handleRequestUpdate} disabled={requested}>
            {requested ? 'Update Requested' : 'Request Update'}
          </button>
        </div>
      )}
    </div>
  );
};

export default BankDetails; 

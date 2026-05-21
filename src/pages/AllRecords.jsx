// src/pages/AllRecords.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useLoanData } from '../context/LoanContext';
import { PAYMENT_STATUS } from '../constants/enums';

export default function AllRecords() {
  const { entries } = useLoanData();

  // Helper function to colorize the status badges
  const getStatusBadge = (status) => {
    switch (status) {
      case PAYMENT_STATUS.PAID:
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">{status}</span>;
      case PAYMENT_STATUS.PARTIALLY_PAID:
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">{status}</span>;
      case PAYMENT_STATUS.UNPAID:
      default:
        return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">{status}</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">All Financial Records</h2>
        <Link 
          to="/create" 
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          + New Entry
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        {entries.length === 0 ? (
          <div className="p-8 text-center text-gray-500 italic">
            No entries found. Click "New Entry" to start tracking.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200 text-gray-600 text-sm uppercase tracking-wider">
                <th className="p-4">Ref ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Type</th>
                <th className="p-4">Borrower</th>
                <th className="p-4">Total</th>
                <th className="p-4">Remaining</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {entries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50 transition">
                  <td className="p-4 text-sm font-mono text-gray-500">{entry.referenceId}</td>
                  <td className="p-4 font-medium text-gray-800">{entry.entryName}</td>
                  <td className="p-4 text-sm text-gray-600">{entry.transactionType}</td>
                  <td className="p-4 text-sm text-gray-800">
                    {/* Depending on how you stored borrowerId, this displays the ID or mapped name */}
                    {entry.borrowerId}
                  </td>
                  <td className="p-4 text-sm text-gray-800 font-semibold">
                    {entry.amountBorrowed.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-4 text-sm text-gray-800 font-semibold">
                    {entry.amountRemaining.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-4">
                    {getStatusBadge(entry.status)}
                  </td>
                  <td className="p-4">
                    <Link 
                      to={`/entry/${entry.id}`} 
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View Details &rarr;
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
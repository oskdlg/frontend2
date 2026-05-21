// src/components/entries/GroupAllocation.jsx
import React, { useState, useEffect } from 'react';
import { useLoanData } from '../../context/LoanContext';
import { divideEqually } from '../../utils/calculations';

export default function GroupAllocation({ entry }) {
  const { groups, updateEntry } = useLoanData();
  const [activeTab, setActiveTab] = useState('equal');
  
  // Find the actual group object to get its members
  const group = groups.find(g => g.name === entry.borrowerId || g.id === entry.borrowerId);
  const members = group ? group.members : [];

  // Default to dividing equally on load if no allocations exist
  useEffect(() => {
    if (members.length > 0 && (!entry.allocations || entry.allocations.length === 0)) {
      handleDivideEqually();
    }
  }, []);

  const handleDivideEqually = () => {
    setActiveTab('equal');
    const equalSplit = divideEqually(entry.amountBorrowed, members);
    updateEntry({ ...entry, allocations: equalSplit });
  };

  const handleDivideByPercent = () => {
    setActiveTab('percent');
    // Initialize empty percentages for manual entry
    const blankPercentSplit = members.map(m => ({ ...m, allocatedAmount: 0, percentage: 0 }));
    updateEntry({ ...entry, allocations: blankPercentSplit });
  };

  const handleDivideByAmount = () => {
    setActiveTab('amount');
    // Initialize empty amounts for manual entry
    const blankAmountSplit = members.map(m => ({ ...m, allocatedAmount: 0, percentage: 0 }));
    updateEntry({ ...entry, allocations: blankAmountSplit });
  };

  if (!group || members.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Group Payment Allocation</h3>
      
      {/* Quick Actions */}
      <div className="flex space-x-2 mb-6">
        <button 
          onClick={handleDivideEqually}
          className={`px-4 py-2 text-sm font-semibold rounded-md transition ${activeTab === 'equal' ? 'bg-indigo-100 text-indigo-700 border-indigo-200 border' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          Divide Equally
        </button>
        <button 
          onClick={handleDivideByPercent}
          className={`px-4 py-2 text-sm font-semibold rounded-md transition ${activeTab === 'percent' ? 'bg-indigo-100 text-indigo-700 border-indigo-200 border' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          Divide by Percent
        </button>
        <button 
          onClick={handleDivideByAmount}
          className={`px-4 py-2 text-sm font-semibold rounded-md transition ${activeTab === 'amount' ? 'bg-indigo-100 text-indigo-700 border-indigo-200 border' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          Divide by Amount
        </button>
      </div>

      {/* Allocation Table */}
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
            <th className="p-3 w-1/3">Payee (Member)</th>
            <th className="p-3 w-1/3">Amount to Pay</th>
            <th className="p-3 w-1/3">Percentage</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {(entry.allocations || []).map((allocation, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="p-3 text-sm font-medium text-gray-800">{allocation.name}</td>
              <td className="p-3 text-sm text-gray-800 font-semibold">
                {activeTab === 'equal' ? (
                  `₱ ${allocation.allocatedAmount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                ) : (
                  <input type="number" placeholder="0.00" className="border rounded px-2 py-1 w-full max-w-30" disabled={activeTab !== 'amount'} />
                )}
              </td>
              <td className="p-3 text-sm text-gray-500">
                {activeTab === 'equal' ? (
                  `${allocation.percentage}%`
                ) : (
                  <div className="flex items-center space-x-1">
                    <input type="number" placeholder="0" className="border rounded px-2 py-1 w-16" disabled={activeTab !== 'percent'} />
                    <span>%</span>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
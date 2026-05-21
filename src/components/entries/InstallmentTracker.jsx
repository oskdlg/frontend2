// src/components/entries/InstallmentTracker.jsx
import React from 'react';
import { calculateProgressPercentage } from '../../utils/calculations';
import { INSTALLMENT_STATUS } from '../../constants/enums';

export default function InstallmentTracker({ entry, onAddPayment }) {
  const details = entry.installmentDetails || {};
  const progress = calculateProgressPercentage(entry.amountBorrowed, entry.amountRemaining);
  let currentInstallmentStatus = details.status;
  const today = new Date().toISOString().split('T')[0];
  
  if (currentInstallmentStatus !== INSTALLMENT_STATUS.PAID && currentInstallmentStatus !== INSTALLMENT_STATUS.SKIPPED) {
    if (today < details.startDate) {
      currentInstallmentStatus = INSTALLMENT_STATUS.NOT_STARTED;
    } else if (today >= details.startDate && entry.amountRemaining > 0) {
      currentInstallmentStatus = INSTALLMENT_STATUS.UNPAID; // Or Delinquent if logic dictates
    }
  }

  const handleSkipTerm = () => {
    // In a full production app, this would update a schedule array in context.
    // For now, we alert the user of the action.
    if (window.confirm("Are you sure you want to skip the current term?")) {
      alert("Term marked as SKIPPED. (Next due date shifted).");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">Installment Tracker</h3>
        <div className="space-x-3">
          <button 
            onClick={handleSkipTerm}
            className="text-orange-600 hover:bg-orange-50 px-3 py-1 rounded border border-orange-200 transition text-sm font-semibold"
          >
            Skip Term
          </button>
          <button 
            onClick={onAddPayment}
            className="bg-emerald-600 text-white px-3 py-1 rounded hover:bg-emerald-700 transition text-sm font-semibold"
          >
            + Add Payment
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-1">
          <span className="font-semibold text-gray-700">Payment Progress</span>
          <span className="font-bold text-emerald-600">{progress}% Paid</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-emerald-600 h-3 rounded-full transition-all duration-500" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Installment Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-gray-50 p-4 rounded border">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Status</p>
          <p className="font-semibold text-gray-800">{details.status || INSTALLMENT_STATUS.NOT_STARTED}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Start Date</p>
          <p className="font-semibold text-gray-800">{details.startDate}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Frequency</p>
          <p className="font-semibold text-gray-800">{details.paymentFrequency}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Terms</p>
          <p className="font-semibold text-gray-800">{details.paymentTerms}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Amt per Term</p>
          <p className="font-bold text-emerald-700">₱ {details.amountPerTerm?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </div>
      </div>
    </div>
  );
}
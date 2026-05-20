// src/components/entries/CreateEntry.jsx
import React, { useState } from 'react';
import { useLoanData } from '../../context/LoanContext';
import { generateEntryId, generateReferenceId } from '../../utils/generators';
import { calculateInstallmentAmount } from '../../utils/calculations';
import { TRANSACTION_TYPES, PAYMENT_STATUS, INSTALLMENT_STATUS, PAYMENT_FREQUENCY } from '../../constants/enums';

export default function CreateEntry() {
  const { addEntry, people, groups } = useLoanData();
  
  // Base Entry State
  const [formData, setFormData] = useState({
    entryName: '',
    description: '',
    transactionType: TRANSACTION_TYPES.STRAIGHT_EXPENSE,
    dateBorrowed: new Date().toISOString().split('T')[0],
    borrowerId: '',
    borrowerType: 'person', // 'person' or 'group'
    lender: 'Me', // Defaulting to 'Me' for simplicity
    amountBorrowed: '',
    notes: ''
  });

  // Installment Specific State
  const [installmentData, setInstallmentData] = useState({
    startDate: '',
    paymentFrequency: PAYMENT_FREQUENCY.MONTHLY,
    paymentTerms: '',
  });

  const handleBaseChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInstallmentChange = (e) => {
    const { name, value } = e.target;
    setInstallmentData(prev => ({ ...prev, [name]: value }));
  };

  const isInstallment = formData.transactionType === TRANSACTION_TYPES.INSTALLMENT_EXPENSE;
  const isGroupAllowed = formData.transactionType !== TRANSACTION_TYPES.INSTALLMENT_EXPENSE;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Determine borrower name for the Reference ID
    let borrowerName = 'Unknown';
    if (formData.borrowerType === 'person') {
      const person = people.find(p => p.id === formData.borrowerId);
      borrowerName = person ? person.name : formData.borrowerId;
    } else {
      const group = groups.find(g => g.id === formData.borrowerId);
      borrowerName = group ? group.name : formData.borrowerId;
    }

    const entryId = generateEntryId();
    const refId = generateReferenceId(borrowerName, formData.lender, formData.borrowerType === 'group');

    // Build the final payload
    const newEntry = {
      id: entryId,
      referenceId: refId,
      ...formData,
      amountBorrowed: parseFloat(formData.amountBorrowed),
      amountRemaining: parseFloat(formData.amountBorrowed),
      status: PAYMENT_STATUS.UNPAID,
      payments: []
    };

    // Append Installment Data if applicable
    if (isInstallment) {
      newEntry.installmentDetails = {
        ...installmentData,
        paymentTerms: parseInt(installmentData.paymentTerms, 10),
        status: INSTALLMENT_STATUS.NOT_STARTED,
        amountPerTerm: calculateInstallmentAmount(
          parseFloat(formData.amountBorrowed), 
          parseInt(installmentData.paymentTerms, 10)
        )
      };
    }

    addEntry(newEntry);
    alert(`Entry Created! Reference ID: ${refId}`);
    
    // Reset Form (Optional: Redirect to entry details instead)
    setFormData({ ...formData, entryName: '', amountBorrowed: '' });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Loan Entry</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Entry Name *</label>
            <input required name="entryName" value={formData.entryName} onChange={handleBaseChange} className="mt-1 w-full border rounded-md p-2" placeholder="e.g. Dinner at Antonio's" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Transaction Type *</label>
            <select name="transactionType" value={formData.transactionType} onChange={handleBaseChange} className="mt-1 w-full border rounded-md p-2">
              {Object.values(TRANSACTION_TYPES).map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Amount Borrowed *</label>
            <input required type="number" step="0.01" name="amountBorrowed" value={formData.amountBorrowed} onChange={handleBaseChange} className="mt-1 w-full border rounded-md p-2" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date Borrowed</label>
            <input type="date" name="dateBorrowed" value={formData.dateBorrowed} onChange={handleBaseChange} className="mt-1 w-full border rounded-md p-2" />
          </div>
        </div>

        {/* Entities (Borrower / Lender) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Borrower Type</label>
            <select name="borrowerType" value={formData.borrowerType} onChange={handleBaseChange} className="mt-1 w-full border rounded-md p-2" disabled={!isGroupAllowed}>
              <option value="person">Individual Person</option>
              {isGroupAllowed && <option value="group">Group of People</option>}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Select Borrower *</label>
            {/* In a real app, populate this with actual mapped options from `people` or `groups` array */}
            <input required name="borrowerId" value={formData.borrowerId} onChange={handleBaseChange} className="mt-1 w-full border rounded-md p-2" placeholder={formData.borrowerType === 'person' ? "Enter person name..." : "Enter group name..."} />
          </div>
        </div>

        {/* Conditional: Installment Details */}
        {isInstallment && (
          <div className="bg-blue-50 p-4 rounded-md border border-blue-100 space-y-4">
            <h3 className="font-semibold text-blue-800">Installment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date *</label>
                <input required type="date" name="startDate" value={installmentData.startDate} onChange={handleInstallmentChange} className="mt-1 w-full border rounded-md p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Frequency *</label>
                <select name="paymentFrequency" value={installmentData.paymentFrequency} onChange={handleInstallmentChange} className="mt-1 w-full border rounded-md p-2">
                  <option value={PAYMENT_FREQUENCY.WEEKLY}>Weekly</option>
                  <option value={PAYMENT_FREQUENCY.MONTHLY}>Monthly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Number of Terms *</label>
                <input required type="number" min="1" name="paymentTerms" value={installmentData.paymentTerms} onChange={handleInstallmentChange} className="mt-1 w-full border rounded-md p-2" />
              </div>
            </div>
            {formData.amountBorrowed && installmentData.paymentTerms && (
              <div className="text-sm text-blue-700 mt-2">
                <strong>Calculated per term:</strong> {calculateInstallmentAmount(parseFloat(formData.amountBorrowed), parseInt(installmentData.paymentTerms))}
              </div>
            )}
          </div>
        )}

        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded hover:bg-blue-700 transition">
          Create Entry
        </button>
      </form>
    </div>
  );
}
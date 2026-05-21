// src/pages/EntryDetails.jsx
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLoanData } from '../context/LoanContext';
import { v4 as uuidv4 } from 'uuid';
import { TRANSACTION_TYPES, INSTALLMENT_STATUS } from '../constants/enums';
import InstallmentTracker from '../components/entries/InstallmentTracker';
import GroupAllocation from '../components/entries/GroupAllocation';

export default function EntryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { entries, addPayment, deleteEntry, updateEntry } = useLoanData();
  
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Find current entry
  const entry = entries.find(e => e.id === id);

  // States for forms
  const [paymentData, setPaymentData] = useState({
    paymentDate: new Date().toISOString().split('T')[0],
    paymentAmount: '',
    payee: '',
    notes: ''
  });

  // Load entry data into edit form state
  const [editData, setEditData] = useState({
    entryName: entry?.entryName || '',
    description: entry?.description || '',
    notes: entry?.notes || ''
  });

  if (!entry) {
    return (
      <div className="max-w-4xl mx-auto p-6 mt-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Entry Not Found</h2>
        <Link to="/records" className="text-emerald-600 mt-4 inline-block hover:underline">&larr; Back to Records</Link>
      </div>
    );
  }

  // --- Handlers ---

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateEntry({
      ...entry,
      entryName: editData.entryName,
      description: editData.description,
      notes: editData.notes
    });
    setIsEditing(false);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(paymentData.paymentAmount);
    if (amount <= 0 || amount > entry.amountRemaining) {
      alert(`Invalid amount. Must be greater than 0 and less than or equal to ${entry.amountRemaining}`);
      return;
    }

    const newPayment = {
      id: uuidv4(),
      paymentDate: paymentData.paymentDate,
      paymentAmount: amount,
      payee: paymentData.payee || entry.borrowerId,
      notes: paymentData.notes
    };

    addPayment(entry.id, newPayment);
    setShowPaymentForm(false);
    setPaymentData({ ...paymentData, paymentAmount: '', notes: '' });
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this entry? This action cannot be undone.")) {
      deleteEntry(entry.id);
      navigate('/records');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 mt-8 space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <Link to="/records" className="text-gray-500 hover:text-emerald-500 transition">&larr; Back to Records</Link>
        <div className="space-x-4">
          <button onClick={() => setIsEditing(!isEditing)} className="text-emerald-600 hover:text-white text-sm font-semibold">
            {isEditing ? 'Cancel Edit' : 'Edit Details'}
          </button>
          <button onClick={handleDelete} className="text-red-600 hover:text-red-800 text-sm font-semibold">Delete Entry</button>
        </div>
      </div>

      {/* Core Details Card OR Edit Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        {isEditing ? (
          <form onSubmit={handleEditSubmit} className="space-y-4 border-b pb-6 mb-6">
            <h3 className="text-xl font-bold text-gray-800">Edit Entry Details</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">Entry Name *</label>
              <input required value={editData.entryName} onChange={(e) => setEditData({...editData, entryName: e.target.value})} className="mt-1 w-full border rounded p-2 focus:ring-emerald-500 focus:border-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <input value={editData.description} onChange={(e) => setEditData({...editData, description: e.target.value})} className="mt-1 w-full border rounded p-2 focus:ring-emerald-500 focus:border-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <textarea value={editData.notes} onChange={(e) => setEditData({...editData, notes: e.target.value})} className="mt-1 w-full border rounded p-2 focus:ring-emerald-500 focus:border-emerald-500" rows="3" />
            </div>
            <button type="submit" className="bg-emerald-600 text-white font-bold py-2 px-6 rounded hover:bg-emerald-700 transition">
              Save Changes
            </button>
          </form>
        ) : (
          <div className="flex justify-between items-start mb-6 border-b pb-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">{entry.entryName}</h2>
              <p className="text-sm text-gray-500 font-mono mt-1">Ref: {entry.referenceId}</p>
              {entry.description && <p className="text-gray-600 mt-2">{entry.description}</p>}
              {entry.notes && <p className="text-sm text-gray-500 italic mt-1">Notes: {entry.notes}</p>}
            </div>
            <div className="text-right">
              <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm font-bold rounded-full uppercase tracking-wide">
                {entry.status}
              </span>
              <p className="text-sm text-gray-500 mt-2">{entry.transactionType}</p>
              {entry.dateFullyPaid && (
                <p className="text-xs text-green-600 font-bold mt-1">Paid on: {entry.dateFullyPaid}</p>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-2">
          <div>
            <p className="text-sm text-gray-500">Borrower</p>
            <p className="font-semibold text-gray-800">{entry.borrowerId}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date Borrowed</p>
            <p className="font-semibold text-gray-800">{entry.dateBorrowed}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Borrowed</p>
            <p className="font-bold text-gray-800 text-lg">₱ {entry.amountBorrowed.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Remaining Balance</p>
            <p className={`font-bold text-lg ${entry.amountRemaining > 0 ? 'text-red-600' : 'text-green-600'}`}>
              ₱ {entry.amountRemaining.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {/* CONDITIONAL: Installment Tracker */}
      {entry.transactionType === TRANSACTION_TYPES.INSTALLMENT_EXPENSE && (
        <InstallmentTracker entry={entry} onAddPayment={() => setShowPaymentForm(true)} />
      )}

      {/* CONDITIONAL: Group Allocation */}
      {entry.borrowerType === 'group' && (
        <GroupAllocation entry={entry} />
      )}

      {/* Payments Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">Payment History</h3>
          {entry.amountRemaining > 0 && (
            <button 
              onClick={() => setShowPaymentForm(!showPaymentForm)}
              className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition text-sm"
            >
              {showPaymentForm ? 'Cancel Payment' : '+ Log Payment'}
            </button>
          )}
        </div>

        {/* Payment Form (Conditional) */}
        {showPaymentForm && (
          <form onSubmit={handlePaymentSubmit} className="bg-green-50 p-4 rounded-md border border-emerald-100 mb-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input required type="date" value={paymentData.paymentDate} onChange={(e) => setPaymentData({...paymentData, paymentDate: e.target.value})} className="mt-1 w-full border rounded p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Amount</label>
                <input required type="number" step="0.01" max={entry.amountRemaining} value={paymentData.paymentAmount} onChange={(e) => setPaymentData({...paymentData, paymentAmount: e.target.value})} className="mt-1 w-full border rounded p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Payee Name</label>
                <input type="text" placeholder={entry.borrowerId} value={paymentData.payee} onChange={(e) => setPaymentData({...paymentData, payee: e.target.value})} className="mt-1 w-full border rounded p-2" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Notes (Optional)</label>
                <input type="text" value={paymentData.notes} onChange={(e) => setPaymentData({...paymentData, notes: e.target.value})} className="mt-1 w-full border rounded p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Proof of Payment (Optional)</label>
                <input type="file" accept="image/*" className="mt-1 w-full border rounded p-2 bg-white" />
              </div>
            </div>
            <button type="submit" className="bg-green-600 text-white font-bold py-2 px-6 rounded hover:bg-green-700 transition w-full md:w-auto">
              Save Payment
            </button>
          </form>
        )}

        {/* Payments Table */}
        {(!entry.payments || entry.payments.length === 0) ? (
          <p className="text-gray-500 italic">No payments have been recorded yet.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b text-gray-600 text-sm">
                <th className="p-3">Date</th>
                <th className="p-3">Payee</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {entry.payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="p-3 text-sm text-gray-800">{payment.paymentDate}</td>
                  <td className="p-3 text-sm text-gray-800">{payment.payee}</td>
                  <td className="p-3 text-sm font-semibold text-green-600">
                    + ₱ {payment.paymentAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-3 text-sm text-gray-500">{payment.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
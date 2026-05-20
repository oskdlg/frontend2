// src/context/LoanContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { calculateRemainingBalance } from '../utils/calculations';

const LoanContext = createContext();

// Initial empty state
const initialState = {
  entries: [],
  people: [],
  groups: []
};

export const LoanProvider = ({ children }) => {
  // Load initial data from localStorage or fallback to initialState
  const [data, setData] = useState(() => {
    const savedData = localStorage.getItem('loanTrackerDB');
    return savedData ? JSON.parse(savedData) : initialState;
  });

  // Auto-save to localStorage whenever 'data' changes
  useEffect(() => {
    localStorage.setItem('loanTrackerDB', JSON.stringify(data));
  }, [data]);

  // --- ENTRIES CRUD ---

  const addEntry = (newEntry) => {
    setData((prev) => ({
      ...prev,
      entries: [...prev.entries, { ...newEntry, payments: [] }]
    }));
  };

  const updateEntry = (updatedEntry) => {
    setData((prev) => ({
      ...prev,
      entries: prev.entries.map((entry) => 
        entry.id === updatedEntry.id ? updatedEntry : entry
      )
    }));
  };

  const deleteEntry = (entryId) => {
    setData((prev) => ({
      ...prev,
      entries: prev.entries.filter((entry) => entry.id !== entryId)
    }));
  };

  // --- PAYMENTS LOGIC ---

  const addPayment = (entryId, newPayment) => {
    setData((prev) => {
      return {
        ...prev,
        entries: prev.entries.map((entry) => {
          if (entry.id !== entryId) return entry;

          const updatedPayments = [...(entry.payments || []), newPayment];
          
          // Recalculate the remaining balance instantly
          const remaining = calculateRemainingBalance(entry.amountBorrowed, updatedPayments);
          
          // Determine new status based on remaining amount
          let newStatus = entry.status;
          if (remaining === 0) {
            newStatus = 'PAID';
          } else if (remaining < entry.amountBorrowed) {
            newStatus = 'PARTIALLY PAID';
          }

          return {
            ...entry,
            payments: updatedPayments,
            amountRemaining: remaining,
            status: newStatus
          };
        })
      };
    });
  };

  // --- PEOPLE & GROUPS CRUD ---
  
  const addPerson = (person) => {
    setData((prev) => ({ ...prev, people: [...prev.people, person] }));
  };

  const addGroup = (group) => {
    setData((prev) => ({ ...prev, groups: [...prev.groups, group] }));
  };

  // The context value exposes state and all action modifiers
  const value = {
    entries: data.entries,
    people: data.people,
    groups: data.groups,
    addEntry,
    updateEntry,
    deleteEntry,
    addPayment,
    addPerson,
    addGroup
  };

  return <LoanContext.Provider value={value}>{children}</LoanContext.Provider>;
};

// Custom hook for easy access in components
export const useLoanData = () => {
  const context = useContext(LoanContext);
  if (!context) {
    throw new Error('useLoanData must be used within a LoanProvider');
  }
  return context;
};
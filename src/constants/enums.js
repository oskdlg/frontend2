// src/constants/enums.js

export const TRANSACTION_TYPES = {
  STRAIGHT_EXPENSE: 'Straight Expense',
  INSTALLMENT_EXPENSE: 'Installment Expense',
  GROUP_EXPENSE: 'Group Expense',
};

export const PAYMENT_STATUS = {
  UNPAID: 'UNPAID',
  PARTIALLY_PAID: 'PARTIALLY PAID',
  PAID: 'PAID',
};

export const INSTALLMENT_STATUS = {
  NOT_STARTED: 'NOT STARTED',
  UNPAID: 'UNPAID',
  PAID: 'PAID',
  SKIPPED: 'SKIPPED',
  DELINQUENT: 'DELINQUENT',
};

export const PAYMENT_ALLOCATION_STATUS = {
  UNPAID: 'UNPAID',
  PARTIALLY_PAID: 'PARTIALLY PAID',
  PAID: 'PAID',
};

export const PAYMENT_FREQUENCY = {
  MONTHLY: 'Monthly', // Note: UI should restrict to 1st-28th
  WEEKLY: 'Weekly',   // Note: UI should restrict to Sun-Sat
};
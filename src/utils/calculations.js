// src/utils/calculations.js

/**
 * Calculates the payment amount per term for an installment.
 * @param {number} amountBorrowed - Total loan amount
 * @param {number} paymentTerms - Number of terms to pay
 * @returns {number} Amount due per term, rounded to 2 decimal places
 */
export const calculateInstallmentAmount = (amountBorrowed, paymentTerms) => {
  if (!amountBorrowed || !paymentTerms || paymentTerms <= 0) return 0;
  return Number((amountBorrowed / paymentTerms).toFixed(2));
};

/**
 * Divides an amount equally among a group, handling odd pennies.
 * e.g. 100 / 3 people = [33.34, 33.33, 33.33]
 * @param {number} totalAmount - Total expense amount
 * @param {Array} members - Array of member objects/IDs
 * @returns {Array} Array of objects with member and allocated amount
 */
export const divideEqually = (totalAmount, members) => {
  if (!totalAmount || !members || members.length === 0) return [];

  const count = members.length;
  const baseShare = Math.floor((totalAmount / count) * 100) / 100;
  
  // Calculate remaining pennies that couldn't be divided evenly
  let remainder = Number((totalAmount - (baseShare * count)).toFixed(2));

  return members.map((member, index) => {
    let amount = baseShare;
    // Distribute the remainder pennies to the first few people
    if (remainder >= 0.01) {
      amount = Number((amount + 0.01).toFixed(2));
      remainder = Number((remainder - 0.01).toFixed(2));
    }
    return {
      ...member,
      allocatedAmount: amount,
      percentage: Number(((amount / totalAmount) * 100).toFixed(2))
    };
  });
};

/**
 * Divides an amount based on explicit percentages.
 * @param {number} totalAmount - Total expense amount
 * @param {Array} allocations - Array of { member, percentage }
 * @returns {Array} Allocations mapped with exact amounts
 */
export const divideByPercent = (totalAmount, allocations) => {
  if (!totalAmount || !allocations) return [];

  return allocations.map(allocation => {
    const amount = Number((totalAmount * (allocation.percentage / 100)).toFixed(2));
    return {
      ...allocation,
      allocatedAmount: amount
    };
  });
};

/**
 * Calculates the total remaining balance of a loan.
 * @param {number} amountBorrowed - Initial loan
 * @param {Array} payments - Array of payment objects with a paymentAmount property
 * @returns {number} Remaining balance
 */
export const calculateRemainingBalance = (amountBorrowed, payments = []) => {
  const totalPaid = payments.reduce((sum, payment) => sum + payment.paymentAmount, 0);
  const remaining = amountBorrowed - totalPaid;
  // Ensure we don't return negative remaining if they overpaid slightly
  return Math.max(0, Number(remaining.toFixed(2)));
};

/**
 * Calculates the percentage of the loan that has been paid off.
 * Used for the graphical indicator in the Installment Details.
 */
export const calculateProgressPercentage = (amountBorrowed, remainingBalance) => {
  if (!amountBorrowed || amountBorrowed <= 0) return 0;
  const paid = amountBorrowed - remainingBalance;
  return Number(((paid / amountBorrowed) * 100).toFixed(2));
};
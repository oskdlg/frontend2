// src/utils/generators.js
import { v4 as uuidv4 } from 'uuid';

/**
 * Extracts uppercase initials from a person's full name.
 * e.g., "David Jonathan Pasumbal" -> "DJP"
 */
export const getInitials = (name) => {
  if (!name) return '';
  return name
    .trim()
    .split(/\s+/)
    .map((word) => word[0].toUpperCase())
    .join('');
};

/**
 * Generates a unique Reference ID.
 * Format: [Borrower Initials/Group Segment]-[Lender Initials]-[Short UUID]
 */
export const generateReferenceId = (borrowerName, lenderName, isGroup = false) => {
  let borrowerSegment = '';

  if (isGroup) {
    // For groups, remove spaces/special chars and take up to the first 4 characters
    borrowerSegment = borrowerName
      .replace(/[^a-zA-Z0-9]/g, '')
      .substring(0, 4)
      .toUpperCase();
  } else {
    borrowerSegment = getInitials(borrowerName);
  }

  const lenderSegment = getInitials(lenderName);
  
  // Grab the first 4 characters of a UUID to ensure the Ref ID is always unique
  const uniqueId = uuidv4().split('-')[0].substring(0, 4).toUpperCase();

  return `${borrowerSegment}-${lenderSegment}-${uniqueId}`;
};

/**
 * Generates a standard UUID for the internal Entry ID.
 */
export const generateEntryId = () => {
  return uuidv4();
};
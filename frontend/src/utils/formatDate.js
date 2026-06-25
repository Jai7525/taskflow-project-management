/**
 * Formats a date string into a user-friendly format (e.g. Jun 25, 2026)
 * @param {string|Date} dateVal 
 * @returns {string}
 */
export const formatDate = (dateVal) => {
  if (!dateVal) return '';
  const date = new Date(dateVal);
  if (isNaN(date.getTime())) return '';
  
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

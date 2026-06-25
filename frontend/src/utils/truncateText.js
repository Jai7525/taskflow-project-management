/**
 * Truncates text to a specified maximum length and appends an ellipsis
 * @param {string} text 
 * @param {number} maxLength 
 * @returns {string}
 */
export const truncateText = (text, maxLength = 60) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

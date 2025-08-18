// Date formatting utilities

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const MONTHS_FULL = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/**
 * Format date as "MMM d, yyyy"
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
export function formatDate(date) {
  if (!date) return 'Not set';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return 'Invalid date';
  
  const month = MONTHS[d.getMonth()];
  const day = d.getDate();
  const year = d.getFullYear();
  
  return `${month} ${day}, ${year}`;
}

/**
 * Format date with time as "MMM d, yyyy h:mm a"
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string with time
 */
export function formatDateTime(date) {
  if (!date) return 'Not set';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return 'Invalid date';
  
  const dateStr = formatDate(d);
  const hours = d.getHours();
  const minutes = d.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, '0');
  
  return `${dateStr} ${displayHours}:${displayMinutes} ${ampm}`;
}

/**
 * Format date for input fields (yyyy-MM-dd)
 * @param {Date|string} date - Date to format
 * @returns {string} Date string in yyyy-MM-dd format
 */
export function formatDateForInput(date) {
  if (!date) return '';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';
  
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

/**
 * Get relative time string (e.g., "2 days ago", "in 3 weeks")
 * @param {Date|string} date - Date to compare
 * @returns {string} Relative time string
 */
export function getRelativeTime(date) {
  if (!date) return '';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';
  
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const absDays = Math.abs(diffDays);
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  
  if (absDays < 7) {
    return diffDays > 0 ? `in ${absDays} days` : `${absDays} days ago`;
  }
  
  const weeks = Math.floor(absDays / 7);
  if (weeks < 4) {
    return diffDays > 0 ? `in ${weeks} week${weeks > 1 ? 's' : ''}` : `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  }
  
  const months = Math.floor(absDays / 30);
  if (months < 12) {
    return diffDays > 0 ? `in ${months} month${months > 1 ? 's' : ''}` : `${months} month${months > 1 ? 's' : ''} ago`;
  }
  
  const years = Math.floor(absDays / 365);
  return diffDays > 0 ? `in ${years} year${years > 1 ? 's' : ''}` : `${years} year${years > 1 ? 's' : ''} ago`;
}

/**
 * Check if date is in the past
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if date is in the past
 */
export function isPastDate(date) {
  if (!date) return false;
  
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return false;
  
  return d.getTime() < new Date().getTime();
}

/**
 * Get days until date
 * @param {Date|string} date - Target date
 * @returns {number} Number of days until date (negative if past)
 */
export function getDaysUntil(date) {
  if (!date) return 0;
  
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return 0;
  
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Get current timestamp
 * @returns {string} Current timestamp in readable format
 */
export function getCurrentTimestamp() {
  return formatDateTime(new Date());
}
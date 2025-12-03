// utils/helpers.js - Utility helper functions

// Format date to readable string
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return date.toLocaleDateString('en-US', options);
};

// Format date to short format - FIXED for timezone issues
export const formatDateShort = (dateString) => {
  if (!dateString) return 'N/A';
  
  // Handle date-only strings (YYYY-MM-DD) without timezone conversion
  if (typeof dateString === 'string' && dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const [year, month, day] = dateString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }
  
  const date = new Date(dateString);
  date.setTime(date.getTime() + 24 * 60 * 60 * 1000); // add 24 hours

  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

// Format time only - FIXED for TIME data type
export const formatTime = (timeString) => {
  if (!timeString) return 'N/A';
  
  // Handle TIME format from database (HH:MM:SS or HH:MM)
  if (typeof timeString === 'string' && timeString.match(/^\d{2}:\d{2}(:\d{2})?$/)) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const min = minutes;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${min} ${ampm}`;
  }
  
  // Handle full datetime
  const date = new Date(timeString);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};


// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Get role badge color
export const getRoleBadgeColor = (role) => {
  const colors = {
    admin: 'primary',
    doctor: 'success',
    patient: 'info'
  };
  return colors[role] || 'secondary';
};

// Get status badge color
export const getStatusBadgeColor = (status) => {
  const colors = {
    active: 'success',
    inactive: 'secondary',
    pending: 'warning',
    scheduled: 'primary',
    completed: 'success',
    cancelled: 'danger'
  };
  return colors[status] || 'secondary';
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number (US format)
export const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone);
};

// Generate random ID (for temporary use)
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// Truncate text
export const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

// Get initials from name
export const getInitials = (firstName, lastName) => {
  if (!firstName && !lastName) return '?';
  const first = firstName ? firstName.charAt(0).toUpperCase() : '';
  const last = lastName ? lastName.charAt(0).toUpperCase() : '';
  return first + last;
};

// Calculate age from date of birth
export const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return null;
  
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

// Sort array by property
export const sortByProperty = (array, property, order = 'asc') => {
  return [...array].sort((a, b) => {
    if (order === 'asc') {
      return a[property] > b[property] ? 1 : -1;
    } else {
      return a[property] < b[property] ? 1 : -1;
    }
  });
};

// Filter array by search term
export const filterBySearch = (array, searchTerm, properties) => {
  if (!searchTerm) return array;
  
  const term = searchTerm.toLowerCase();
  
  return array.filter(item => {
    return properties.some(prop => {
      const value = item[prop];
      return value && value.toString().toLowerCase().includes(term);
    });
  });
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Handle API error messages
export const getErrorMessage = (error) => {
  if (error.response) {
    // Server responded with error
    return error.response.data.message || 'An error occurred';
  } else if (error.request) {
    // Request made but no response
    return 'Unable to connect to server';
  } else {
    // Something else happened
    return error.message || 'An unexpected error occurred';
  }
};

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

// Check if date is in past
export const isPastDate = (dateString) => {
  if (!dateString) return false;
  return new Date(dateString) < new Date();
};

// Check if date is today
export const isToday = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

// Get greeting based on time
export const getTimeGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
};

// Export all helpers
export default {
  formatDate,
  formatDateShort,
  formatTime,
  capitalize,
  getRoleBadgeColor,
  getStatusBadgeColor,
  isValidEmail,
  isValidPhone,
  generateId,
  truncateText,
  getInitials,
  calculateAge,
  sortByProperty,
  filterBySearch,
  debounce,
  getErrorMessage,
  formatCurrency,
  isPastDate,
  isToday,
  getTimeGreeting
};
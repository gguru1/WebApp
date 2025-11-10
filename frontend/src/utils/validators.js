// utils/validators.js - Form validation utilities

// Validate email format
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const validatePassword = (password) => {
  // At least 6 characters
  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters' };
  }
  return { valid: true, message: '' };
};

// Validate phone number
export const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone);
};

// Validate required field
export const validateRequired = (value, fieldName) => {
  if (!value || value.toString().trim() === '') {
    return { valid: false, message: `${fieldName} is required` };
  }
  return { valid: true, message: '' };
};

// Validate date
export const validateDate = (date) => {
  const dateObj = new Date(date);
  return !isNaN(dateObj.getTime());
};

// Validate future date
export const validateFutureDate = (date) => {
  const dateObj = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return dateObj >= today;
};

// Validate time format (HH:MM)
export const validateTime = (time) => {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

// Validate user form
export const validateUserForm = (formData) => {
  const errors = {};

  // First Name
  const firstNameValidation = validateRequired(formData.firstName, 'First Name');
  if (!firstNameValidation.valid) {
    errors.firstName = firstNameValidation.message;
  }

  // Last Name
  const lastNameValidation = validateRequired(formData.lastName, 'Last Name');
  if (!lastNameValidation.valid) {
    errors.lastName = lastNameValidation.message;
  }

  // Username
  const usernameValidation = validateRequired(formData.username, 'Username');
  if (!usernameValidation.valid) {
    errors.username = usernameValidation.message;
  } else if (formData.username.length < 3) {
    errors.username = 'Username must be at least 3 characters';
  }

  // Email
  const emailValidation = validateRequired(formData.email, 'Email');
  if (!emailValidation.valid) {
    errors.email = emailValidation.message;
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Invalid email format';
  }

  // Password (only for new users)
  if (formData.password !== undefined) {
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.valid) {
      errors.password = passwordValidation.message;
    }
  }

  // Role
  const roleValidation = validateRequired(formData.role, 'Role');
  if (!roleValidation.valid) {
    errors.role = roleValidation.message;
  } else if (!['admin', 'doctor', 'patient'].includes(formData.role)) {
    errors.role = 'Invalid role selected';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Validate appointment form
export const validateAppointmentForm = (formData) => {
  const errors = {};

  // Patient
  const patientValidation = validateRequired(formData.patientId, 'Patient');
  if (!patientValidation.valid) {
    errors.patientId = patientValidation.message;
  }

  // Doctor
  const doctorValidation = validateRequired(formData.doctorId, 'Doctor');
  if (!doctorValidation.valid) {
    errors.doctorId = doctorValidation.message;
  }

  // Date
  const dateValidation = validateRequired(formData.date, 'Date');
  if (!dateValidation.valid) {
    errors.date = dateValidation.message;
  } else if (!validateDate(formData.date)) {
    errors.date = 'Invalid date format';
  } else if (!validateFutureDate(formData.date)) {
    errors.date = 'Date must be in the future';
  }

  // Start Time
  const startTimeValidation = validateRequired(formData.startTime, 'Start Time');
  if (!startTimeValidation.valid) {
    errors.startTime = startTimeValidation.message;
  } else if (!validateTime(formData.startTime)) {
    errors.startTime = 'Invalid time format (HH:MM)';
  }

  // End Time
  const endTimeValidation = validateRequired(formData.endTime, 'End Time');
  if (!endTimeValidation.valid) {
    errors.endTime = endTimeValidation.message;
  } else if (!validateTime(formData.endTime)) {
    errors.endTime = 'Invalid time format (HH:MM)';
  } else if (formData.startTime && formData.endTime <= formData.startTime) {
    errors.endTime = 'End time must be after start time';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Validate password change form
export const validatePasswordChange = (formData) => {
  const errors = {};

  // Current Password
  const currentPasswordValidation = validateRequired(formData.currentPassword, 'Current Password');
  if (!currentPasswordValidation.valid) {
    errors.currentPassword = currentPasswordValidation.message;
  }

  // New Password
  const newPasswordValidation = validatePassword(formData.newPassword);
  if (!newPasswordValidation.valid) {
    errors.newPassword = newPasswordValidation.message;
  }

  // Confirm Password
  const confirmPasswordValidation = validateRequired(formData.confirmPassword, 'Confirm Password');
  if (!confirmPasswordValidation.valid) {
    errors.confirmPassword = confirmPasswordValidation.message;
  } else if (formData.newPassword !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  // Check if new password is different from current
  if (formData.currentPassword && formData.newPassword && 
      formData.currentPassword === formData.newPassword) {
    errors.newPassword = 'New password must be different from current password';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export default {
  validateEmail,
  validatePassword,
  validatePhone,
  validateRequired,
  validateDate,
  validateFutureDate,
  validateTime,
  validateUserForm,
  validateAppointmentForm,
  validatePasswordChange
};
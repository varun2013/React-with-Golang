import { InputField } from "../../types/formInput.type";

export const validateField = (
  name: string,
  value: string,
  field: InputField,
  state: any
): string => {
  if (field.required && !value) {
    return `${field.label} is required.`;
  }

  // Select field validation
  if (field.type === "select") {
    if (field.required && (!value || value === "")) {
      return `Please select a ${field.label.toLowerCase()}`;
    }
  }

  // Name validation
  if (value && field?.validationRules?.type === "nameWithSpace") {
    // Allows one space between words
    const nameWithSpaceRegex = /^[A-Za-z]+(?:\s[A-Za-z]+)?$/;

    // Trim the value to remove leading and trailing spaces
    const trimmedValue = value.trim();

    if (!nameWithSpaceRegex.test(trimmedValue)) {
      return `${field.label}  can have letters and one optional space between words.`;
    }

    // Ensure no multiple spaces
    if (value !== trimmedValue || value.includes("  ")) {
      return `${field.label}  cannot have multiple or leading/trailing spaces.`;
    }
  }

  if (value && field?.validationRules?.type === "nameWithoutSpace") {
    // Allows only letters, no spaces
    const nameWithoutSpaceRegex = /^[A-Za-z]+$/;

    // Trim the value to remove any potential spaces
    const trimmedValue = value.trim();

    if (!nameWithoutSpaceRegex.test(trimmedValue)) {
      return `${field.label}  must contain only letters, no spaces allowed.`;
    }

    // Ensure absolutely no spaces
    if (value.includes(" ")) {
      return `${field.label}  cannot contain any spaces.`;
    }
  }

  if (value && field?.validationRules?.type === "email") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return "Please enter a valid email address.";
    }
  }

  // Password validation with separate checks for each condition
  if (value && field?.validationRules?.type === "password") {
    // Check if password is between 8 and 20 characters long
    if (value.length < 8 || value.length > 20) {
      return "Password must be between 8 and 20 characters.";
    }

    // Check for at least one lowercase letter
    if (!/[a-z]/.test(value)) {
      return "Password must contain at least one lowercase letter.";
    }

    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(value)) {
      return "Password must contain at least one uppercase letter.";
    }

    // Check for at least one digit
    if (!/\d/.test(value)) {
      return "Password must contain at least one number.";
    }

    // Check for at least one special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      return "Password must contain at least one special character.";
    }

    // New condition: Check if new password is different from old password
    if (field.name === "new_password") {
      const oldPassword = state?.old_password || "";
      if (value === oldPassword) {
        return "New password cannot be the same as the old password.";
      }
    }

    // New condition: Check if confirm password matches new password
    if (field.name === "confirm_password") {
      const newPassword = state?.new_password || "";
      if (value !== newPassword) {
        return "Confirm password must match the new password.";
      }
    }
  }

  if (
    value &&
    field?.validationRules?.maxLength &&
    value.length > field?.validationRules?.maxLength
  ) {
    return `${field.label} cannot exceed ${field?.validationRules?.maxLength} characters.`;
  }

  if (
    value &&
    field?.validationRules?.minLength &&
    value.length < field?.validationRules?.minLength
  ) {
    return `${field.label} must be at least ${field?.validationRules?.minLength} characters long.`;
  }

  // Textarea validation
  if (field.type === "textarea") {
    if (field.required && (!value || value.trim() === "")) {
      return `${field.label} is required`;
    }

    if (field.minLength && value.length < field.minLength) {
      return `${field.label} must be at least ${field.minLength} characters`;
    }

    if (field.maxLength && value.length > field.maxLength) {
      return `${field.label} must not exceed ${field.maxLength} characters`;
    }
  }

  // Number validation
  if (value && field?.validationRules?.type === "number") {
    const numberValue = parseFloat(value);

    // Ensure the value is a valid number
    if (isNaN(numberValue)) {
      return `${field.label} must be a valid number.`;
    }

    // Ensure the value is not negative
    if (numberValue < 0) {
      return `${field.label} cannot be negative.`;
    }

    // Ensure the value is within the range
    if (numberValue < 1 || numberValue > 99999) {
      return `${field.label} must be between 1 and 99999.`;
    }
  }

  // Number validation
  if (value && field?.validationRules?.type === "onlyNumber") {
    const numberValue = parseFloat(value);

    // Ensure the value is a valid number
    if (isNaN(numberValue)) {
      return `${field.label} must be a valid number.`;
    }

    // Ensure the value is not negative
    if (numberValue < 0) {
      return `${field.label} cannot be negative.`;
    }

    // Ensure the value is within the range
    if (numberValue < 1 || numberValue > 99999) {
      return `${field.label} must be between 1 and 99999.`;
    }
  }


    // age validation
    if (value && field?.validationRules?.type === "age") {
      const numberValue = parseFloat(value);
  
      // Ensure the value is a valid number
      if (isNaN(numberValue)) {
        return `${field.label} must be a valid number.`;
      }
  
      // Ensure the age is not negative
      if (numberValue < 0) {
        return `${field.label} cannot be negative.`;
      }
  
      // Ensure the age is valid and at least 18
      if (numberValue < 18) {
        return `${field.label} must be at least 18.`;
      }
      
      // Ensure the value is within the range
      if (numberValue > 99999) {
        return `${field.label} must not exceed 99999.`;
      }
    }

  if (value && field?.validationRules?.type === "clinicOrderQuantity") {
    const numberValue = parseFloat(value);

    // Ensure the value is a valid number
    if (isNaN(numberValue)) {
      return `${field.label} must be a valid number.`;
    }

    // Ensure the value is not negative
    if (numberValue < 0) {
      return `${field.label} cannot be negative.`;
    }

    if (numberValue < 25) {
      return `${field.label} cannot be less then 25.`;
    }

    // Ensure the value is within the range
    if (numberValue < 1 || numberValue > 99999) {
      return `${field.label} must be between 1 and 99999.`;
    }
  }

  // Phone number validation
  if (value && field?.validationRules?.type === "phoneNumber") {
    const phoneNumberRegex = /^\d+$/;

    // Check if the value contains only numbers
    if (!phoneNumberRegex.test(value)) {
      return `${field.label} must contain only numbers.`;
    }

    // Add range or length restriction (optional, if needed)
    if (value.length < 10 || value.length > 15) {
      return `${field.label} must be between 10 to 15 digits long.`;
    }
  }

  if (value && field?.validationRules?.type === "alphanumericWithSpace") {
    // Allows letters, numbers, and spaces, but no special characters
    const alphanumericWithSpaceRegex = /^[A-Za-z0-9\s]+$/;

    // Trim the value to remove leading and trailing spaces
    const trimmedValue = value.trim();

    if (!alphanumericWithSpaceRegex.test(trimmedValue)) {
      return `${field.label} must contain only letters, numbers, and spaces.`;
    }

    // Ensure no multiple spaces
    if (value !== trimmedValue || value.includes("  ")) {
      return `${field.label} cannot have multiple or leading/trailing spaces.`;
    }
  }

  if (value && field?.validationRules?.type === "alphanumericWithoutSpace") {
    // Allows letters, numbers, and spaces, but no special characters
    const alphanumericWithSpaceRegex = /^[A-Za-z0-9]+$/;

    // Trim the value to remove leading and trailing spaces
    const trimmedValue = value.trim();

    if (!alphanumericWithSpaceRegex.test(trimmedValue)) {
      return `${field.label} must contain only letters, numbers.`;
    }

    // Ensure no multiple spaces
    if (value !== trimmedValue || value.includes("  ")) {
      return `${field.label} cannot have multiple or leading/trailing spaces.`;
    }
  }

  if (value && field?.validationRules?.type === "nhi_number") {
    // Allows letters, numbers, and spaces, but no special characters
    const alphanumericWithSpaceRegex = /^[A-Za-z0-9-]+$/;

    // Trim the value to remove leading and trailing spaces
    const trimmedValue = value.trim();

    if (!alphanumericWithSpaceRegex.test(trimmedValue)) {
      return `${field.label} must contain only letters, numbers and may include '-'.`;
    }

    // Ensure no multiple spaces
    if (value !== trimmedValue || value.includes("  ")) {
      return `${field.label} cannot have multiple or leading/trailing spaces.`;
    }
  }

  return ""; // No error
};

export const validateForm = <T extends Record<string, string>>(
  state: T,
  fields: InputField[]
): Record<string, string> => {
  const errors: Record<string, string> = {};

  fields.forEach((field) => {
    const value = state[field.name] || "";
    const errorMessage = validateField(field.name, value, field, state);

    if (errorMessage) {
      errors[field.name] = errorMessage;
    }
  });

  return errors;
};

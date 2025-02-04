import React from "react";
import { InputField } from "../../../types/formInput.type";
import { validateField } from "../../../utils/validation/validationUtils";

export const handleFormChange = (
  e: React.ChangeEvent<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  >,
  field: InputField,
  setState: React.Dispatch<React.SetStateAction<any>>,
  setErrorState: React.Dispatch<React.SetStateAction<any>>,
  state: any
) => {
  const { name, value } = e.target;

  if (field.maxLength && value.length > field.maxLength) {
    return; // Prevent user input beyond max length
  }

  setState((prevState: any) => ({ ...prevState, [name]: value }));

  const errorMessage = validateField(name, value, field, state);
  setErrorState((prevErrorState: any) => ({
    ...prevErrorState,
    [name]: errorMessage,
  }));
};

export const handleFormBlur = (
  e: React.FocusEvent<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  >,
  field: InputField,
  setErrorState: React.Dispatch<React.SetStateAction<any>>,
  state: any
) => {
  const { name, value } = e.target;

  const errorMessage = validateField(name, value, field, state);
  setErrorState((prevErrorState: any) => ({
    ...prevErrorState,
    [name]: errorMessage,
  }));
};

export const handleFormKeyDown = (
  e: React.KeyboardEvent<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  >,
  field: InputField,
  onSubmit?: () => void
) => {
  const { value } = e.currentTarget;
  // Handle Shift + Enter for new line in textarea
  if (field.type === "textarea" && e.shiftKey && e.key === "Enter") {
    return; // Allow default behavior of adding a new line
  }

  // Handle Enter key for form submission
  if (e?.key === "Enter" && onSubmit) {
    e.preventDefault(); // Prevent default form submission
    onSubmit(); // Call the provided submit function
    return;
  }

  if (value.trim().length === 0 && e?.code === "Space") {
    e.preventDefault();
  }

  // Max length restriction
  if (
    field.maxLength &&
    value.length >= field.maxLength &&
    e?.key !== "Backspace" &&
    e?.key !== "Delete"
  ) {
    e.preventDefault(); // Prevent further input
  }

  // Input validation based on validation rules
  if (field.validationRules?.type === "nameWithSpace") {
    // Only allow letters and a single space
    const allowedPattern = /^[A-Za-z\s]$/;

    // Special keys to always allow
    const specialKeysToAllow = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
      "Enter",
    ];

    if (!specialKeysToAllow.includes(e.key)) {
      // If current input is a space, check for existing space
      if (e.key === " ") {
        const hasSpace = value.includes(" ");
        if (hasSpace) {
          e.preventDefault(); // Prevent multiple spaces
          return;
        }
      }

      // Check if the key matches allowed pattern
      if (!allowedPattern.test(e.key)) {
        e.preventDefault(); // Prevent input of disallowed characters
      }
    }
  } else if (field.validationRules?.type === "nameWithoutSpace") {
    // Only allow letters
    const allowedPattern = /^[A-Za-z]$/;

    // Special keys to always allow
    const specialKeysToAllow = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
      "Enter",
    ];

    if (!specialKeysToAllow.includes(e.key)) {
      // Check if the key matches allowed pattern
      if (!allowedPattern.test(e.key)) {
        e.preventDefault(); // Prevent input of disallowed characters
      }
    }
  }

  // Input validation for `type: number`
  else if (field.validationRules?.type === "number") {
    const specialKeysToAllow = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
      "Enter",
    ];

    if (!specialKeysToAllow.includes(e.key)) {
      // Only allow digits and a single dot
      if (!/^\d$/.test(e.key) && e.key !== ".") {
        e.preventDefault();
        return;
      }

      // Prevent multiple dots
      if (e.key === "." && value.includes(".")) {
        e.preventDefault();
        return;
      }

      // Prevent negative sign
      if (e.key === "-") {
        e.preventDefault();
        return;
      }
    }

    // Check range validity
    const newValue = value + e.key;
    const numericValue = parseFloat(newValue);

    if (numericValue > 99999 || numericValue < 1) {
      e.preventDefault();
    }
  }

  // Input validation for `type: number`
  else if (field.validationRules?.type === "onlyNumber") {
    const specialKeysToAllow = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
      "Enter",
    ];

    if (!specialKeysToAllow.includes(e.key)) {
      // Only allow digits and a single dot
      if (!/^\d$/.test(e.key)) {
        e.preventDefault();
        return;
      }

      // Prevent multiple dots
      if (e.key === ".") {
        e.preventDefault();
        return;
      }

      // Prevent negative sign
      if (e.key === "-") {
        e.preventDefault();
        return;
      }
    }

    // Check range validity
    const newValue = value + e.key;
    const numericValue = parseFloat(newValue);

    if (numericValue > 99999 || numericValue < 1) {
      e.preventDefault();
    }
  }

    // Input validation for `type: number`
    else if (field.validationRules?.type === "age") {
      const specialKeysToAllow = [
        "Backspace",
        "Delete",
        "ArrowLeft",
        "ArrowRight",
        "Tab",
        "Enter",
      ];
  
      if (!specialKeysToAllow.includes(e.key)) {
        // Only allow digits and a single dot
        if (!/^\d$/.test(e.key)) {
          e.preventDefault();
          return;
        }
  
        // Prevent multiple dots
        if (e.key === ".") {
          e.preventDefault();
          return;
        }
  
        // Prevent negative sign
        if (e.key === "-") {
          e.preventDefault();
          return;
        }
      }
  
      // Check range validity
      const newValue = value + e.key;
      const numericValue = parseFloat(newValue);
  
      if (numericValue > 99999 || numericValue < 1) {
        e.preventDefault();
      }
    }

  // Input validation for `type: phoneNumber`
  else if (field.validationRules?.type === "phoneNumber") {
    const specialKeysToAllow = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
      "Enter",
    ];

    if (!specialKeysToAllow.includes(e.key)) {
      // Only allow numeric digits
      if (!/^\d$/.test(e.key)) {
        e.preventDefault(); // Prevent any non-numeric input
        return;
      }
    }
  } else if (field.validationRules?.type === "alphanumericWithSpace") {
    const allowedPattern = /^[A-Za-z0-9\s]$/;

    const specialKeysToAllow = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
      "Enter",
    ];

    if (!specialKeysToAllow.includes(e.key)) {
      // If current input is a space, check for existing space
      if (e.key === " ") {
        const hasSpace = value.includes(" ");
        if (hasSpace) {
          e.preventDefault(); // Prevent multiple spaces
          return;
        }
      }

      // Check if the key matches allowed pattern
      if (!allowedPattern.test(e.key)) {
        e.preventDefault(); // Prevent input of disallowed characters
      }
    }
  }
  else if (field?.validationRules?.type === "nhi_number") {
    const allowedPattern = /^[A-Za-z0-9-\s]$/;

    const specialKeysToAllow = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
      "Enter",
    ];

    if (!specialKeysToAllow.includes(e.key)) {
      // If current input is a space, check for existing space
      if (e.key === " ") {
        const hasSpace = value.includes(" ");
        if (hasSpace) {
          e.preventDefault(); // Prevent multiple spaces
          return;
        }
      }

      // Check if the key matches allowed pattern
      if (!allowedPattern.test(e.key)) {
        e.preventDefault(); // Prevent input of disallowed characters
      }
    }
  }
};

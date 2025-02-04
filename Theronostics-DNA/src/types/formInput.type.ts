export type ValidationRule = {
  type: string;
  maxLength?: number;
  minLength?: number;
  pattern?: RegExp; // For custom regex validations
  required?: boolean;
  customMessage?: string; // Optional custom error message
  options?: string[];
};

export type InputField = {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  required?: boolean;
  favImage?: any;
  image?: string;
  maxLength?: number;
  minLength?: number;
  colProps?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  passwordTooltipShow?: boolean;
  validationRules?: ValidationRule;
  options?: Array<{ value: string; label: string }>;
  disabled?: boolean;
};

export type CommonFormPropsInterface = {
  state: Record<string, any>;
  setState: any;
  errorState: Record<string, string>;
  setErrorState: any;
  fields: InputField[];
  onSubmit?: () => void;
};

export type CommonInputProps = {
  field: InputField;
  value: any;
  onChange?: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  onBlur?: (
    e: React.FocusEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  onKeyDown?: (
    e: React.KeyboardEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  error?: string;
};

// Extend the existing type or create a new interface for radio-specific props
export interface CommonRadioProps extends CommonInputProps {
  options: Array<{
    label: string;
    value: string | number;
    disabled?: boolean;
  }>;
  defaultValue?: string | number;
}

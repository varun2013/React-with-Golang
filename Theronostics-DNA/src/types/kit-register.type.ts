import { ValidationRule } from "./formInput.type";

export interface BarcodeFormState {
  barcode_number: string;
  isScannedData: boolean;
}

export interface BarcodeErrorState {
  barcode_number: string;
}

export interface CustomerOrderData {
  barcode_number: string;
  order_id: number;
  order_number: string;
  product_name: string;
  product_description: string;
  product_image: string;
  product_price: number;
  product_gst_price: number;
  product_discount: number;
  quantity: number;
  customer_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  country: string;
  street_address: string;
  town_city: string;
  region: string;
  postcode: string;
  clinic_id: string;
}

export interface BarcodeScannerProps {
  onScan: (result: any) => void;
  onCancel: () => void;
}

export interface OrderDetailsProps {
  orderData: CustomerOrderData;
  setPatientFormShow: any;
  patientFormShow: boolean;
}

export interface FormValues {
  first_name: string;
  last_name: string;
  age: string;
  gender: "male" | "female" | "other";
}

export interface FormErrorValues {
  first_name: string;
  last_name: string;
  age: string;
  gender: string;
}

export interface FormField {
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
  defaultValue?: string;
}

export interface PatientDetailsFormProps {
  isOrderSelf: boolean;
  customerOrderData: CustomerOrderData;
  fields: FormField[];
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<FormValues>>;
  errFormValues: any;
  setErrFormValues: React.Dispatch<React.SetStateAction<FormErrorValues>>;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
  isFormValid: () => boolean;
  setPatientFormShow: any;
  patientFormShow: boolean;
  isAgree: boolean;
  setIsAgree: React.Dispatch<React.SetStateAction<boolean>>;
  isClinicInform: boolean;
  setIsClinicInform: any;

}

export interface FetchKitDetailsParams {
  currentPage: number;
  sort: string;
  sortColumn: string;
  searchText: string;
  type: string;
  perPage: number;
}

export interface Kit {
  id: string;
  quantity: number;
  type: string;
  supplier_name: string;
  supplier_contact_number: string;
  supplier_address?: string;
  created_at: string;
  created_by: {
    first_name: string;
    last_name: string;
  };
}

export interface InventoryFormValues {
  type: string;
  quantity: string;
  supplier_name: string;
  supplier_contact_number: string;
  supplier_address?: string;
}

export interface FormField {
  name: string;
  label: string;
  type: string;
  placeholder: string;
  required?: boolean;
  maxLength?: number;
  validationRules: {
    type: string;
    maxLength?: number;
    minLength?: number;
    required?: boolean;
  };
  options?: Array<{ label: string; value: string }>;
}
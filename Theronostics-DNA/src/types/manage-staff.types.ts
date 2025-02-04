export interface IFetchStaffDetailsParams {
  currentPage: number;
  sort: string;
  sortColumn: string;
  searchText: string;
  status: string;
  perPage: number;
}

export interface IStaffRecord {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  active_status: boolean;
  created_at: string;
}

export interface IManageStaffState {
  records: IStaffRecord[];
  perPage: number;
  totalRecords: number;
  page: number;
  totalPages: number;
  sort: string;
  sortColumn: string;
  searchText: string;
  status: string;
}

export interface IStaffFormField {
  name: string;
  label: string;
  type: string;
  placeholder: string;
  required: boolean;
  favImage?: any;
  image?: string;
  maxLength: number;
  minLength?: number;
  validationRules: {
    type: string;
    maxLength: number;
    minLength?: number;
    required: boolean;
  };
  passwordTooltipShow?: boolean;
  colProps?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

export interface IStaffFormProps {
  formState: Record<string, string>;
  setFormState: (state: Record<string, string>) => void;
  errorState: Record<string, string>;
  setErrorState: (state: Record<string, string>) => void;
  onSubmit: () => void;
  isFormValid: () => boolean;
  fields: IStaffFormField[];
  dispatch: any;
  isEditModal: boolean;
  onCancel?: () => void;
}

export interface IStaffListActions {
  handleSearchInputChange: (value: string) => void;
  handleStatusFilter: (value: "all" | "active" | "inactive") => void;
  handlePerPageFilter: (value: number) => void;
  handleStatusChange: (userId: string, newStatus: boolean) => void;
  handleSort: (column: string) => void;
  handlePageChange: (selectedItem: { selected: number }) => void;
  handleModalOpen: (type: string, data: any) => void;
  handleDelete: (user_id: string) => void;
  handleSubmit: () => void;
  handleUpdateSubmit: () => void;
  handleChangePassword: (user_id: string) => void;
}

export interface IStaffViewProps {
  selectedData: IStaffRecord;
  onDelete: () => void;
  onEdit: () => void;
  onClose: () => void;
}

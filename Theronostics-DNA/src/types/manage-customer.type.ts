export interface FetchCustomerDetailsParams {
  currentPage: number;
  sort: string;
  sortColumn: string;
  searchText: string;
  perPage: number;
}

export interface CustomerListTableProps {
  fetchAllCustomerDetails: (params: FetchCustomerDetailsParams) => void;
}
export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  country: string;
  created_at: string;
}

export interface FetchCustomerOrderDetailsParams {
  currentPage: number;
  sort: string;
  sortColumn: string;
  searchText: string;
  perPage: number;
}
export interface CustomerOrderListTableProps {
  fetchAllCustomerOrderDetails: (
    params: FetchCustomerOrderDetailsParams
  ) => void;
}

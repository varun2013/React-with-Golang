export interface FetchOrderDetailsParams {
  currentPage: number;
  sort: string;
  sortColumn: string;
  searchText: string;
  perPage: number;
  paymentStatus: string;
  orderStatus: string;
  isAssignBarcodeModalOpen?: any;
  isDispatchModalOpen?: any;
}
export interface OrderListTableProps {
  fetchAllOrderDetails: (params: FetchOrderDetailsParams) => void;
}
export interface Order {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  country: string;
  created_at: string;
}

export interface OrderStatus {
  id: string;
  customer_first_name: string;
  customer_last_name: string;
  created_at: string;
  order_status:
    | "pending"
    | "processing"
    | "cancelled"
    | "dispatched"
    | "shipped"
    | "delivered";
  payment_status: "Completed" | "Pending" | "Failed";
  quantity: number;
  product_name: string;
  product_price: number;
  product_gst_price: number;
  total_price: number;
  barcode_count: number;
  customer: {
    first_name: string;
    last_name: string;
    clinic_id: string;
  };
  payments: {
    invoices: {
      invoice_link: string;
    }[];
  }[];
}

export interface OrderListState {
  records: OrderStatus[];
  page: number;
  totalPages: number;
  sort: "asc" | "desc";
  sortColumn: string;
  searchText: string;
  perPage: number;
}

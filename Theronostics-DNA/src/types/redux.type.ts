// Define the shape of the auth state
export interface AuthState {
  user: any | null; // Replace 'any' with a more specific user type if available
}

export interface KeyPairInterface {
  [key: string]: any;
}

export interface SuccessMessageInterface {
  success: boolean;
  message: string;
  data: any;
}

export const GLOBAL_ACTIONS = {
  RESET_STATE: "GLOBAL/RESET_STATE",
  RESET_FILTER: "GLOBAL/RESET_FILTER",
} as const;

export interface LoaderInterface {
  loader: boolean;
  loaderText: string;
  showProgressBar: boolean;
  progress: number;
}

export interface ProgressBarPayload {
  showProgressBar: boolean;
  progress: number;
}

// Types
export type SortOrder = "asc" | "desc";

export interface CustomerRecord {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  country: string;
  street_address: string;
  town_city: string;
  region: string;
  postcode: string;
  created_at: string;
  orders: Array<{
    order_id: number;
    product_name: string;
    total_price: number;
    payment_status: string;
    quantity: number;
  }>;
}

export interface CustomerListResponse {
  page: number;
  per_page: number;
  sort: SortOrder;
  sort_column: string;
  search_text: string;
  total_records: number;
  total_pages: number;
  records: CustomerRecord[];
}

export interface ManageCustomerState {
  page: number;
  perPage: number;
  sort: SortOrder;
  sortColumn: string;
  searchText: string;
  totalRecords: number;
  totalPages: number;
  records: CustomerRecord[];
}

export interface ManageCustomerOrderState {
  page: number;
  perPage: number;
  sort: SortOrder;
  sortColumn: string;
  searchText: string;
  totalRecords: number;
  totalPages: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  country: string;
  address: string;
  townCity: string;
  region: string;
  postcode: string;
  createdAt: string;
  ClinicID: string;
  shippingCountry: string;
  shippingAddress: string;
  shippingTownCity: string;
  shippingRegion: string;
  shippingPostcode: string;
  records: any[];
}

export interface InventoryQuantity {
  bloodQuantity: number;
  salivaQuantity: number;
  combinedQuantity: number;
}

export interface ManageInventoryState {
  page: number;
  perPage: number;
  sort: SortOrder;
  sortColumn: string;
  searchText: string;
  totalRecords: number;
  totalPages: number;
  records: any[];
  type: string;
  quantity: InventoryQuantity;
}

export interface ManageOrderState {
  page: number;
  perPage: number;
  sort: SortOrder;
  sortColumn: string;
  searchText: string;
  totalRecords: number;
  totalPages: number;
  records: any[];
  paymentStatus: string;
  orderStatus: string;
  orderCounts: {
    dispatched: number;
    processing: number;
    pending: number;
    shipped: number;
    totalQunatity: number;
  };
}

export interface productState {
  productName: string;
  productDescription: string;
  productImage: string;
  productPrice: number;
  productGstPrice: number;
}

export type StatusType = "all" | "active" | "inactive";

export interface AdminUserRecord {
  // Define specific fields based on your data structure
  id: string;
  [key: string]: any;
}

export interface ManageStaffState {
  page: number;
  perPage: number;
  sort: SortOrder;
  sortColumn: string;
  searchText: string;
  status: StatusType;
  totalRecords: number;
  totalPages: number;
  records: AdminUserRecord[];
}

export interface ModalState {
  isOpen: boolean;
  modalType:
    | "add"
    | "edit"
    | "view"
    | "delete"
    | "changePassword"
    | "assignKit"
    | "orderStatusChange"
    | "viewBarcode"
    | "viewHeaderScanBarcode"
    | "receivedKitScan"
    | null;
  selectedData: any | null;
}

// Notification Interfaces
export interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
  username: string;
  metadata: any;
}

export interface LatestNotificationResponse {
  has_unread: boolean;
  latest_notifications: Notification[];
  unread_count: number;
}

export interface NotificationListResponse {
  page: number;
  per_page: number;
  sort: "asc" | "desc";
  sort_column: string;
  search_text: string;
  is_read: boolean | null;
  total_records: number;
  total_pages: number;
  records: Notification[];
  type: string;
  start_date: string;
  end_date: string;
}

// Updated Notification State Interface
export interface NotificationState {
  currentPage: number;
  itemsPerPage: number;
  sortDirection: "asc" | "desc";
  sortField: string;
  notificationType: string;
  searchQuery: string;
  readStatus: boolean | null;
  totalRecordCount: number;
  totalPageCount: number;
  notificationRecords: Notification[];
  latestNotifications: Notification[];
  hasUnreadNotifications: boolean;
  startDate: string | null;
  endDate: string | null;
  totalUnreadEmails: number;
}

export type SortDirection = "asc" | "desc";

export interface QuantityDiscountRecord {
  id: number;
  quantity: number;
  discount_percentage: number;
}

export interface QuantityDiscountListResponse {
  records: QuantityDiscountRecord[];
}

export interface ManageQuantityDiscountState {
  page: number;
  perPage: number;
  sort: string;
  sortColumn: string;
  totalRecords: number;
  totalPages: number;
  records: QuantityDiscountRecord[];
}

// TypeScript Interfaces for API response
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

export interface KitRegisterFechedRecord {
  id: number;
  patient_info: string;
  kit_status: string;
  created_at: string;
}

// Initial State Interface
export interface KitRegisterState {
  customerOrderData: CustomerOrderData | null;
  page: number;
  perPage: number;
  sort: string;
  sortColumn: string;
  searchText: string;
  totalRecords: number;
  totalPages: number;
  status: string;
  records: KitRegisterFechedRecord[];
}

export interface manageLabsState {
  
  records: any;
}

export interface KitRegisterListResponse {
  page: number;
  per_page: number;
  sort: "asc" | "desc";
  sort_column: string;
  search_text: string;
  status: string;
  total_records: number;
  total_pages: number;
  records: KitRegisterFechedRecord[];
}

export interface globalSearchState {
  response: any;
}

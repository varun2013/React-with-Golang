export interface IFetchPostOrdersDetailsParams {
  currentPage: number;
  sort: string;
  sortColumn: string;
  searchText: string;
  status: string;
  perPage: number;
}

export interface IPostOrderRecord {
  id: number;
  patient_first_name: string;
  patient_last_name: string;
  patient_age: string;
  patient_gender: string;
  patient_email: string;
  created_at: string;
  kit_status: string;
  reason: string;
  barcode_number: string;
  file_path: string;
  order_number: string;
  customer_email: string;
  customer_name: string;
}
export interface IPostOrderViewProps {
  selectedData: IPostOrderRecord;
}

export interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  className?: string;
  headerClassName?: string;
  render?: (value: any, item: any) => React.ReactNode;
}

export interface TableProps {
  columns: Column[];
  data: any[];
  sortColumn?: string;
  sortDirection?: string;
  onSort: (column: string) => void;
  onPageChange: (selectedItem: { selected: number }) => void;
  totalPages: number;
  currentPage: number;
  renderActions?: (item: any) => React.ReactNode;
  totalRecords : number;
}

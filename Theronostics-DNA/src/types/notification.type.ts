export interface LoadNotificationParams {
  currentPage: number;
  sort: string;
  sortColumn: string;
  searchText: string;
  isRead: boolean | null;
  perPage: number;
  type: string;
  startDate: string | null;
  endDate: string | null;
}

// Interfaces for type safety
export interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

export interface NotificationResponse {
  page: number;
  per_page: number;
  sort: string;
  sort_column: string;
  search_text: string;
  type: string;
  is_read: boolean | null;
  total_records: number;
  total_pages: number;
  records: Notification[];
}

export interface NotificationListProps {
  loadNotificationDetails: (params: {
    currentPage: number;
    sort: string;
    sortColumn: string;
    searchText: string;
    isRead: boolean | null;
    perPage: number;
    type: string;
    startDate: string | null;
    endDate: string | null;
  }) => void;
}

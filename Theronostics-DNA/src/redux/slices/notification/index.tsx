import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  KeyPairInterface,
  LatestNotificationResponse,
  Notification,
  NotificationListResponse,
  NotificationState,
  SortDirection,
  SuccessMessageInterface,
} from "../../../types/redux.type";
import { AppDispatch } from "../../store";
import flashMessage from "../../../utils/notifications/antdMessageUtils";
import { notificationServices } from "../../../services/endpoints/notification.api";
import { LOGIN_APP_URL } from "../../../constants/appUrl";
import { clearLocalStorageData } from "../../../utils/storage/localStorageUtils";

// Initial state
const initialNotificationState: NotificationState = {
  currentPage: 1,
  itemsPerPage: 10,
  sortDirection: "desc",
  sortField: "created_at",
  searchQuery: "",
  readStatus: null,
  totalRecordCount: 0,
  totalPageCount: 1,
  notificationType: "",
  notificationRecords: [],
  latestNotifications: [],
  hasUnreadNotifications: false,
  startDate: null,
  endDate: null,
  totalUnreadEmails: 0,
};

// Slice
const notificationSlice = createSlice({
  name: "notification",
  initialState: initialNotificationState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload;
    },
    setSortDirection: (state, action: PayloadAction<SortDirection>) => {
      state.sortDirection = action.payload;
    },
    setSortField: (state, action: PayloadAction<string>) => {
      state.sortField = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setReadStatus: (state, action: PayloadAction<boolean | null>) => {
      state.readStatus = action.payload;
    },
    setTotalRecordCount: (state, action: PayloadAction<number>) => {
      state.totalRecordCount = action.payload;
    },
    setTotalPageCount: (state, action: PayloadAction<number>) => {
      state.totalPageCount = action.payload;
    },
    setNotificationRecords: (state, action: PayloadAction<Notification[]>) => {
      state.notificationRecords = action.payload;
    },
    setNotificationType: (state, action: PayloadAction<string>) => {
      state.notificationType = action.payload;
    },
    setLatestNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.latestNotifications = action.payload;
    },
    setHasUnreadNotifications: (state, action: PayloadAction<boolean>) => {
      state.hasUnreadNotifications = action.payload;
    },
    setStartDate: (state, action: PayloadAction<string | null>) => {
      state.startDate = action.payload;
    },
    setEndDate: (state, action: PayloadAction<string | null>) => {
      state.endDate = action.payload;
    },
    resetNotificationState: (state) => {
      Object.assign(state, initialNotificationState);
    },
    setTotalUnreadEmails: (state, action: PayloadAction<number>) => {
      state.totalUnreadEmails = action.payload;
    },
  },
});

// Actions
export const {
  setCurrentPage,
  setItemsPerPage,
  setSortDirection,
  setSortField,
  setSearchQuery,
  setReadStatus,
  setTotalRecordCount,
  setTotalPageCount,
  setNotificationRecords,
  resetNotificationState,
  setNotificationType,
  setLatestNotifications,
  setHasUnreadNotifications,
  setStartDate,
  setEndDate,
  setTotalUnreadEmails,
} = notificationSlice.actions;

// Helper functions
const handleApiError = (error: unknown, dispatch: AppDispatch) => {
  console.error("API Error:", error);
  flashMessage("Internal Server Error", "error");
  dispatch(resetNotificationState());
};

const handleApiResponse = (
  response: SuccessMessageInterface,
  dispatch: AppDispatch,
  callback?: (res: SuccessMessageInterface) => void
) => {
  if (response.success) {
    flashMessage(response.message, "success");
  } else {
    flashMessage(response.message, "error");
  }

  if (callback) {
    callback(response);
  }
};

export const fetchNotificationList =
  (data: KeyPairInterface, callback?: (res: SuccessMessageInterface) => void) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await notificationServices.fetchAllNotifications(data);

      if (!response.success) {
        dispatch(resetNotificationState());
        flashMessage(response.message, "error");
        return;
      }

      const responseData = response.data as NotificationListResponse;
      if (!responseData) {
        dispatch(resetNotificationState());
        return;
      }

      // Update state with response data
      dispatch(setCurrentPage(responseData.page ?? 1));
      dispatch(setItemsPerPage(responseData.per_page ?? 10));
      dispatch(setSortDirection(responseData.sort ?? "desc"));
      dispatch(setSortField(responseData.sort_column ?? "created_at"));
      dispatch(setSearchQuery(responseData.search_text ?? ""));
      dispatch(setReadStatus(responseData.is_read ?? null));
      dispatch(setTotalRecordCount(responseData.total_records ?? 0));
      dispatch(setTotalPageCount(responseData.total_pages ?? 1));
      dispatch(setNotificationRecords(responseData.records ?? []));
      dispatch(setNotificationType(responseData.type ?? ""));
      dispatch(setStartDate(responseData?.start_date ?? null));
      dispatch(setEndDate(responseData?.end_date ?? null));

      // handleApiResponse(response, dispatch, callback);
    } catch (error) {
      handleApiError(error, dispatch);
    }
  };

export const fetchLatestNotificationList =
  (data: KeyPairInterface) => async (dispatch: AppDispatch) => {
    try {
      const response = await notificationServices.fetchLatestNotification(data);

      if (!response.success) {
        if (response.status_code === 401) {
          clearLocalStorageData("token");
          window.location.href = LOGIN_APP_URL;
        }
        dispatch(resetNotificationState());
        flashMessage(response.message, "error");
        return;
      }

      const responseData = response.data as LatestNotificationResponse;
      if (!responseData) {
        dispatch(resetNotificationState());
        return;
      }

      dispatch(setLatestNotifications(responseData.latest_notifications ?? []));
      dispatch(setHasUnreadNotifications(responseData.has_unread ?? false));
      dispatch(setTotalUnreadEmails(responseData.unread_count ?? 0));
    } catch (error) {
      handleApiError(error, dispatch);
    }
  };

export const markNotificationAsread =
  (
    data: KeyPairInterface,
    notificationId: string,
    callback?: (res: SuccessMessageInterface) => void
  ) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await notificationServices.markNotificationAsRead(
        data,
        notificationId
      );
      handleApiResponse(response, dispatch, callback);
    } catch (error) {
      handleApiError(error, dispatch);
    }
  };

export const markAllNotificationAsread =
  (data: KeyPairInterface, callback?: (res: SuccessMessageInterface) => void) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await notificationServices.markAllNotificationsAsRead(
        data
      );
      handleApiResponse(response, dispatch, callback);
    } catch (error) {
      handleApiError(error, dispatch);
    }
  };

export const deleteNotification =
  (data: KeyPairInterface, callback?: (res: SuccessMessageInterface) => void) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await notificationServices.deleteNotification(data);

      if (!response.success) {
        dispatch(resetNotificationState());
        flashMessage(response.message, "error");
        return;
      }

      handleApiResponse(response, dispatch, callback);
    } catch (error) {
      handleApiError(error, dispatch);
    }
  };

export const deleteSpecificNotification =
  (
    data: KeyPairInterface,
    notificationId: string,
    callback?: (res: SuccessMessageInterface) => void
  ) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await notificationServices.deleteSpecificNotification(
        data,
        notificationId
      );
      handleApiResponse(response, dispatch, callback);
    } catch (error) {
      handleApiError(error, dispatch);
    }
  };

export default notificationSlice.reducer;

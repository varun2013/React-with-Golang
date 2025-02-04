import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AdminUserRecord,
  KeyPairInterface,
  ManageStaffState,
  SortOrder,
  StatusType,
  SuccessMessageInterface,
} from "../../../types/redux.type";
import { AppDispatch } from "../../store";
import flashMessage from "../../../utils/notifications/antdMessageUtils";
import { staffManagementServices } from "../../../services/endpoints/staff-management.api";

// Initial state
const initialState: ManageStaffState = {
  page: 1,
  perPage: 10,
  sort: "desc",
  sortColumn: "created_at",
  searchText: "",
  status: "all",
  totalRecords: 0,
  totalPages: 1,
  records: [],
};

// Slice
const manageStaffSlice = createSlice({
  name: "manageStaff",
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setPerPage: (state, action: PayloadAction<number>) => {
      state.perPage = action.payload;
    },
    setSort: (state, action: PayloadAction<SortOrder>) => {
      state.sort = action.payload;
    },
    setSortColumn: (state, action: PayloadAction<string>) => {
      state.sortColumn = action.payload;
    },
    setSearchText: (state, action: PayloadAction<string>) => {
      state.searchText = action.payload;
    },
    setStatus: (state, action: PayloadAction<StatusType>) => {
      state.status = action.payload;
    },
    setTotalRecords: (state, action: PayloadAction<number>) => {
      state.totalRecords = action.payload;
    },
    setTotalPages: (state, action: PayloadAction<number>) => {
      state.totalPages = action.payload;
    },
    setRecords: (state, action: PayloadAction<AdminUserRecord[]>) => {
      state.records = action.payload;
    },
    resetState: (state) => {
      Object.assign(state, initialState);
    },
  },
});

// Actions
export const {
  setPage,
  setPerPage,
  setSort,
  setSortColumn,
  setSearchText,
  setStatus,
  setTotalRecords,
  setTotalPages,
  setRecords,
  resetState,
} = manageStaffSlice.actions;

// Helper functions
const handleApiError = (error: unknown, dispatch: AppDispatch) => {
  console.error("API Error:", error);
  flashMessage("Internal Server Error", "error");
  dispatch(resetState());
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

export const getAdminUserList =
  (data: KeyPairInterface) => async (dispatch: AppDispatch) => {
    try {
      const response = await staffManagementServices.fetchAdminUserList(data);

      if (!response.success) {
        dispatch(resetState());
        flashMessage(response.message, "error");
        return;
      }

      const responseData = response.data;
      if (!responseData) {
        dispatch(resetState());
        return;
      }

      // Update state with response data
      dispatch(setRecords(responseData.records ?? []));
      dispatch(setTotalPages(responseData.total_pages ?? 1));
      dispatch(setTotalRecords(responseData.total_records ?? 0));
      dispatch(setStatus(responseData.status ?? "all"));
      dispatch(setSearchText(responseData.search_text ?? ""));
      dispatch(setSortColumn(responseData.sort_column ?? "created_at"));
      dispatch(setSort(responseData.sort ?? "desc"));
      dispatch(setPerPage(responseData.per_page ?? 10));
      dispatch(setPage(responseData.page ?? 1));
  
    } catch (error) {
      handleApiError(error, dispatch);
    }
  };

export const createAdminUser =
  (data: KeyPairInterface, callback?: (res: SuccessMessageInterface) => void) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await staffManagementServices.createAdminUser(data);
      handleApiResponse(response, dispatch, callback);
    } catch (error) {
      handleApiError(error, dispatch);
    }
  };

export const updateAdminUserProfile =
  (
    data: KeyPairInterface,
    userId: string,
    callback?: (res: SuccessMessageInterface) => void
  ) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await staffManagementServices.updateAdminUserProfile(
        data,
        userId
      );
      handleApiResponse(response, dispatch, callback);
    } catch (error) {
      handleApiError(error, dispatch);
    }
  };

export const updateAdminUserPassword =
  (
    data: KeyPairInterface,
    userId: string,
    callback?: (res: SuccessMessageInterface) => void
  ) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await staffManagementServices.updateAdminUserPassword(
        data,
        userId
      );
      handleApiResponse(response, dispatch, callback);
    } catch (error) {
      handleApiError(error, dispatch);
    }
  };

export const updateAdminUserStatus =
  (
    data: KeyPairInterface,
    userId: string,
    callback?: (res: SuccessMessageInterface) => void
  ) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await staffManagementServices.updateAdminUserStatus(
        data,
        userId
      );
      handleApiResponse(response, dispatch, callback);
    } catch (error) {
      handleApiError(error, dispatch);
    }
  };

export const deleteAdminUser =
  (data: KeyPairInterface, callback?: (res: SuccessMessageInterface) => void) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await staffManagementServices.deleteAdminUser(data);
      handleApiResponse(response, dispatch, callback);
    } catch (error) {
      handleApiError(error, dispatch);
    }
  };

export default manageStaffSlice.reducer;

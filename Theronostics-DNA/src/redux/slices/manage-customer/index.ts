import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  CustomerListResponse,
  CustomerRecord,
  KeyPairInterface,
  ManageCustomerState,
  SortOrder,
} from "../../../types/redux.type";
import { AppDispatch } from "../../store";
import flashMessage from "../../../utils/notifications/antdMessageUtils";
import customerServices from "../../../services/endpoints/customer-management.api";

// Initial State
const initialState: ManageCustomerState = {
  page: 1,
  perPage: 10,
  sort: "desc",
  sortColumn: "created_at",
  searchText: "",
  totalRecords: 0,
  totalPages: 1,
  records: [],
};

// Slice
const manageCustomerSlice = createSlice({
  name: "manageCustomer",
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
    setTotalRecords: (state, action: PayloadAction<number>) => {
      state.totalRecords = action.payload;
    },
    setTotalPages: (state, action: PayloadAction<number>) => {
      state.totalPages = action.payload;
    },
    setRecords: (state, action: PayloadAction<CustomerRecord[]>) => {
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
  setTotalRecords,
  setTotalPages,
  setRecords,
  resetState,
} = manageCustomerSlice.actions;

// Helper Functions
const handleApiError = (error: unknown, dispatch: AppDispatch) => {
  console.error("API Error:", error);
  flashMessage("Internal Server Error", "error");
  dispatch(resetState());
};

// Thunk
export const fetchCustomerList =
  (params: KeyPairInterface) => async (dispatch: AppDispatch) => {
    try {
      const response = await customerServices.fetchCustomerDetails(params);

      if (!response.success) {
        dispatch(resetState());
        flashMessage(response.message, "error");
        return;
      }

      const responseData: CustomerListResponse = response.data;
      if (!responseData) {
        dispatch(resetState());
        return;
      }

      dispatch(setRecords(responseData.records || []));
      dispatch(setTotalPages(responseData.total_pages || 1));
      dispatch(setTotalRecords(responseData.total_records || 0));
      dispatch(setSearchText(responseData.search_text || ""));
      dispatch(setSortColumn(responseData.sort_column || "created_at"));
      dispatch(setSort(responseData.sort || "desc"));
      dispatch(setPerPage(responseData.per_page || 10));
      dispatch(setPage(responseData.page || 1));
    } catch (error) {
      handleApiError(error, dispatch);
    }
  };

export default manageCustomerSlice.reducer;

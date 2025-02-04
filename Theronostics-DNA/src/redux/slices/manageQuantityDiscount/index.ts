import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  QuantityDiscountRecord,
  ManageQuantityDiscountState,
} from "../../../types/redux.type";
import { AppDispatch } from "../../store";
import flashMessage from "../../../utils/notifications/antdMessageUtils";
import { quantityDiscountManagementServices } from "../../../services/endpoints/quantity-discount-management.api";

// Initial State
const initialState: ManageQuantityDiscountState = {
  page: 1,
  perPage: 10,
  sort: "desc",
  sortColumn: "created_at",
  totalRecords: 0,
  totalPages: 1,
  records: [],
};

// Slice
const manageQuantityDiscountSlice = createSlice({
  name: "manageQuantityDiscount",
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setPerPage: (state, action: PayloadAction<number>) => {
      state.perPage = action.payload;
    },
    setSort: (state, action: PayloadAction<string>) => {
      state.sort = action.payload;
    },
    setSortColumn: (state, action: PayloadAction<string>) => {
      state.sortColumn = action.payload;
    },
    setTotalRecords: (state, action: PayloadAction<number>) => {
      state.totalRecords = action.payload;
    },
    setTotalPages: (state, action: PayloadAction<number>) => {
      state.totalPages = action.payload;
    },
    setRecords: (state, action: PayloadAction<QuantityDiscountRecord[]>) => {
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
  setTotalRecords,
  setTotalPages,
  setRecords,
  resetState,
} = manageQuantityDiscountSlice.actions;

// Helper Function
const handleApiError = (error: unknown, dispatch: AppDispatch) => {
  console.error("API Error:", error);
  flashMessage("Internal Server Error", "error");
  dispatch(resetState());
};

// Thunk
export const fetchQuantityDiscountList = () => async (dispatch: AppDispatch) => {
  try {
    const response = await quantityDiscountManagementServices.fetchQuantityDiscountList();

    if (!response.success) {
      dispatch(resetState());
      flashMessage(response.message, "error");
      return;
    }
    dispatch(setRecords(response.data || []));

  } catch (error) {
    handleApiError(error, dispatch);
  }
};

export default manageQuantityDiscountSlice.reducer;
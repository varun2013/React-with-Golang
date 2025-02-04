import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import flashMessage from "../../../utils/notifications/antdMessageUtils";
import {
  KeyPairInterface,
  ManageOrderState,
  SortOrder,
  SuccessMessageInterface,
} from "../../../types/redux.type";
import { AppDispatch } from "../../store";
import orderManagementServices from "../../../services/endpoints/order-management.api";

// Initial state
const initialState: ManageOrderState = {
  page: 1,
  perPage: 10,
  sort: "desc",
  sortColumn: "created_at",
  searchText: "",
  totalRecords: 0,
  totalPages: 1,
  paymentStatus: "completed",
  orderStatus: "all",
  records: [],
  orderCounts: {
    dispatched: 0,
    processing: 0,
    pending: 0,
    shipped: 0,
    totalQunatity: 0,
  },
};

// Slice
const manageOrderSlice = createSlice({
  name: "manageOrder",
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
    setRecords: (state, action: PayloadAction<any[]>) => {
      state.records = action.payload;
    },
    setOrderCounts: (state, action: PayloadAction<any>) => {
      state.orderCounts = action.payload;
    },
    resetState: (state) => {
      Object.assign(state, initialState);
    },
    setPaymentStatus: (state, action: PayloadAction<string>) => {
      state.paymentStatus = action.payload;
    },
    setOrderStatus: (state, action: PayloadAction<string>) => {
      state.orderStatus = action.payload;
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
  setOrderCounts,
  setPaymentStatus,
  setOrderStatus,
} = manageOrderSlice.actions;

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
export const getAdminOrderList =
  (data: KeyPairInterface) => async (dispatch: AppDispatch) => {
    try {
      const response = await orderManagementServices.fetchOrderDetails(data);
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
      dispatch(setRecords(responseData.records ?? []));
      dispatch(setTotalPages(responseData.total_pages ?? 1));
      dispatch(setTotalRecords(responseData.total_records ?? 0));
      dispatch(setSearchText(responseData.search_text ?? ""));
      dispatch(setSortColumn(responseData.sort_column ?? "created_at"));
      dispatch(setSort(responseData.sort ?? "desc"));
      dispatch(setPerPage(responseData.per_page ?? 10));
      dispatch(setPage(responseData.page ?? 1));
      dispatch(setPaymentStatus(responseData.payment_status ?? "completed"));
      dispatch(setOrderStatus(responseData.order_status ?? "all"));
    } catch (error) {
      handleApiError(error, dispatch);
    }
  };

export const AssignKitToUser =
  (
    data: KeyPairInterface,
    orderID: string,
    callback?: (res: SuccessMessageInterface) => void
  ) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await orderManagementServices.barcodeAssignKit(
        data,
        orderID
      );
      handleApiResponse(response, dispatch, callback);
      
    } catch (error) {
      handleApiError(error, dispatch);
    }
  };

export const fetchOrderStatusCount =
  (callback?: (res: SuccessMessageInterface) => void) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await orderManagementServices.fetchOrderStatusCount();
      if (response.success) {
        await dispatch(
          setOrderCounts({
            dispatched: response.data.dispatched,
            processing: response.data.processing,
            pending: response.data.pending,
            shipped: response.data.shipped,
            totalQunatity: response.data.total_quantity,
          })
        );
      }
    } catch (error) {
      handleApiError(error, dispatch);
    }
  };

export const updateAdminOrderStatus =
  (
    data: KeyPairInterface,
    orderID: string,
    callback?: (res: SuccessMessageInterface) => void
  ) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await orderManagementServices.updateOrderStatus(
        data,
        orderID
      );
      handleApiResponse(response, dispatch, callback);

      if (response.success) {
        await dispatch(fetchOrderStatusCount());
      }
    } catch (error) {
      handleApiError(error, dispatch);
    }
  };
export default manageOrderSlice.reducer;

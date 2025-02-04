import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  CustomerOrderData,
  KeyPairInterface,
  KitRegisterFechedRecord,
  KitRegisterListResponse,
  KitRegisterState,
  SuccessMessageInterface,
} from "../../../types/redux.type";
import { AppDispatch } from "../../store";
import flashMessage from "../../../utils/notifications/antdMessageUtils";
import kitRegisterManagementServices from "../../../services/endpoints/kit-register.api";

// Initial state
const initialState: KitRegisterState = {
  customerOrderData: null,
  page: 1,
  perPage: 10,
  sort: "desc",
  sortColumn: "created_at",
  searchText: "",
  totalRecords: 0,
  totalPages: 1,
  records: [],
  status: "all",
};

// Slice
const kitRegisterSlice = createSlice({
  name: "kitRegister",
  initialState,
  reducers: {
    setCustomerOrderData: (state, action: PayloadAction<CustomerOrderData>) => {
      state.customerOrderData = action.payload;
    },
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
    setStatus: (state, action: PayloadAction<string>) => {
      state.status = action.payload;
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
    setRecords: (state, action: PayloadAction<KitRegisterFechedRecord[]>) => {
      state.records = action.payload;
    },
    resetState: (state) => {
      Object.assign(state, initialState);
    },
  },
});

// Actions
export const {
  setCustomerOrderData,
  resetState,
  setPage,
  setPerPage,
  setSort,
  setSortColumn,
  setSearchText,
  setTotalRecords,
  setTotalPages,
  setRecords,
  setStatus,
} = kitRegisterSlice.actions;

// Helper functions
const handleApiError = (error: unknown, dispatch: AppDispatch) => {
  console.error("API Error:", error);
  flashMessage("Internal Server Error", "error");
  // dispatch(resetState());
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

// Thunk for verifying barcode data
export const verifyBarcodeData =
  (data: KeyPairInterface, callback?: (res: SuccessMessageInterface) => void) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await kitRegisterManagementServices.verifyBarcode(data);

      if (!response.success) {
        dispatch(resetState());
        flashMessage(response.message, "error");
        return;
      }

      const responseData: CustomerOrderData = response.data;
      if (!responseData) {
        dispatch(resetState());
        return;
      }

      dispatch(setCustomerOrderData(responseData));
      handleApiResponse(response, dispatch, callback);
    } catch (error) {
      handleApiError(error, dispatch);
    }
  };

export const kitRegister =
  (data: KeyPairInterface, callback?: (res: SuccessMessageInterface) => void) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await kitRegisterManagementServices.kitRegister(data);

      if (!response.success) {
        flashMessage(response.message, "error");
        return;
      }
      handleApiResponse(response, dispatch, callback);
    } catch (error) {
      handleApiError(error, dispatch);
    }
  };

export const fetchKitRegister =
  (params: KeyPairInterface) => async (dispatch: AppDispatch) => {
    try {
      const response = await kitRegisterManagementServices.kitRegisterFetch(
        params
      );

      if (!response.success) {
        dispatch(resetState());
        flashMessage(response.message, "error");
        return;
      }

      const responseData: KitRegisterListResponse = response.data;
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
      dispatch(setStatus(responseData.status || "all"));
    } catch (error) {
      handleApiError(error, dispatch);
    }
  };

export const patientUpdateStatus =
  (
    data: KeyPairInterface,
    patientId: number,
    callback?: (res: SuccessMessageInterface) => void
  ) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await kitRegisterManagementServices.patientStatusUpdate(
        data,
        patientId
      );
      handleApiResponse(response, dispatch, callback);

    
    } catch (error) {
      handleApiError(error, dispatch);
    }
  };

export const patientUploadReport =
  (
    data: KeyPairInterface,
    patientId: number,
    callback?: (res: SuccessMessageInterface) => void
  ) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await kitRegisterManagementServices.patientUploadReport(
        data,
        patientId
      );
      handleApiResponse(response, dispatch, callback);

     
    } catch (error) {
      handleApiError(error, dispatch);
    }
  };

export default kitRegisterSlice.reducer;

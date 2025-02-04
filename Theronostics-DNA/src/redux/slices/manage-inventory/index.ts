import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "../../store";
import flashMessage from "../../../utils/notifications/antdMessageUtils";
import {
  InventoryQuantity,
  KeyPairInterface,
  ManageInventoryState,
  SortOrder,
} from "../../../types/redux.type";
import inventoryManagementServices from "../../../services/endpoints/inventory-management.api";

// Initial state
const initialQuantity: InventoryQuantity = {
  bloodQuantity: 0,
  salivaQuantity: 0,
  combinedQuantity: 0,
};

const initialState: ManageInventoryState = {
  page: 1,
  perPage: 10,
  sort: "desc",
  sortColumn: "created_at",
  searchText: "",
  totalRecords: 0,
  totalPages: 1,
  records: [],
  type: "",
  quantity: initialQuantity,
};

// Slice
const manageInventorySlice = createSlice({
  name: "manageInventory",
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
    setKitType: (state, action: PayloadAction<string>) => {
      state.type = action.payload;
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
    setQuantity: (state, action: PayloadAction<InventoryQuantity>) => {
      state.quantity = action.payload;
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
  setKitType,
  setTotalRecords,
  setTotalPages,
  setRecords,
  setQuantity,
  resetState,
} = manageInventorySlice.actions;

const handleApiError = (error: unknown, dispatch: AppDispatch) => {
  console.error("API Error:", error);
  dispatch(resetState());
  flashMessage("An error occurred while processing your request", "error");
};

export const getKitInfo =
  (data: KeyPairInterface) => async (dispatch: AppDispatch) => {
    try {
      const response = await inventoryManagementServices.fetchKitInfo(data);

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
      dispatch(setKitType(responseData.status ?? ""));
      dispatch(setSearchText(responseData.search_text ?? ""));
      dispatch(setSortColumn(responseData.sort_column ?? "created_at"));
      dispatch(setSort(responseData.sort ?? "desc"));
      dispatch(setPerPage(responseData.per_page ?? 10));
      dispatch(setPage(responseData.page ?? 1));
    
      // Get quantity summary after successful kit info fetch
      await dispatch(getKitQuantitySummary({}));
    } catch (error) {
      handleApiError(error, dispatch);
    }
  };

export const createKitInfo =
  (data: KeyPairInterface) => async (dispatch: AppDispatch) => {
    try {
      const response = await inventoryManagementServices.createKitInfo(data);
      flashMessage(response.message, response.success ? "success" : "error");
    } catch (error) {
      handleApiError(error, dispatch);
    }
  };

export const updateKitInfo =
  (data: KeyPairInterface, kitID: string) => async (dispatch: AppDispatch) => {
    try {
      const response = await inventoryManagementServices.updateKitInfo(
        data,
        kitID
      );
      flashMessage(response.message, response.success ? "success" : "error");

    } catch (error) {
      handleApiError(error, dispatch);
    }
  };

export const deleteKitInfo =
  (data: KeyPairInterface) => async (dispatch: AppDispatch) => {
    try {
      const response = await inventoryManagementServices.deleteKitInfo(data);
      flashMessage(response.message, response.success ? "success" : "error");
    } catch (error) {
      handleApiError(error, dispatch);
    }
  };

export const getKitQuantitySummary =
  (data: KeyPairInterface) => async (dispatch: AppDispatch) => {
    try {
      const response = await inventoryManagementServices.fetchQuantitySummary();

      if (!response.success) {
        dispatch(setQuantity(initialQuantity));
        flashMessage(response.message, "error");
        return;
      }

      dispatch(
        setQuantity({
          bloodQuantity: response.data?.blood_quantity ?? 0,
          salivaQuantity: response.data?.saliva_quantity ?? 0,
          combinedQuantity: response.data?.combined_quantity ?? 0,
        })
      );
    } catch (error) {
      handleApiError(error, dispatch);
    }
  };

export default manageInventorySlice.reducer;

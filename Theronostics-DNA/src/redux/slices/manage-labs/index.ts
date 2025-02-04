import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  KeyPairInterface,
  manageLabsState,
  SuccessMessageInterface,
} from "../../../types/redux.type";
import { AppDispatch } from "../../store";
import flashMessage from "../../../utils/notifications/antdMessageUtils";
import { manageLabServices } from "../../../services/endpoints/labs-management.api";

// Initial state
const initialState: manageLabsState = {
  records: [],
};

// Slice
const manageLabsSlice = createSlice({
  name: "manageLabs",
  initialState,
  reducers: {
    setRecords: (state, action: PayloadAction<any>) => {
      state.records = action.payload;
    },
    resetState: (state) => {
      Object.assign(state, initialState);
    },
  },
});

// Actions
export const { resetState, setRecords } = manageLabsSlice.actions;

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

export const fetchLabList =
  (params: KeyPairInterface) => async (dispatch: AppDispatch) => {
    try {
      const response = await manageLabServices.fetchedLabList(params);

      if (!response.success) {
        dispatch(resetState());
        flashMessage(response.message, "error");
        return;
      }

      const responseData: any = response.data;
      if (!responseData) {
        dispatch(resetState());
        return;
      }

      dispatch(setRecords(responseData || []));
    } catch (error) {
      handleApiError(error, dispatch);
    }
  };

export default manageLabsSlice.reducer;

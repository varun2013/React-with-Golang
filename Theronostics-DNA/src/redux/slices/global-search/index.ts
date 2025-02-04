import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { globalSearchState, KeyPairInterface, SuccessMessageInterface } from "../../../types/redux.type";
import { AppDispatch } from "../../store";
import flashMessage from "../../../utils/notifications/antdMessageUtils";
import { globalSearchServices } from "../../../services/endpoints/globalSearch.api";


// Initial state
const initialState: globalSearchState = {
response : null
};

// Slice
const globalSearchSlice = createSlice({
  name: "globalSearch",
  initialState,
  reducers: {
    
    setResponse: (state, action: PayloadAction<any>) => {
      state.response = action.payload;
    },
    resetState: (state) => {
      Object.assign(state, initialState);
    },
  },
});

// Actions
export const {
    setResponse,
    resetState
} = globalSearchSlice.actions;

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

export const globalSearch =
  (
    data: KeyPairInterface,
    barcode_number: string,
    callback?: (res: SuccessMessageInterface) => void
  ) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await globalSearchServices.globalSearchBarcodeAPI(
        data,
        barcode_number
      );
      handleApiResponse(response, dispatch, callback);

      
      dispatch(setResponse(response.data || null));
     
    } catch (error) {
      handleApiError(error, dispatch);
    }
  };

export default globalSearchSlice.reducer;

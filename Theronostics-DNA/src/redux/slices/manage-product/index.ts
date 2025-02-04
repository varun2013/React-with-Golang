import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  KeyPairInterface,
  productState,
  SuccessMessageInterface,
} from "../../../types/redux.type";
import { AppDispatch } from "../../store";
import flashMessage from "../../../utils/notifications/antdMessageUtils";
import productManagementServices from "../../../services/endpoints/product-management.api";

// Initial state
const initialState: productState = {
  productName: "",
  productDescription: "",
  productImage: "",
  productPrice: 0,
  productGstPrice: 0,
};

// Slice
const productDetailsSlice = createSlice({
  name: "productDetails",
  initialState,
  reducers: {
    setProductName: (state, action: PayloadAction<string>) => {
      state.productName = action.payload;
    },
    setProductDescription: (state, action: PayloadAction<string>) => {
      state.productDescription = action.payload;
    },
    setProductImage: (state, action: PayloadAction<string>) => {
      state.productImage = action.payload;
    },
    setProductPrice: (state, action: PayloadAction<number>) => {
      state.productPrice = action.payload;
    },
    setProductGstPrice: (state, action: PayloadAction<number>) => {
      state.productGstPrice = action.payload;
    },
    resetState: (state) => {
      Object.assign(state, initialState);
    },
  },
});

// Actions
export const {
  setProductName,
  setProductDescription,
  setProductImage,
  setProductPrice,
  resetState,
  setProductGstPrice,
} = productDetailsSlice.actions;

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

// Encrypt and Dispatch Product Data
export const encryptAndDispatchProductData =
  (data: KeyPairInterface, callback?: (res: SuccessMessageInterface) => void) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await productManagementServices.encryptProductApi(data);

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
      handleApiResponse(response, dispatch, callback);
    } catch (error) {
      handleApiError(error, dispatch);
    }
  };

// Verify and Dispatch Product Data
export const verifyAndDispatchProductData =
  (data: KeyPairInterface, callback?: (res: SuccessMessageInterface) => void) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await productManagementServices.verifyProductApi(data);

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
      dispatch(setProductName(responseData.name ?? ""));
      dispatch(setProductDescription(responseData.description ?? ""));
      dispatch(setProductImage(responseData.image ?? ""));
      dispatch(setProductPrice(responseData.price ?? 0));
      dispatch(setProductGstPrice(responseData.gst_price ?? 0));

      handleApiResponse(response, dispatch, callback);
    } catch (error) {
      handleApiError(error, dispatch);
    }
  };

// Verify and Dispatch Product Data
export const orderPaymentData =
  (data: KeyPairInterface, callback?: (res: SuccessMessageInterface) => void) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await productManagementServices.orderPaymentApi(data);

      if (!response.success) {
        flashMessage(response.message, "error");
        return;
      }

      const responseData = response.data;
      if (!responseData) {
        return;
      }
      handleApiResponse(response, dispatch, callback);
    } catch (error) {
      flashMessage("Internal Server Error", "error");
    }
  };

export const paymentSuccessData =
  (data: KeyPairInterface, callback?: (res: SuccessMessageInterface) => void) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await productManagementServices.paymentStatusApi(data);

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
      handleApiResponse(response, dispatch, callback);
    } catch (error) {
      handleApiError(error, dispatch);
    }
  };

export default productDetailsSlice.reducer;

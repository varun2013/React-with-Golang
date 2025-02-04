import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AuthState,
  KeyPairInterface,
  SuccessMessageInterface,
} from "../../../types/redux.type";
import { AppDispatch } from "../../store";
import { setLocalStorageData } from "../../../utils/storage/localStorageUtils";
import flashMessage from "../../../utils/notifications/antdMessageUtils";
import authServices from "../../../services/endpoints/authenticate.api";

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
  },
});

export const { setAuthUser } = authSlice.actions;

// Action creators
export const loginUser =
  (data: KeyPairInterface, callback?: (res: SuccessMessageInterface) => void) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await authServices.loginUser(data);
      if (response.success && response.data) {
        await setLocalStorageData("token", response.data.token);
      }
      flashMessage(response.message, response.success ? "success" : "error");
      if (callback) {
        callback(response);
      }
    } catch (error) {
      console.error("Login error:", error);
      flashMessage("An error occurred during login", "error");
    }
  };

export const forgetPassword =
  (data: KeyPairInterface, callback?: (res: SuccessMessageInterface) => void) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await authServices.requestPasswordReset(data);
      flashMessage(response.message, response.success ? "success" : "error");
      if (callback) {
        callback(response);
      }
    } catch (error) {
      console.error("Forget Password error:", error);
      flashMessage("An error occurred during Forget password", "error");
    }
  };

export const resetPassword =
  (data: KeyPairInterface, callback?: (res: SuccessMessageInterface) => void) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await authServices.resetPassword(data);
      flashMessage(response.message, response.success ? "success" : "error");
      if (callback) {
        callback(response);
      }
    } catch (error) {
      console.error("Reset Password error:", error);
      flashMessage("An error occurred during Reset password", "error");
    }
  };

export const updateUserDetails =
  (data: KeyPairInterface, callback?: (res: SuccessMessageInterface) => void) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await authServices.updateUserDetails(data);
      flashMessage(response.message, response.success ? "success" : "error");
      if (response.success && response.data) {
        dispatch(setAuthUser(response.data));
      }
    } catch (error) {
      console.error("Update User Details error:", error);
      flashMessage("An error occurred during update user details", "error");
    }
  };

export const getUserDetails =
  (data: KeyPairInterface, callback?: (res: SuccessMessageInterface) => void) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await authServices.getUserDetails(data);
      if (response.success && response.data) {
        dispatch(setAuthUser(response.data));
      }
      if (callback) {
        callback(response);
      }
    } catch (error) {
      console.error("Get User Details error:", error);
    }
  };

export const logoutUser =
  (data: KeyPairInterface, callback?: (res: SuccessMessageInterface) => void) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await authServices.logoutUser(data);
      flashMessage(response.message, response.success ? "success" : "error");
      if (callback) {
        callback(response);
      }
    } catch (error) {
      console.error("Logout error:", error);
      flashMessage("An error occurred during logout", "error");
    }
  };

export default authSlice.reducer;

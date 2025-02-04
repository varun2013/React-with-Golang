import { API } from "../api";
import { StandardResponse } from "../api/requestBuilder";
import {
  FORGET_PASSWORD,
  GET_USER_DETAILS,
  LOGIN,
  LOGOUT_API,
  RESET_PASSWORD,
  UPDATE_USER_DETAILS,
} from "../constants/api-constants";

// User login
const loginUser = (payload: any): Promise<StandardResponse> => {
  return API.post(LOGIN, payload);
};

// Request password reset
const requestPasswordReset = (payload: any): Promise<StandardResponse> => {
  return API.post(FORGET_PASSWORD, payload);
};

// Reset user password
const resetPassword = (payload: any): Promise<StandardResponse> => {
  return API.patch(RESET_PASSWORD, payload);
};

// Update user details
const updateUserDetails = (payload: any): Promise<StandardResponse> => {
  return API.patch(UPDATE_USER_DETAILS, payload);
};

// Get user details
const getUserDetails = (params: any): Promise<StandardResponse> => {
  return API.get(GET_USER_DETAILS, params);
};

// Logout user
const logoutUser = (params: any): Promise<StandardResponse> => {
  return API.delete(LOGOUT_API, params);
};

// eslint-disable-next-line
const authServices = {
  loginUser,
  requestPasswordReset,
  resetPassword,
  updateUserDetails,
  getUserDetails,
  logoutUser,
};

export default authServices;

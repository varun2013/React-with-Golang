import { API } from "../api";
import { ADMIN_USER_API } from "../constants/api-constants";

// Fetch the list of admin users
const fetchAdminUserList = (params: any) => {
  return API.get(ADMIN_USER_API, params);
};

// Create a new admin user
const createAdminUser = (payload: any) => {
  return API.post(ADMIN_USER_API, payload);
};

// Update an admin user's profile
const updateAdminUserProfile = (payload: any, userId: string) => {
  return API.patch(`${ADMIN_USER_API}/${userId}/change-details`, payload);
};

// Update an admin user's password
const updateAdminUserPassword = (payload: any, userId: string) => {
  return API.patch(`${ADMIN_USER_API}/${userId}/change-password`, payload);
};

// Update an admin user's status
const updateAdminUserStatus = (payload: any, userId: string) => {
  return API.patch(`${ADMIN_USER_API}/${userId}/change-status`, payload);
};

// Delete an admin user
const deleteAdminUser = (data: any) => {
  return API.delete(`${ADMIN_USER_API}/${data.user_id}`, {});
};

// eslint-disable-next-line
export const staffManagementServices = {
  fetchAdminUserList,
  createAdminUser,
  updateAdminUserProfile,
  updateAdminUserPassword,
  updateAdminUserStatus,
  deleteAdminUser,
};

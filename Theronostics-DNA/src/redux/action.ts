import { GLOBAL_ACTIONS } from "../types/redux.type";

export const resetState = () => ({
  type: GLOBAL_ACTIONS.RESET_STATE,
});

export const resetFilter = () => ({
  type: GLOBAL_ACTIONS.RESET_FILTER,
});

export { setLoader } from "./slices/loader";

export {
  loginUser,
  forgetPassword,
  setAuthUser,
  resetPassword,
  updateUserDetails,
  getUserDetails,
  logoutUser,
} from "./slices/auth";
export {
  encryptAndDispatchProductData,
  verifyAndDispatchProductData,
  orderPaymentData,
  paymentSuccessData,
} from "./slices/manage-product";
export {
  getAdminUserList,
  createAdminUser,
  updateAdminUserProfile,
  updateAdminUserPassword,
  updateAdminUserStatus,
  deleteAdminUser,
} from "./slices/manage-staff";
export {
  getKitInfo,
  createKitInfo,
  updateKitInfo,
  deleteKitInfo,
  getKitQuantitySummary,
} from "./slices/manage-inventory";
export { fetchCustomerList } from "./slices/manage-customer";
export { getAdminCustomerOrderList } from "./slices/manage-customer-order-details";
export {
  getAdminOrderList,
  updateAdminOrderStatus,
  AssignKitToUser,
  fetchOrderStatusCount,
} from "./slices/manage-order";
export {
  fetchNotificationList,
  fetchLatestNotificationList,
  markNotificationAsread,
  markAllNotificationAsread,
  deleteNotification,
  deleteSpecificNotification,
} from "./slices/notification";

export { fetchQuantityDiscountList } from "./slices/manageQuantityDiscount";

export { openModal, closeModal, setSelectedData } from "./slices/modal";

export { setTheme } from "./slices/theme";

export {
  kitRegister,
  verifyBarcodeData,
  fetchKitRegister,
  patientUpdateStatus,
  patientUploadReport,
} from "./slices/kit-register";

export { globalSearch } from "./slices/global-search";

export { fetchLabList } from "./slices/manage-labs";

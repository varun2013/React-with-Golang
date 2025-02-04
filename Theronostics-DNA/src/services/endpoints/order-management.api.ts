import { API } from "../api";
import { ORDER_DETAILS_API } from "../constants/api-constants";

/**
 * Fetches order details.
 * @param params Query parameters for the API request.
 * @returns Promise containing order details.
 */
export const fetchOrderDetails = (params: Record<string, any>) => {
  return API.get(ORDER_DETAILS_API, params);
};

/**
 * Updates the order status by an admin.
 * @param data Data for updating the order status.
 * @param orderID Unique identifier for the user.
 * @returns Promise indicating the result of the status update.
 */
export const updateOrderStatus = (
  data: Record<string, any>,
  orderID: string
) => {
  return API.patch(`${ORDER_DETAILS_API}/${orderID}/change-status`, data);
};

/**
 * Assigns a kit to a user.
 * @param data Data for assigning the kit.
 * @param orderID Unique identifier for the user.
 * @returns Promise indicating the result of the kit assignment.
 */
export const barcodeAssignKit = (data: Record<string, any>, orderID: string) => {
  return API.post(`${ORDER_DETAILS_API}/${orderID}/assign-kit`, data);
};

export const fetchOrderStatusCount = () => {
  return API.get(`${ORDER_DETAILS_API}/count`);
};

const orderManagementServices = {
  fetchOrderDetails,
  updateOrderStatus,
  barcodeAssignKit,
  fetchOrderStatusCount,
};

export default orderManagementServices;

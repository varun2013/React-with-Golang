import { API } from "../api";
import { CUSTOMER_DETAILS_API } from "../constants/api-constants";

/**
 * Fetches customer details.
 * @param params Query parameters for the API request.
 * @returns Promise containing customer details.
 */
export const fetchCustomerDetails = (params: Record<string, any>) => {
  return API.get(CUSTOMER_DETAILS_API, params);
};

/**
 * Fetches customer details along with their order details.
 * @param params Query parameters for the API request.
 * @param customerID Unique identifier for the user.
 * @returns Promise containing customer and order details.
 */
export const fetchCustomerWithOrderDetails = (
  params: Record<string, any>,
  customerID: string
) => {
  return API.get(`${CUSTOMER_DETAILS_API}/${customerID}/orders`, params);
};

const customerServices = {
  fetchCustomerDetails,
  fetchCustomerWithOrderDetails,
};

export default customerServices;

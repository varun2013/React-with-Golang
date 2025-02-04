import { API } from "../api";
import { FETCH_QUANTITY_DISCOUNT_API } from "../constants/api-constants";

const fetchQuantityDiscountList = () => {
  return API.get(FETCH_QUANTITY_DISCOUNT_API);
};

// eslint-disable-next-line
export const quantityDiscountManagementServices = {
  fetchQuantityDiscountList,
};

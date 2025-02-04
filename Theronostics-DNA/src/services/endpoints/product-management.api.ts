import { API } from "../api";
import {
  ENCRYPT_PRODUCT_API,
  ORDER_PAYMENT_API,
  PAYMENT_STATUS_API,
  VERIFY_PRODUCT_API,
} from "../constants/api-constants";
const encryptProductApi = (data: any) => {
  return API.post(ENCRYPT_PRODUCT_API, data);
};
const verifyProductApi = (data: any) => {
  return API.post(VERIFY_PRODUCT_API, data);
};
const orderPaymentApi = (data: any) => {
  return API.post(ORDER_PAYMENT_API, data);
};
const paymentStatusApi = (data: any) => {
  return API.get(PAYMENT_STATUS_API, data);
};

// eslint-disable-next-line
const productManagementServices = {
  encryptProductApi,
  verifyProductApi,
  orderPaymentApi,
  paymentStatusApi,
};

export default productManagementServices;

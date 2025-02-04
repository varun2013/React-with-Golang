import { API } from "../api";
import { GLOBAL_BARCODE_SEARCH_API } from "../constants/api-constants";


// global search API
const globalSearchBarcodeAPI = (payload: any, barcode_number: string) => {
  return API.get(`${GLOBAL_BARCODE_SEARCH_API}/${barcode_number}/details`, payload);
};


// eslint-disable-next-line
export const globalSearchServices = {
    globalSearchBarcodeAPI
};

import { API } from "../api";
import { FETCHED_LAB_LIST } from "../constants/api-constants";


const fetchedLabList = (payload: any) => {
  return API.get(`${FETCHED_LAB_LIST}`, payload);
};


// eslint-disable-next-line
export const manageLabServices = {
    fetchedLabList
};

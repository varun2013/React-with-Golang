import { API } from "../api";
import { KIT_INFO_API, KIT_QUANTITY_SUMMARY_API } from "../constants/api-constants";

// Fetch kit information
const fetchKitInfo = (params: any) => {
  return API.get(KIT_INFO_API, params);
};

// Create new kit information
const createKitInfo = (payload: any) => {
  return API.post(KIT_INFO_API, payload);
};

// Update existing kit information
const updateKitInfo = (payload: any, kitID: string) => {
  return API.patch(`${KIT_INFO_API}/${kitID}`, payload);
};

// Delete specific kit information
const deleteKitInfo = (data: any) => {
  return API.delete(`${KIT_INFO_API}/${data.user_id}`, {});
};

// Fetch quantity summary for kits
const fetchQuantitySummary = () => {
  return API.get(`${KIT_QUANTITY_SUMMARY_API}`, {});
};

// eslint-disable-next-line
const inventoryManagementServices = {
  fetchKitInfo,
  createKitInfo,
  updateKitInfo,
  deleteKitInfo,
  fetchQuantitySummary,
};

export default inventoryManagementServices;

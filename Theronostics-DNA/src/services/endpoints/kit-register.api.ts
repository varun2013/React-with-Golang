import { API } from "../api";
import {
  KIt_REGISTER_API,
  KIT_REGISTERED_FETCHED_API,
  PATIENT_STATUS_UPDATE_API,
  VERIFY_BARCODE_API,
} from "../constants/api-constants";

const verifyBarcode = (data: any) => {
  return API.post(VERIFY_BARCODE_API, data);
};

const kitRegister = (data: any) => {
  return API.post(KIt_REGISTER_API, data);
};

const kitRegisterFetch = (data: any) => {
  return API.get(KIT_REGISTERED_FETCHED_API, data);
};
const patientStatusUpdate = (payload: any, patientId: number) => {
  return API.patch(
    `${PATIENT_STATUS_UPDATE_API}/${patientId}/change-status`,
    payload
  );
};

const patientUploadReport = (payload: any, patientId: number) => {
  return API.patch(
    `${PATIENT_STATUS_UPDATE_API}/${patientId}/upload-report`,
    payload
  );
};

// eslint-disable-next-line
const kitRegisterManagementServices = {
  verifyBarcode,
  kitRegister,
  kitRegisterFetch,
  patientStatusUpdate,
  patientUploadReport,
};

export default kitRegisterManagementServices;

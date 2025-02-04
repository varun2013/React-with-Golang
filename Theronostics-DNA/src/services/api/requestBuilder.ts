import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse,
} from "axios";
import { getLocalStorageData } from "../../utils/storage/localStorageUtils";
import config from "../../config/config";

export type HTTPMethod = "get" | "post" | "delete" | "put" | "patch";
export type GoogleHTTPMethod = "get" | "post";

export interface JsonBody {
  // tslint:disable-next-line no-any
  [key: string]: any;
}

export interface Request {
  method: HTTPMethod;
  url: string;
  body?: JsonBody;
  params?: any;
}

export interface GoogleRequest {
  method: GoogleHTTPMethod;
  url: string;
  body?: JsonBody;
  params?: any;
}

export interface StandardResponse {
  status_code: number;
  success: boolean;
  message: string;
  data: any;
}

const buildRequest = (request: Request) => {
  const { body, method, url, params } = request;
  const tokenData = getLocalStorageData("token");
  const contentType =
    body instanceof FormData
      ? "application/x-www-form-urlencoded"
      : "application/json; charset=utf-8";

  const headers: AxiosRequestHeaders = {
    "Content-Type": contentType,
    ...(tokenData ? { Authorization: `Bearer ${tokenData}` } : {}),
  } as AxiosRequestHeaders; // Casting as AxiosRequestHeaders

  const requestConfig: AxiosRequestConfig = {
    baseURL: config.apiUrl,
    withCredentials: true,
    data: body,
    headers,
    method,
    url,
    params,
  };
  return requestConfig;
};

export const defaultResponse: Partial<AxiosError["response"]> = {
  status: 500,
  data: {
    message: "Server error",
  },
};

export const formatError = (responseError: AxiosError): StandardResponse => {
  const response = responseError.response || {
    status: 500,
    data: { message: "Server error" },
  };

  return {
    status_code: response.status,
    success: false,
    message: (response.data as { message?: string }).message || "Server Error",
    data: (response.data as { errors?: any[] }).errors || [],
  };
};

export const formatSuccess = (response: AxiosResponse): StandardResponse => {
  return {
    status_code: response.status,
    success: true,
    message: (response.data as { message?: string }).message || "Success",
    data: (response.data as { data?: any }).data || {},
  };
};

export const makeRequest = async (
  request: Request
): Promise<StandardResponse> => {
  const requestConfig = buildRequest(request);
  try {
    const response = await axios(requestConfig);
    return formatSuccess(response);
  } catch (error) {
    return formatError(error as AxiosError);
  }
};

export const ReturnSuccess = (data: any) => {
  return {
    success: true,
    message: data.message,
    data: data?.data || {},
  };
};

export const ReturnError = (error: any) => {
  return {
    success: false,
    message: error.message,
    errors: error.errors ?? [],
  };
};

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  KeyPairInterface,
  ManageCustomerOrderState,
  SortOrder,
} from "../../../types/redux.type";
import { AppDispatch } from "../../store";
import flashMessage from "../../../utils/notifications/antdMessageUtils";
import customerServices from "../../../services/endpoints/customer-management.api";

// Types

// Initial state
const initialState: ManageCustomerOrderState = {
  page: 1,
  perPage: 10,
  sort: "desc",
  sortColumn: "created_at",
  searchText: "",
  totalRecords: 0,
  totalPages: 1,
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  country: "",
  address: "",
  townCity: "",
  region: "",
  postcode: "",
  createdAt: "",
  records: [],
  ClinicID: "",
  shippingCountry: "",
  shippingAddress: "",
  shippingTownCity: "",
  shippingRegion: "",
  shippingPostcode: "",
};

// Slice
const manageCustomerOrderSlice = createSlice({
  name: "manageCustomerOrder",
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setPerPage: (state, action: PayloadAction<number>) => {
      state.perPage = action.payload;
    },
    setSort: (state, action: PayloadAction<SortOrder>) => {
      state.sort = action.payload;
    },
    setSortColumn: (state, action: PayloadAction<string>) => {
      state.sortColumn = action.payload;
    },
    setSearchText: (state, action: PayloadAction<string>) => {
      state.searchText = action.payload;
    },
    setTotalRecords: (state, action: PayloadAction<number>) => {
      state.totalRecords = action.payload;
    },
    setTotalPages: (state, action: PayloadAction<number>) => {
      state.totalPages = action.payload;
    },
    setRecords: (state, action: PayloadAction<any[]>) => {
      state.records = action.payload;
    },
    setFirstName: (state, action: PayloadAction<string>) => {
      state.firstName = action.payload;
    },
    setLastName: (state, action: PayloadAction<string>) => {
      state.lastName = action.payload;
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setPhoneNumber: (state, action: PayloadAction<string>) => {
      state.phoneNumber = action.payload;
    },
    setCountry: (state, action: PayloadAction<string>) => {
      state.country = action.payload;
    },
    setAddress: (state, action: PayloadAction<string>) => {
      state.address = action.payload;
    },
    setTownCity: (state, action: PayloadAction<string>) => {
      state.townCity = action.payload;
    },
    setRegion: (state, action: PayloadAction<string>) => {
      state.region = action.payload;
    },
    setPostcode: (state, action: PayloadAction<string>) => {
      state.postcode = action.payload;
    },
    setClinicID: (state, action: PayloadAction<string>) => {
      state.ClinicID = action.payload;
    },
    setShippingCountry: (state, action: PayloadAction<string>) => {
      state.shippingCountry = action.payload;
    },
    setShippingAddress: (state, action: PayloadAction<string>) => {
      state.shippingAddress = action.payload;
    },
    setShippingTownCity: (state, action: PayloadAction<string>) => {
      state.shippingTownCity = action.payload;
    },
    setShippingRegion: (state, action: PayloadAction<string>) => {
      state.shippingRegion = action.payload;
    },
    setShippingPostcode: (state, action: PayloadAction<string>) => {
      state.shippingPostcode = action.payload;
    },
    setCreatedAt: (state, action: PayloadAction<string>) => {
      state.createdAt = action.payload;
    },
    resetState: (state) => {
      Object.assign(state, initialState);
    },
  },
});

// Actions
export const {
  setPage,
  setPerPage,
  setSort,
  setSortColumn,
  setSearchText,
  setTotalRecords,
  setTotalPages,
  setRecords,
  setFirstName,
  setLastName,
  setEmail,
  setPhoneNumber,
  setCountry,
  setAddress,
  setTownCity,
  setRegion,
  setPostcode,
  setCreatedAt,
  resetState,
  setClinicID,
  setShippingCountry,
  setShippingAddress,
  setShippingTownCity,
  setShippingRegion,
  setShippingPostcode,

} = manageCustomerOrderSlice.actions;

// Helper functions
const handleApiError = (error: unknown, dispatch: AppDispatch) => {
  console.error("API Error:", error);
  flashMessage("Internal Server Error", "error");
  dispatch(resetState());
};
export const getAdminCustomerOrderList =
  (data: KeyPairInterface, orderID: string) => async (dispatch: AppDispatch) => {
    try {
      const response = await customerServices.fetchCustomerWithOrderDetails(
        data,
        orderID
      );

      if (!response.success) {
        dispatch(resetState());
        flashMessage(response.message, "error");
        return;
      }

      const responseData = response.data;
      if (!responseData) {
        dispatch(resetState());
        return;
      }
      dispatch(setRecords(responseData?.orders?.records ?? []));
      dispatch(setTotalPages(responseData?.orders?.total_pages ?? 1));
      dispatch(setTotalRecords(responseData?.orders?.total_records ?? 0));
      dispatch(setSearchText(responseData?.orders?.search_text ?? ""));
      dispatch(
        setSortColumn(responseData?.orders?.sort_column ?? "created_at")
      );
      dispatch(setSort(responseData?.orders?.sort ?? "desc"));
      dispatch(setPerPage(responseData?.orders?.per_page ?? 10));
      dispatch(setPage(responseData?.orders?.page ?? 1));
      dispatch(setFirstName(responseData?.customer?.first_name ?? ""));
      dispatch(setLastName(responseData?.customer?.last_name ?? ""));
      dispatch(setEmail(responseData?.customer?.email ?? ""));
      dispatch(setPhoneNumber(responseData?.customer?.phone_number ?? ""));
      dispatch(
        setCountry(responseData?.customer?.country ?? "")
      );
      dispatch(
        setAddress(responseData?.customer?.street_address ?? "")
      );
      dispatch(
        setTownCity(responseData?.customer?.town_city ?? "")
      );
      dispatch(
        setRegion(responseData?.customer?.region ?? "")
      );
      dispatch(
        setPostcode(responseData?.customer?.postcode ?? "")
      );

      dispatch(setClinicID(responseData?.customer?.clinic_id ?? ""));
      dispatch(
        setShippingCountry(responseData?.customer?.shipping_country ?? "")
      );
      dispatch(
        setShippingAddress(responseData?.customer?.shipping_address ?? "")
      );
      dispatch(
        setShippingTownCity(responseData?.customer?.shipping_town_city ?? "")
      );
      dispatch(
        setShippingRegion(responseData?.customer?.shipping_region ?? "")
      );
      dispatch(
        setShippingPostcode(responseData?.customer?.shipping_postcode ?? "")
      );

      dispatch(
        setCreatedAt(responseData?.customer?.created_at) ?? "created_at"
      );
    } catch (error) {
      handleApiError(error, dispatch);
    }
  };

export default manageCustomerOrderSlice.reducer;

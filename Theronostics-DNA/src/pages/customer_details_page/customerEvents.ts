import { FetchCustomerOrderDetailsParams } from "../../types/manage-customer.type";
import { getAdminCustomerOrderList, setLoader } from "../../redux/action";
import { AppDispatch } from "../../redux/store";
import { NavigateFunction } from "react-router-dom";
import { CUSTOMER_DETAILS_APP_URL, MANAGE_CUSTOMER_APP_URL } from "../../constants/appUrl";
import {
  setPage,
  setPerPage,
  setSearchText,
  setSortColumn,
} from "../../redux/slices/manage-customer-order-details";

export const handleFetchAllCustomerOrderDetails = (
  dispatch: AppDispatch,
  params: FetchCustomerOrderDetailsParams,
  customerID: string,
  navigate: NavigateFunction,
  location: any
) => {
  if (customerID) {
    updateQueryParams(navigate, params, location, customerID); // Update query params
    fetchAllCustomerOrderDetails(dispatch, params, customerID); // Fetch data
  } else {
    navigate(
      {
        pathname: MANAGE_CUSTOMER_APP_URL,
        search: `?currentPage=${String(
          1
        )}&sort=${"desc"}&sortColumn=${"created_at"}&searchText=${""}&perPage=${String(
          10
        )}`,
      },
      { replace: false }
    );
  }
};

export const updateQueryParams = (
  navigate: NavigateFunction,
  params: FetchCustomerOrderDetailsParams,
  location: Location,
  customerID: string
) => {
  const url = CUSTOMER_DETAILS_APP_URL.replace(":customerID", customerID);
  navigate(
    {
      pathname: url,
      search: `?currentPage=${String(params.currentPage)}&sort=${
        params.sort
      }&sortColumn=${params.sortColumn}&searchText=${
        params.searchText
      }&perPage=${String(params.perPage)}`,
    },
    { replace: false }
  );
};

/**
 * Fetch all customer order details
 * @param dispatch - Redux dispatch function
 * @param params - Fetch parameters
 * @param customerID - Customer user ID
 */
export const fetchAllCustomerOrderDetails = async (
  dispatch: AppDispatch,
  params: FetchCustomerOrderDetailsParams,
  customerID: string
): Promise<void> => {
  try {
    dispatch(setLoader(true));
    await dispatch(setPage(params.currentPage));
    await dispatch(setPerPage(params.perPage));
    await dispatch(setSortColumn(params.sortColumn));
    await dispatch(setSearchText(params.searchText));
    await dispatch(
      getAdminCustomerOrderList(
        {
          page: params.currentPage,
          per_page: params.perPage,
          sort: params.sort,
          sort_column: params.sortColumn,
          search_text: params.searchText,
        },
        customerID
      )
    );
  } catch (err) {
    console.error("Error getting customer details:", err);
  } finally {
    dispatch(setLoader(false));
  }
};

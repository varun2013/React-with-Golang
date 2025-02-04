import { NavigateFunction } from "react-router-dom";
import { fetchCustomerList, setLoader } from "../../redux/action";
import { AppDispatch } from "../../redux/store";
import { FetchCustomerDetailsParams } from "../../types/manage-customer.type";
import { MANAGE_CUSTOMER_APP_URL } from "../../constants/appUrl";
import {
  setPage,
  setPerPage,
  setSearchText,
  setSortColumn,
} from "../../redux/slices/manage-customer";

export const handleFetchAllCustomeretails = (
  dispatch: AppDispatch,
  params: FetchCustomerDetailsParams,
  navigate: NavigateFunction,
  location: any
) => {
  updateQueryParams(navigate, params, location); // Update query params
  fetchAllCustomerDetails(dispatch, params); // Fetch data
};

export const updateQueryParams = (
  navigate: NavigateFunction,
  params: FetchCustomerDetailsParams,
  location: Location
) => {
  navigate(
    {
      pathname: MANAGE_CUSTOMER_APP_URL,
      search: `?currentPage=${String(params.currentPage)}&sort=${
        params.sort
      }&sortColumn=${params.sortColumn}&searchText=${
        params.searchText
      }&perPage=${String(params.perPage)}`,
    },
    { replace: false }
  );
};

export const fetchAllCustomerDetails = async (
  dispatch: AppDispatch,
  {
    currentPage,
    sort,
    sortColumn,
    searchText,
    perPage,
  }: FetchCustomerDetailsParams
) => {
  try {
    await dispatch(setLoader(true));
    await dispatch(setPage(currentPage));
    await dispatch(setPerPage(perPage));
    await dispatch(setSortColumn(sortColumn));
    await dispatch(setSearchText(searchText));
    await dispatch(
      fetchCustomerList({
        page: currentPage,
        per_page: perPage,
        sort,
        sort_column: sortColumn,
        search_text: searchText,
      })
    );
  } catch (err) {
    console.error("Error getting customer details:", err);
  } finally {
    await dispatch(setLoader(false));
  }
};

// event.ts
import { Location, NavigateFunction } from "react-router-dom";
import { setLoader, getKitInfo } from "../../redux/action";
import {
  setKitType,
  setPage,
  setPerPage,
  setSearchText,
  setSortColumn,
} from "../../redux/slices/manage-inventory";
import { AppDispatch } from "../../redux/store"; // Import AppDispatch if required
import { FetchKitDetailsParams } from "../../types/manage-inventory.type";
import { MANAGE_INVENTORY_APP_URL } from "../../constants/appUrl";

export const fetchAllKitDetails = async (
  dispatch: AppDispatch,
  {
    currentPage,
    sort,
    sortColumn,
    searchText,
    type,
    perPage,
  }: FetchKitDetailsParams
) => {
  try {
    await dispatch(setLoader(true));
    await dispatch(setPage(currentPage));
    await dispatch(setPerPage(perPage));
    await dispatch(setSortColumn(sortColumn));
    await dispatch(setSearchText(searchText));
    await dispatch(setKitType(type));

    await dispatch(
      getKitInfo({
        page: currentPage,
        per_page: perPage,
        sort,
        sort_column: sortColumn,
        search_text: searchText,
        type,
      })
    );
  } catch (err) {
    console.error("Error getting kit details:", err);
  } finally {
    await dispatch(setLoader(false));
  }
};

export const handleFetchAllKitDetails = (
  dispatch: AppDispatch,
  params: FetchKitDetailsParams,
  navigate: NavigateFunction,
  location: Location
) => {
  updateQueryParams(navigate, params, location); // Update query params
  fetchAllKitDetails(dispatch, params); // Fetch data
};

export const updateQueryParams = (
  navigate: NavigateFunction,
  params: FetchKitDetailsParams,
  location: Location
) => {
  navigate({
    pathname: MANAGE_INVENTORY_APP_URL,
    search: `?currentPage=${String(params.currentPage)}&sort=${
      params.sort
    }&sortColumn=${params.sortColumn}&searchText=${params.searchText}&type=${
      params.type
    }&perPage=${String(params.perPage)}`,
  }, { replace: false }); 
};

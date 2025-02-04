import { Location, NavigateFunction } from "react-router-dom";
import { fetchKitRegister, setLoader } from "../../redux/action";
import { AppDispatch } from "../../redux/store";
import { IFetchPostOrdersDetailsParams } from "../../types/manage-post-order.type";
import { MANAGE_POST_BACK_ORDERS_APP_URL } from "../../constants/appUrl";

export const handleFetchAllKitRegisterDetails = (
  dispatch: AppDispatch,
  params: IFetchPostOrdersDetailsParams,
  navigate: NavigateFunction,
  location: Location
) => {
  updateQueryParams(navigate, params, location); // Update query params
  fetchKitRegisterList(dispatch, params); // Fetch data
};

export const updateQueryParams = (
  navigate: NavigateFunction,
  params: IFetchPostOrdersDetailsParams,
  location: Location
) => {
  navigate(
    {
      pathname: MANAGE_POST_BACK_ORDERS_APP_URL,
      search: `?currentPage=${String(params.currentPage)}&sort=${
        params.sort
      }&sortColumn=${params.sortColumn}&searchText=${
        params.searchText
      }&status=${params.status}&perPage=${String(params.perPage)}`,
    },
    { replace: false }
  );
};

export const fetchKitRegisterList = async (
  dispatch: AppDispatch,
  params: IFetchPostOrdersDetailsParams
): Promise<void> => {
  try {
    await dispatch(setLoader(true));
    await dispatch(
      fetchKitRegister({
        page: params.currentPage,
        per_page: params.perPage,
        sort: params.sort,
        sort_column: params.sortColumn,
        search_text: params.searchText,
        status: params.status,
      })
    );
  } catch (error) {
    console.error("Error fetching staff details:", error);
  } finally {
    await dispatch(setLoader(false));
  }
};

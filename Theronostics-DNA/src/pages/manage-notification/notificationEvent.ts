// event.ts
import { Location, NavigateFunction } from "react-router-dom";
import { fetchNotificationList, setLoader } from "../../redux/action";
import { AppDispatch } from "../../redux/store";
import { LoadNotificationParams } from "../../types/notification.type";
import { NOTIFICATION_APP_URL } from "../../constants/appUrl";

export const handleFetchAllNotificationDetails = (
  dispatch: AppDispatch,
  params: LoadNotificationParams,
  navigate: NavigateFunction,
  location: Location
) => {
  updateQueryParams(navigate, params, location); // Update query params
  loadNotificationDetails(params, dispatch); // Fetch data
};

export const updateQueryParams = (
  navigate: NavigateFunction,
  params: LoadNotificationParams,
  location: Location
) => {
  navigate(
    {
      pathname: NOTIFICATION_APP_URL,
      search: `?currentPage=${String(params.currentPage)}&sort=${
        params.sort
      }&sortColumn=${params.sortColumn}&searchText=${params.searchText}&type=${
        params.type
      }&perPage=${String(params.perPage)}&isRead=${String(
        params.isRead
      )}&startDate=${String(params.startDate)}&endDate=${String(
        params.endDate
      )}`,
    },
    { replace: false }
  );
};

export const loadNotificationDetails = async (
  params: LoadNotificationParams,
  dispatch: AppDispatch
) => {
  const {
    currentPage,
    sort,
    sortColumn,
    searchText,
    isRead,
    perPage,
    type,
    startDate,
    endDate,
  } = params;

  try {
    dispatch(setLoader(true));
    await dispatch(
      fetchNotificationList({
        page: currentPage,
        per_page: perPage,
        sort,
        sort_column: sortColumn,
        search_text: searchText,
        is_read: isRead,
        type,
        start_date: startDate,
        end_date: endDate,
      })
    );
  } catch (error) {
    console.error("Error fetching notification details:", error);
  } finally {
    dispatch(setLoader(false));
  }
};

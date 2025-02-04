import { FetchOrderDetailsParams } from "../../types/manage-order.type";
import {
  getAdminOrderList,
  setLoader,
  updateAdminOrderStatus,
} from "../../redux/action";
import { AppDispatch } from "../../redux/store";
import { NavigateFunction } from "react-router-dom";
import { MANAGE_ORDER_APP_URL } from "../../constants/appUrl";

export const handleFetchAllOrderDetails = async (
  dispatch: AppDispatch,
  params: FetchOrderDetailsParams,
  navigate: NavigateFunction,
  location: any
) => {
  await fetchAllOrderDetails(dispatch, params, location); // Fetch data
  updateQueryParams(dispatch, navigate, params, location); // Update query params
};

export const updateQueryParams = (
  dispatch: AppDispatch,
  navigate: NavigateFunction,
  params: FetchOrderDetailsParams,
  location: Location
) => {
  navigate(
    {
      pathname: MANAGE_ORDER_APP_URL,
      search: `?currentPage=${String(params.currentPage)}&sort=${
        params.sort
      }&sortColumn=${params.sortColumn}&searchText=${
        params.searchText
      }&orderStatus=${params.orderStatus}&paymentStatus=${
        params.paymentStatus
      }&perPage=${String(params.perPage)}`,
    },
    { replace: false }
  );
};

/**
 * Fetch all order details
 * @param dispatch - Redux dispatch function
 * @param params - Fetch parameters
 */
export const fetchAllOrderDetails = async (
  dispatch: AppDispatch,
  params: FetchOrderDetailsParams,
  location: Location
): Promise<void> => {
  try {
    dispatch(setLoader(true));
    await dispatch(
      getAdminOrderList({
        page: params.currentPage,
        per_page: params.perPage,
        sort: params.sort,
        sort_column: params.sortColumn,
        search_text: params.searchText,
        payment_status: params.paymentStatus,
        order_status: params.orderStatus,
      })
    );
  } catch (err) {
    console.error("Error getting order details:", err);
  } finally {
    dispatch(setLoader(false));
  }
};

export const getBadgeVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "success";
    case "pending":
      return "warning";
    case "failed":
      return "danger";
    case "processing":
      return "info"; // Blue for processing
    case "cancelled":
      return "danger"; // Red for cancelled
    case "dispatched":
      return "primary"; // Dark Blue for dispatched
    case "shipped":
      return "success"; // Green for shipped
    case "delivered":
      return "success"; // Green for delivered
    default:
      return "secondary";
  }
};

export const getOrderStatusBadgeVariant = (status: string): string => {
  switch (status.toLowerCase()) {
    case "pending":
      return "warning"; // Yellow for pending
    case "processing":
      return "info"; // Blue for processing
    case "cancelled":
      return "danger"; // Red for cancelled
    case "dispatched":
      return "primary"; // Dark Blue for dispatched
    case "shipped":
      return "success"; // Green for shipped
    case "delivered":
      return "success"; // Green for delivered
    default:
      return "secondary"; // Grey for unknown statuses
  }
};

export const refreshOrderList = (
  dispatch: AppDispatch,
  params: {
    currentPage: number;
    sort: string;
    sortColumn: string;
    searchText: string;
    perPage: number;
    paymentStatus: string;
    orderStatus: string;
  },
  navigate: NavigateFunction,
  location: any
) => {
  return handleFetchAllOrderDetails(dispatch, params, navigate, location);
};

export const handleStatusChange = async (
  dispatch: AppDispatch,
  orderID: string,
  newStatus: string,
  trackingID: string,
  currentParams: {
    page: number;
    sort: string;
    sortColumn: string;
    searchText: string;
    perPage: number;
    paymentStatus: string;
    orderStatus: string;
  },
  navigate: NavigateFunction,
  location: any
) => {
  try {
    await dispatch(setLoader(true));
    await dispatch(
      updateAdminOrderStatus(
        { status: newStatus, tracking_id: trackingID },
        orderID
      )
    );
    // await refreshOrderList(
    //   dispatch,
    //   {
    //     currentPage: currentParams.page,
    //     sort: currentParams.sort,
    //     sortColumn: currentParams.sortColumn,
    //     searchText: currentParams.searchText,
    //     perPage: currentParams.perPage,
    //     paymentStatus: currentParams.paymentStatus,
    //     orderStatus: currentParams.orderStatus,
    //   },
    //   navigate,
    //   location
    // );
    navigate(
      {
        pathname: MANAGE_ORDER_APP_URL,
        search: `?currentPage=1&sort=${"desc"}&sortColumn=${"created_at"}&searchText=${""}&orderStatus=${"dispatched"}&paymentStatus=${"completed"}&perPage=${String(
          10
        )}`,
      },
      { replace: false }
    );
  } catch (err) {
    console.error("Error updating user status:", err);
  } finally {
    await dispatch(setLoader(false));
  }
};

export const handleSort = (
  dispatch: AppDispatch,
  column: string,
  currentSort: string,
  params: {
    page: number;
    searchText: string;
    perPage: number;
    paymentStatus: string;
    orderStatus: string;
  },
  navigate: NavigateFunction,
  location: any
) => {
  const newDirection = currentSort === "asc" ? "desc" : "asc";
  handleFetchAllOrderDetails(
    dispatch,
    {
      currentPage: params.page,
      sort: newDirection,
      sortColumn: column,
      searchText: params.searchText,
      perPage: params.perPage,
      paymentStatus: params.paymentStatus,
      orderStatus: params.orderStatus,
    },
    navigate,
    location
  );
};

export const handlePageChange = (
  dispatch: AppDispatch,
  selectedItem: { selected: number },
  params: {
    sort: string;
    sortColumn: string;
    searchText: string;
    perPage: number;
    paymentStatus: string;
    orderStatus: string;
  },
  navigate: NavigateFunction,
  location: any
) => {
  handleFetchAllOrderDetails(
    dispatch,
    {
      currentPage: selectedItem.selected + 1,
      sort: params.sort,
      sortColumn: params.sortColumn,
      searchText: params.searchText,
      perPage: params.perPage,
      paymentStatus: params.paymentStatus,
      orderStatus: params.orderStatus,
    },
    navigate,
    location
  );
};

export const handleSearch = (
  dispatch: AppDispatch,
  value: string,
  params: {
    sort: string;
    sortColumn: string;
    perPage: number;
    paymentStatus: string;
    orderStatus: string;
  },
  navigate: NavigateFunction,
  location: any
) => {
  handleFetchAllOrderDetails(
    dispatch,
    {
      currentPage: 1,
      sort: params.sort,
      sortColumn: params.sortColumn,
      searchText: value,
      perPage: params.perPage,
      paymentStatus: params.paymentStatus,
      orderStatus: params.orderStatus,
    },
    navigate,
    location
  );
};

export const handlePerPageFilter = (
  dispatch: AppDispatch,
  value: number,
  params: {
    page: number;
    sort: string;
    sortColumn: string;
    searchText: string;
    paymentStatus: string;
    orderStatus: string;
  },
  navigate: NavigateFunction,
  location: any
) => {
  handleFetchAllOrderDetails(
    dispatch,
    {
      currentPage: 1,
      sort: params.sort,
      sortColumn: params.sortColumn,
      searchText: params.searchText,
      perPage: value,
      paymentStatus: params.paymentStatus,
      orderStatus: params.orderStatus,
    },
    navigate,
    location
  );
};

export const handleOrderStatusFilter = (
  dispatch: AppDispatch,
  value: string,
  params: {
    page: number;
    perPage: number;
    sort: string;
    sortColumn: string;
    searchText: string;
    paymentStatus: string;
  },
  navigate: NavigateFunction,
  location: any
) => {
  handleFetchAllOrderDetails(
    dispatch,
    {
      currentPage: 1,
      sort: params.sort,
      sortColumn: params.sortColumn,
      searchText: params.searchText,
      perPage: params.perPage,
      paymentStatus: params.paymentStatus,
      orderStatus: value,
    },
    navigate,
    location
  );
};

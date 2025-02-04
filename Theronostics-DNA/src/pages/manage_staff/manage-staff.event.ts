import { AppDispatch } from "../../redux/store";
import {
  getAdminUserList,
  setLoader,
  createAdminUser,
  updateAdminUserStatus,
  updateAdminUserProfile,
  updateAdminUserPassword,
  deleteAdminUser,
  closeModal,
} from "../../redux/action";
import {
  IFetchStaffDetailsParams,
  IStaffFormField,
} from "../../types/manage-staff.types";
import { validateForm } from "../../utils/validation/validationUtils";
import { SuccessMessageInterface } from "../../types/redux.type";
import { NavigateFunction } from "react-router-dom";
import { MANAGE_STAFF_APP_URL } from "../../constants/appUrl";
import {
  setPage,
  setPerPage,
  setSearchText,
  setSortColumn,
} from "../../redux/slices/manage-staff";

export const handleFetchAllStaffDetails = (
  dispatch: AppDispatch,
  params: IFetchStaffDetailsParams,
  navigate: NavigateFunction,
  location: any
) => {
  updateQueryParams(navigate, params, location); // Update query params
  fetchAllStaffDetails(dispatch, params); // Fetch data
};

export const updateQueryParams = (
  navigate: NavigateFunction,
  params: IFetchStaffDetailsParams,
  location: Location
) => {
  navigate(
    {
      pathname: MANAGE_STAFF_APP_URL,
      search: `?currentPage=${String(params.currentPage)}&sort=${
        params.sort
      }&sortColumn=${params.sortColumn}&searchText=${
        params.searchText
      }&status=${params.status}&perPage=${String(params.perPage)}`,
    },
    { replace: false }
  );
};

export const fetchAllStaffDetails = async (
  dispatch: AppDispatch,
  params: IFetchStaffDetailsParams
): Promise<void> => {
  try {
    await dispatch(setLoader(true));
    await dispatch(setPage(params.currentPage));
    await dispatch(setPerPage(params.perPage));
    await dispatch(setSortColumn(params.sortColumn));
    await dispatch(setSearchText(params.searchText));
    await dispatch(
      getAdminUserList({
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

export const handleStaffStatusChange = async (
  dispatch: AppDispatch,
  userId: string,
  newStatus: boolean,
  getData: any,
  navigate: NavigateFunction,
  location: any
) => {
  try {
    await dispatch(setLoader(true));
    await dispatch(updateAdminUserStatus({ active_status: newStatus }, userId));
    await handleFetchAllStaffDetails(
      dispatch,
      {
        currentPage: getData.currentPage,
        sort: getData.sort,
        sortColumn: getData.sortColumn,
        searchText: getData.searchText,
        status: getData.status,
        perPage: getData.perPage,
      },
      navigate,
      location
    );
  } catch (err) {
    console.error("Error updating user status:", err);
  } finally {
    await dispatch(setLoader(false));
  }
};

export const handleStaffCreation = async (
  dispatch: AppDispatch,
  formState: Record<string, string>,
  userFormFields: IStaffFormField[],
  setErrorState: any,
  getData: any,
  navigate: NavigateFunction,
  location: any
) => {
  const validationErrors = validateForm(formState, userFormFields);

  if (Object.keys(validationErrors).length > 0) {
    setErrorState((prevErrors: any) => ({
      ...prevErrors,
      ...validationErrors,
    }));
    return;
  }

  try {
    await dispatch(setLoader(true));
    await dispatch(
      createAdminUser(formState, async (response: SuccessMessageInterface) => {
        if (response.success) {
          dispatch(closeModal());
        }
      })
    );
    await handleFetchAllStaffDetails(
      dispatch,
      {
        currentPage: 1,
        sort: "desc",
        sortColumn: "created_at",
        searchText: "",
        status: "all",
        perPage: getData.perPage,
      },
      navigate,
      location
    );
    return {};
  } catch (err) {
    console.error("Error creating user:", err);
    return { general: "Failed to create user" };
  } finally {
    await dispatch(setLoader(false));
  }
};

export const handleStaffUpdate = async (
  dispatch: AppDispatch,
  formState: Record<string, string>,
  userFormFields: IStaffFormField[],
  userId: string,
  setErrorState: any,
  getData: any,
  navigate: NavigateFunction,
  location: any
) => {
  const validationErrors = validateForm(formState, userFormFields);

  if (Object.keys(validationErrors).length > 0) {
    setErrorState((prevErrors: any) => ({
      ...prevErrors,
      ...validationErrors,
    }));
    return;
  }

  try {
    await dispatch(setLoader(true));
    await dispatch(
      updateAdminUserProfile(
        {
          first_name: formState.first_name,
          last_name: formState.last_name,
          email: formState.email,
        },
        userId,
        async (response: SuccessMessageInterface) => {
          if (response.success) {
            dispatch(closeModal());
          }
        }
      )
    );
    await handleFetchAllStaffDetails(
      dispatch,
      {
        currentPage: getData.currentPage,
        sort: getData.sort,
        sortColumn: getData.sortColumn,
        searchText: getData.searchText,
        status: getData.status,
        perPage: getData.perPage,
      },
      navigate,
      location
    );
    return {};
  } catch (err) {
    console.error("Error updating user:", err);
    return { general: "Failed to update user" };
  } finally {
    await dispatch(setLoader(false));
  }
};

export const handleStaffPasswordChange = async (
  dispatch: AppDispatch,
  formPasswordState: Record<string, string>,
  passwordFormFields: IStaffFormField[],
  userId: string,
  setErrorPasswordState: any,
  getData: any,
  navigate: NavigateFunction,
  location: any
) => {
  const validationErrors = validateForm(formPasswordState, passwordFormFields);

  if (Object.keys(validationErrors).length > 0) {
    setErrorPasswordState((prevErrors: any) => ({
      ...prevErrors,
      ...validationErrors,
    }));
    return;
  }

  try {
    await dispatch(setLoader(true));
    await dispatch(closeModal());
    await dispatch(
      updateAdminUserPassword(
        {
          password: formPasswordState.new_password,
        },
        userId
      )
    );
    await handleFetchAllStaffDetails(
      dispatch,
      {
        currentPage: getData.currentPage,
        sort: getData.sort,
        sortColumn: getData.sortColumn,
        searchText: getData.searchText,
        status: getData.status,
        perPage: getData.perPage,
      },
      navigate,
      location
    );
    return {};
  } catch (err) {
    console.error("Error changing password:", err);
    return { general: "Failed to change password" };
  } finally {
    await dispatch(setLoader(false));
  }
};

export const handleStaffDeletion = async (
  dispatch: AppDispatch,
  userId: string,
  getData: any,
  navigate: NavigateFunction,
  location: any,
  records: any
) => {
  try {
    await dispatch(setLoader(true));
    await dispatch(closeModal());
    await dispatch(
      deleteAdminUser({
        user_id: userId,
      })
    );
    await handleFetchAllStaffDetails(
      dispatch,
      {
        currentPage: records && records.length > 1  ? getData.currentPage : getData.currentPage - 1,
        sort: getData.sort,
        sortColumn: getData.sortColumn,
        searchText: getData.searchText,
        status: getData.status,
        perPage: getData.perPage,
      },
      navigate,
      location
    );
  } catch (err) {
    console.error("Error deleting user:", err);
  } finally {
    await dispatch(setLoader(false));
  }
};

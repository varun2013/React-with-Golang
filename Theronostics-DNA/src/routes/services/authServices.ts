import {
  clearLocalStorageData,
  getLocalStorageData,
} from "../../utils/storage/localStorageUtils";

// Function for checking if the user is logged in
export const isLoggedIn = (): boolean => {
  const tokenData = getLocalStorageData("token");

  if (tokenData) {
    return true;
  } else {
    clearLocalStorageData("token");

    return false;
  }
};

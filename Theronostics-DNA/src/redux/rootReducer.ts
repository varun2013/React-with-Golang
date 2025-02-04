import { combineReducers } from "@reduxjs/toolkit";
import loaderReducer from "./slices/loader";
import authReducer from "./slices/auth";
import themeReducer from "./slices/theme";
import manageStaffReducer from "./slices/manage-staff";
import modalReducer from "./slices/modal";
import manageInventoryReducer from "./slices/manage-inventory";
import manageCustomerReducer from "./slices/manage-customer";
import manageCustomerOrderReducer from "./slices/manage-customer-order-details";
import manageOrderReducer from "./slices/manage-order";
import manageProductReducer from "./slices/manage-product";
import notificationReducer from "./slices/notification";
import manageQuantityDiscountReducer from "./slices/manageQuantityDiscount";
import kitRegisterReducer from "./slices/kit-register";
import globalSearchReducer from "./slices/global-search";
import manageLabReducer from "./slices/manage-labs";
import { GLOBAL_ACTIONS } from "../types/redux.type";

const appReducer = combineReducers({
  loader: loaderReducer,
  auth: authReducer,
  theme: themeReducer,
  manageStaff: manageStaffReducer,
  manageInventory: manageInventoryReducer,
  manageCustomer: manageCustomerReducer,
  manageCustomerOrder: manageCustomerOrderReducer,
  manageOrder: manageOrderReducer,
  modal: modalReducer,
  manageProduct: manageProductReducer,
  notification: notificationReducer,
  manageQuantityDiscount: manageQuantityDiscountReducer,
  kitRegister: kitRegisterReducer,
  globalSearch: globalSearchReducer,
  manageLabs: manageLabReducer,
});

type RootState = ReturnType<typeof appReducer>;

const rootReducer = (state: RootState | undefined, action: any): RootState => {
  switch (action.type) {
    case GLOBAL_ACTIONS.RESET_STATE:
      return appReducer({ theme: state?.theme } as RootState, action);

    case GLOBAL_ACTIONS.RESET_FILTER:
      return appReducer(
        {
          theme: state?.theme,
          auth: state?.auth,
          notification: state?.notification,
        } as RootState,
        action
      );

    default:
      return appReducer(state, action);
  }
};

export default rootReducer;

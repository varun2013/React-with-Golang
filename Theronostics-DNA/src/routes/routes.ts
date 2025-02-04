import { RouteConfig } from "../types/route.type";
import {
  CUSTOMER_DETAILS_APP_URL,
  FORGET_PASSWORD_APP_URL,
  HELP_APP_URL,
  KIT_REGISTER_APP_URL,
  LOGIN_APP_URL,
  MAIN_SECTION_APP_URL,
  MANAGE_CUSTOMER_APP_URL,
  MANAGE_INVENTORY_APP_URL,
  MANAGE_ORDER_APP_URL,
  MANAGE_POST_BACK_ORDERS_APP_URL,
  MANAGE_PROFILE_APP_URL,
  MANAGE_STAFF_APP_URL,
  NOTIFICATION_APP_URL,
  PAYMENT_STATUS_APP_URL,
  PRODUCT_DETAILS_APP_URL,
  SINGLE_PRODUCT_APP_URL,
} from "../constants/appUrl";
import {
  CUSTOMER_DETAILS_APP_COMPONENT,
  FORGET_PASSWORD_APP_COMPONENT,
  HELP_APP_COMPONENT,
  KIT_REGISTER_APP_COMPONENT,
  LOGIN_APP_COMPONENT,
  MAIN_SECTION_APP_COMPONENT,
  MANAGE_CUSTOMER_APP_COMPONENT,
  MANAGE_INVENTORY_APP_COMPONENT,
  MANAGE_ORDER_APP_COMPONENT,
  MANAGE_POST_BACK_ORDERS_APP_COMPONENT,
  MANAGE_PROFILE_APP_COMPONENT,
  MANAGE_STAFF_APP_COMPONENT,
  NOTIFICATION_APP_COMPONENT,
  PAYMENT_STATUS_APP_COMPONENT,
  PRODUCT_DETAILS_APP_COMPONENT,
  SINGLE_PRODUCT_APP_COMPONENT,
} from "../constants/componentUrls";

export const publicRoutes: RouteConfig[] = [
  {
    path: LOGIN_APP_URL,
    component: LOGIN_APP_COMPONENT,
    exact: true,
  },
  {
    path: FORGET_PASSWORD_APP_URL,
    component: FORGET_PASSWORD_APP_COMPONENT,
    exact: true,
  },
];

export const productPublicRoutes: RouteConfig[] = [
  {
    path: MAIN_SECTION_APP_URL,
    component: MAIN_SECTION_APP_COMPONENT,
    exact: true,
  },
  {
    path: SINGLE_PRODUCT_APP_URL,
    component: SINGLE_PRODUCT_APP_COMPONENT,
    exact: true,
  },
  {
    path: PRODUCT_DETAILS_APP_URL,
    component: PRODUCT_DETAILS_APP_COMPONENT,
    exact: true,
  },
  {
    path: PAYMENT_STATUS_APP_URL,
    component: PAYMENT_STATUS_APP_COMPONENT,
    exact: true,
  },
];

export const kitPublicRoute: RouteConfig[] = [
  {
    path: KIT_REGISTER_APP_URL,
    component: KIT_REGISTER_APP_COMPONENT,
    exact: true,
  },
  {
    path: HELP_APP_URL,
    component: HELP_APP_COMPONENT,
    exact: true,
  },
];
export const privateRoutes: RouteConfig[] = [
  {
    path: MANAGE_PROFILE_APP_URL,
    component: MANAGE_PROFILE_APP_COMPONENT,
    exact: true,
    roles: ["super-admin", "admin", "user"],
  },
  {
    path: MANAGE_STAFF_APP_URL,
    component: MANAGE_STAFF_APP_COMPONENT,
    exact: true,
    roles: ["super-admin"],
  },
  {
    path: MANAGE_INVENTORY_APP_URL,
    component: MANAGE_INVENTORY_APP_COMPONENT,
    exact: true,
    roles: ["super-admin", "admin", "user"],
  },
  {
    path: MANAGE_CUSTOMER_APP_URL,
    component: MANAGE_CUSTOMER_APP_COMPONENT,
    exact: true,
    roles: ["super-admin", "admin", "user"],
  },
  {
    path: CUSTOMER_DETAILS_APP_URL,
    component: CUSTOMER_DETAILS_APP_COMPONENT,
    exact: true,
    roles: ["super-admin", "admin", "user"],
  },
  {
    path: MANAGE_ORDER_APP_URL,
    component: MANAGE_ORDER_APP_COMPONENT,
    exact: true,
    roles: ["super-admin", "admin", "user"],
  },
  {
    path: NOTIFICATION_APP_URL,
    component: NOTIFICATION_APP_COMPONENT,
    exact: true,
    roles: ["super-admin", "admin", "user"],
  },
  {
    path: MANAGE_POST_BACK_ORDERS_APP_URL,
    component: MANAGE_POST_BACK_ORDERS_APP_COMPONENT,
    exact: true,
    roles: ["super-admin", "admin", "user"],
  },
];

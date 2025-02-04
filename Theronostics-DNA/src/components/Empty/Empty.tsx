import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import {
  LOGIN_APP_URL,
  MANAGE_PROFILE_APP_URL,
  FORGET_PASSWORD_APP_URL,
  MAIN_SECTION_APP_URL,
  SINGLE_PRODUCT_APP_URL,
  PRODUCT_DETAILS_APP_URL,
  PAYMENT_STATUS_APP_URL,
  MANAGE_STAFF_APP_URL,
  MANAGE_INVENTORY_APP_URL,
  MANAGE_CUSTOMER_APP_URL,
  CUSTOMER_DETAILS_APP_URL,
  MANAGE_ORDER_APP_URL,
  NOTIFICATION_APP_URL,
  KIT_REGISTER_APP_URL,
  MANAGE_POST_BACK_ORDERS_APP_URL,
  HELP_APP_URL,
} from "../../constants/appUrl";
import { isLoggedIn } from "../../routes/services/authServices";

const Empty: React.FC = () => {
  const location = useLocation();
  const userLoggedIn = isLoggedIn();
  const matches = [
    LOGIN_APP_URL,
    FORGET_PASSWORD_APP_URL,
    MANAGE_PROFILE_APP_URL,
    MANAGE_STAFF_APP_URL,
    MANAGE_CUSTOMER_APP_URL,
    CUSTOMER_DETAILS_APP_URL,
    MANAGE_ORDER_APP_URL,
    MANAGE_INVENTORY_APP_URL,
    MAIN_SECTION_APP_URL,
    SINGLE_PRODUCT_APP_URL,
    PRODUCT_DETAILS_APP_URL,
    PAYMENT_STATUS_APP_URL,
    NOTIFICATION_APP_URL,
    KIT_REGISTER_APP_URL,
    MANAGE_POST_BACK_ORDERS_APP_URL,
    HELP_APP_URL,
  ];

  if (matches.includes(location.pathname)) {
    return null;
  }

  return userLoggedIn ? (
    <Navigate to={MANAGE_INVENTORY_APP_URL} />
  ) : (
    <Navigate to={LOGIN_APP_URL} />
  );
};

export default Empty;

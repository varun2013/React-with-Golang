import React from "react";

export const LOGIN_APP_COMPONENT = React.lazy(() => import("../pages/login"));
export const FORGET_PASSWORD_APP_COMPONENT = React.lazy(
  () => import("../pages/forgot-password")
);
export const MANAGE_PROFILE_APP_COMPONENT = React.lazy(
  () => import("../pages/manage_profile")
);
export const MANAGE_STAFF_APP_COMPONENT = React.lazy(
  () => import("../pages/manage_staff")
);
export const MANAGE_INVENTORY_APP_COMPONENT = React.lazy(
  () => import("../pages/manage_inventory")
);
export const MANAGE_CUSTOMER_APP_COMPONENT = React.lazy(
  () => import("../pages/manage_customer")
);
export const CUSTOMER_DETAILS_APP_COMPONENT = React.lazy(
  () => import("../pages/customer_details_page")
);
export const MANAGE_ORDER_APP_COMPONENT = React.lazy(
  () => import("../pages/manage_order")
);
export const NOTIFICATION_APP_COMPONENT = React.lazy(
  () => import("../pages/manage-notification")
);

export const MAIN_SECTION_APP_COMPONENT = React.lazy(
  () => import("../pages/product-page")
);

export const SINGLE_PRODUCT_APP_COMPONENT = React.lazy(
  () => import("../pages/product-details-page")
);
export const PRODUCT_DETAILS_APP_COMPONENT = React.lazy(
  () => import("../pages/product-register-page")
);
export const PAYMENT_STATUS_APP_COMPONENT = React.lazy(
  () => import("../pages/payment_status_page")
);
export const KIT_REGISTER_APP_COMPONENT = React.lazy(
  () => import("../pages/kit-register-page")
);
export const MANAGE_POST_BACK_ORDERS_APP_COMPONENT = React.lazy(
  () => import("../pages/manage-post-back-orders")
);
export const HELP_APP_COMPONENT = React.lazy(
  () => import("../pages/help")
);
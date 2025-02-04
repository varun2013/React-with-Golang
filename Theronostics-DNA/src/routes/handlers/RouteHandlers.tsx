import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isLoggedIn } from "../services/authServices";
import { MANAGE_INVENTORY_APP_URL, LOGIN_APP_URL } from "../../constants/appUrl";

export const LoginRouteHandler: React.FC = () => {
  const userLoggedIn = isLoggedIn();
  if (!userLoggedIn) {
    return <Navigate to={LOGIN_APP_URL} replace />;
  } else {
    return <Navigate to={MANAGE_INVENTORY_APP_URL} replace />;
  }
};

export const PrivateRouteHandler: React.FC = () => {
  const userLoggedIn = isLoggedIn();
  return userLoggedIn ? <Outlet /> : <Navigate to={LOGIN_APP_URL} replace />;
};

export const PublicRouteHandler: React.FC = () => {
  const userLoggedIn = isLoggedIn();
  return !userLoggedIn ? (
    <Outlet />
  ) : (
    <Navigate to={MANAGE_INVENTORY_APP_URL} replace />
  );
};

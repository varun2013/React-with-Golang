import { Suspense, useEffect } from "react";
import { useAppSelector } from "../redux/hooks";
import { RootState } from "../redux/store";
import Loader from "../components/common/loader/Loader";
import { Route, Routes } from "react-router-dom";
import {
  kitPublicRoute,
  privateRoutes,
  productPublicRoutes,
  publicRoutes,
} from "./routes";
import ProductPublicTemplate from "./templates/public_product_route.template";
import {
  PrivateRouteHandler,
  PublicRouteHandler,
} from "./handlers/RouteHandlers";
import { MANAGE_INVENTORY_APP_URL, LOGIN_APP_URL } from "../constants/appUrl";
import PublicTemplate from "./templates/public_route.template";
import {
  LOGIN_APP_COMPONENT,
  MANAGE_INVENTORY_APP_COMPONENT,
} from "../constants/componentUrls";
import Template from "./templates/private_route.template";
import Empty from "../components/Empty/Empty";
import KitPublicTemplate from "./templates/public_kit_route.template";

const AllRoutes: React.FC = () => {
  // const userLoggedIn = isLoggedIn();
  const currentTheme = useAppSelector((state: RootState) => state.theme.theme);

  // Function to toggle between light and dark theme
  const toggleTheme = async () => {
    document.documentElement.setAttribute("data-bs-theme", currentTheme);
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      themeColorMeta.setAttribute("content", currentTheme === "dark" ? "#ffffff" : "#282828");
    }
  };

  useEffect(() => {
    toggleTheme();
    // eslint-disable-next-line
  }, []);
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {productPublicRoutes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={
              <ProductPublicTemplate>
                <route.component />
              </ProductPublicTemplate>
            }
          />
        ))}
        {kitPublicRoute.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={
              <KitPublicTemplate>
                <route.component />
              </KitPublicTemplate>
            }
          />
        ))}
        {/* <Route element={<LoginRouteHandler />}>
          <Route
            path="/"
            element={
              !userLoggedIn ? (
                <PublicTemplate>
                  <LOGIN_APP_COMPONENT />
                </PublicTemplate>
              ) : (
                <Template>
                  <DASHBOARD_APP_COMPONENT />
                </Template>
              )
            }
          />
        </Route>
         */}

        <Route element={<PublicRouteHandler />}>
          <Route
            path={LOGIN_APP_URL}
            element={
              <PublicTemplate>
                <LOGIN_APP_COMPONENT />
              </PublicTemplate>
            }
          />
          {publicRoutes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={
                <PublicTemplate>
                  <route.component />
                </PublicTemplate>
              }
            />
          ))}
        </Route>

        <Route element={<PrivateRouteHandler />}>
          <Route
            path={MANAGE_INVENTORY_APP_URL}
            element={
              <Template>
                <MANAGE_INVENTORY_APP_COMPONENT />
              </Template>
            }
          />
          {privateRoutes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={
                <Template rolePermission={route.roles}>
                  <route.component />
                </Template>
              }
            />
          ))}
        </Route>

        <Route path="*" element={<Empty />} />
      </Routes>
    </Suspense>
  );
};

export default AllRoutes;

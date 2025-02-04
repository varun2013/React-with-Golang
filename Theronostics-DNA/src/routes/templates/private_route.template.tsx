import { TemplateProps } from "../../types/route.type";
import { RootState } from "../../redux/store";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  fetchOrderStatusCount,
  getKitQuantitySummary,
  getUserDetails,
  resetFilter,
  setLoader,
} from "../../redux/action";
import flashMessage from "../../utils/notifications/antdMessageUtils";
import { clearLocalStorageData } from "../../utils/storage/localStorageUtils";
import { MANAGE_INVENTORY_APP_URL, LOGIN_APP_URL } from "../../constants/appUrl";
import Loader from "../../components/common/loader/Loader";
import Sidebar from "../../components/layouts/private/sidebar.component";
import Header from "../../components/layouts/private/navbar.component";
import Footer from "../../components/layouts/private/footer.component";

const Template: React.FC<TemplateProps> = ({ children, rolePermission }) => {
  const loading = useAppSelector((state: RootState) => state.loader.loader);
  const currentTheme = useAppSelector((state: RootState) => state.theme.theme);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAppSelector((state: RootState) => state.auth.user);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleFetchUserDetails = async () => {
    try {
      await dispatch(setLoader(true));
      await dispatch(
        getUserDetails({}, async (response: any) => {
          await dispatch(setLoader(false));
          if (response && response?.status_code === 401) {
            flashMessage(response.message, "error");
            clearLocalStorageData("token");
            navigate(LOGIN_APP_URL);
          } else {
          }
        })
      );
      await dispatch(getKitQuantitySummary({}));
      await dispatch(fetchOrderStatusCount());

    } catch (err) {
      console.error("Error fetching user details:", err);
    } finally {
      await dispatch(setLoader(false));
    }
  };

  useEffect(() => {
    handleFetchUserDetails();
    return () => {
      dispatch(resetFilter());
    };

    // eslint-disable-next-line
  }, [location.pathname]);

  if (user && rolePermission) {
    const userRole = user.role.name;

    // Check if the user's role is in the rolePermission array
    if (!rolePermission.includes(userRole)) {
      navigate(MANAGE_INVENTORY_APP_URL);
    }
  }

  return (
    <div className={`template-container ${currentTheme}`}>
      {loading && <Loader />}

      <div className="content-wrapper">
        <Sidebar
          collapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
        />

        <main className={`main-content ${sidebarCollapsed ? "expanded" : ""}`}>
          <Header toggleSidebar={toggleSidebar} />
          <div className="content py-4 px-3 main-component">{children}</div>
          <Footer sidebarCollapsed={sidebarCollapsed} />
        </main>
      </div>
    </div>
  );
};

export default Template;

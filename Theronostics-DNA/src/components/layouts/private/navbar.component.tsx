import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";
import { HeaderProps } from "../../../types/layouts.type";
import {
  fetchLatestNotificationList,
  fetchOrderStatusCount,
  getKitQuantitySummary,
  logoutUser,
  resetState,
  setLoader,
  setTheme,
} from "../../../redux/action";
import { SuccessMessageInterface } from "../../../types/redux.type";
import { clearLocalStorageData } from "../../../utils/storage/localStorageUtils";
import {
  LOGIN_APP_URL,
  MANAGE_INVENTORY_APP_URL,
  MANAGE_ORDER_APP_URL,
  MANAGE_PROFILE_APP_URL,
  MANAGE_STAFF_APP_URL,
  NOTIFICATION_APP_URL,
} from "../../../constants/appUrl";
import { useEffect, useState } from "react";
import humburgerIcon from "../../../assets/images/hamburger.svg";
import moonImage from "../../../assets/images/moon.svg";
import sunImage from "../../../assets/images/sun.svg";
import noAlarm from "../../../assets/images/no-alarm.svg";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faBoxOpen,
  faEnvelope,
  faHourglassHalf,
  faSignOutAlt,
  faTint,
  faTruck,
  faUser,
  faVial,
} from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "antd";
import moment from "moment";
import GlobalSearch from "../../features/globalSearch/global-search.component";

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const user = useAppSelector((state: RootState) => state.auth.user);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileNotifications, setShowMobileNotifications] = useState(false);

  const { latestNotifications, hasUnreadNotifications, totalUnreadEmails } =
    useAppSelector((state: RootState) => state.notification);
  const currentTheme = useAppSelector((state: RootState) => state.theme.theme);
  const { quantity } = useAppSelector(
    (state: RootState) => state.manageInventory
  );
  const { orderCounts } = useAppSelector(
    (state: RootState) => state.manageOrder
  );

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const toggleTheme = async () => {
    const newTheme: any = currentTheme === "dark" ? "light" : "dark";
    await dispatch(setTheme(newTheme));
    document.documentElement.setAttribute("data-bs-theme", newTheme);
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      themeColorMeta.setAttribute("content", newTheme === "dark" ? "#282828" : "#ffffff");
    }
  };

  const handleNotificationDropdown = () => {
    setShowNotifications(!showNotifications);
  };

  const handleMobileNotificationDropdown = () => {
    setShowMobileNotifications(!showMobileNotifications);
  };

  const handleLogout = async () => {
    try {
      await dispatch(setLoader(true));
      await dispatch(
        logoutUser({}, async (response: SuccessMessageInterface) => {
          await dispatch(setLoader(false));
          if (response.success) {
            await clearLocalStorageData("token");
            navigate(LOGIN_APP_URL);
            await dispatch(resetState());
          }
        })
      );
    } catch (err) {
      console.error("Error fetching website data:", err);
    } finally {
      await dispatch(setLoader(false));
    }
  };

  const handleProfile = () => {
    navigate(MANAGE_PROFILE_APP_URL);
  };

  const fetchLatestNotification = async () => {
    try {
      await dispatch(fetchLatestNotificationList({}));
      await dispatch(getKitQuantitySummary({}));
      await dispatch(fetchOrderStatusCount());
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  useEffect(() => {
    if (!latestNotifications || latestNotifications.length === 0) {
      fetchLatestNotification();
    }
    const intervalId = setInterval(() => {
      fetchLatestNotification();
    }, 5000);
    return () => clearInterval(intervalId);
    // eslint-disable-next-line
  }, []);

  const handleOrderNavigate = (value: string) => {
    navigate(
      {
        pathname: MANAGE_ORDER_APP_URL,
        search: `?currentPage=1&sort=${"desc"}&sortColumn=${"created_at"}&searchText=${""}&orderStatus=${value}&paymentStatus=${"completed"}&perPage=${String(
          10
        )}`,
      },
      { replace: false }
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const notificationMenu = document.querySelector(".notification-menu");
      const notificationIcon = document.querySelector(".notification-icon");
      if (
        notificationMenu &&
        !notificationMenu.contains(event.target as Node) &&
        notificationIcon &&
        !notificationIcon.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNotificationClick = (notification: any) => {
    if (!notification?.metadata?.module) return;

    switch (notification.metadata.module.toLowerCase()) {
      case "manage staff":
        navigate(
          {
            pathname: MANAGE_STAFF_APP_URL,
            search: `?currentPage=${String(
              1
            )}&sort=${"desc"}&sortColumn=${"created_at"}&searchText=${
              notification?.metadata?.email ?? ""
            }&status=${"all"}&perPage=${String(10)}`,
          },
          { replace: false }
        );
        break;

      case "manage inventory":
        navigate(
          {
            pathname: MANAGE_INVENTORY_APP_URL,
            search: `?currentPage=${String(
              1
            )}&sort=${"desc"}&sortColumn=${"created_at"}&searchText=${
              notification?.metadata?.created_by ?? ""
            }&type=${""}&perPage=${String(10)}`,
          },
          { replace: false }
        );
        break;

      case "manage orders":
        navigate(
          {
            pathname: MANAGE_ORDER_APP_URL,
            search: `?currentPage=${String(
              1
            )}&sort=${"desc"}&sortColumn=${"created_at"}&searchText=${
              notification?.metadata?.order_number ?? ""
            }&orderStatus=${
              notification?.metadata?.status ?? ""
            }&paymentStatus=${"completed"}&perPage=${String(10)}`,
          },
          { replace: false }
        );
        break;
    }
  };

  return (
    <>
      {/* Desktop Header */}
      <nav
        className={`navbar navbar-expand px-3 py-1 border-bottom header desktop-header ${
          currentTheme === "dark" ? "dark" : "light"
        }`}
      >
        <button
          className="btn"
          id="sidebar-toggle"
          type="button"
          onClick={toggleSidebar}
        >
          <img src={humburgerIcon} alt="humburger_icon" />
        </button>
        <GlobalSearch />
        <div className="navbar-collapse navbar">
          <ul className="navbar-nav ms-auto">
            {/* Profile Dropdown */}

            {/* Order Status Details Section */}
            <li className="nav-item quantity-details">
              <div className="quantity-container">
                {/* Pending Orders */}

                <Tooltip title={`Total Blood Kit`}>
                  <div className="quantity-item">
                    <FontAwesomeIcon icon={faTint} className="" />
                    <span>{quantity?.bloodQuantity}</span>
                  </div>
                </Tooltip>

                <Tooltip title={`Total Ordered Kit / Total Saliva Kit`}>
                  <div className="quantity-item">
                    <FontAwesomeIcon icon={faVial} className="" />
                    <span>
                      {orderCounts?.totalQunatity}/{quantity?.salivaQuantity}
                    </span>
                  </div>
                </Tooltip>

                <Tooltip title="Total Pending Orders">
                  <div
                    className="quantity-item order-status-header"
                    onClick={() => handleOrderNavigate("pending")}
                  >
                    <FontAwesomeIcon
                      icon={faHourglassHalf} // Icon for Pending
                      className="me-2" // Add color or style specific to status
                    />
                    <span>{orderCounts?.pending}</span>
                  </div>
                </Tooltip>

                {/* Ready for Dispatch Orders */}
                <Tooltip title="Total Processing Orders">
                  <div
                    className="quantity-item order-status-header"
                    onClick={() => handleOrderNavigate("processing")}
                  >
                    <FontAwesomeIcon
                      icon={faBoxOpen} // Icon for Ready to Dispatch
                      className="me-2"
                    />
                    <span>{orderCounts?.processing}</span>
                  </div>
                </Tooltip>

                {/* Dispatched Orders */}
                <Tooltip title="Total Dispatched Orders">
                  <div
                    className="quantity-item order-status-header"
                    onClick={() => handleOrderNavigate("dispatched")}
                  >
                    <FontAwesomeIcon
                      icon={faTruck} // Icon for Dispatched
                      className="me-2"
                    />
                    <span>{orderCounts?.dispatched}</span>
                  </div>
                </Tooltip>

                {/* Shipped Orders */}
                {/* <Tooltip title="Total Shipped Orders">
                  <div className="quantity-item">
                    <FontAwesomeIcon
                      icon={faShippingFast} // Icon for Shipped
                      className="me-2 text-info"
                    />
                    <span>{orderCounts?.shipped}</span>
                  </div>
                </Tooltip> */}
              </div>
            </li>

            <li className="nav-item d-flex align-items-center gap-4">
              <button
                className="theme-toggle nav-link p-0"
                onClick={toggleTheme}
              >
                <span className="moon">
                  <img
                    src={currentTheme === "light" ? moonImage : sunImage}
                    alt="moon"
                    width={20}
                  />
                </span>
              </button>

              {/* Notification Dropdown */}

              <div
                className="position-relative"
                onClick={handleNotificationDropdown}
              >
                <div className="notification-icon">
                  <FontAwesomeIcon icon={faBell} />
                  {hasUnreadNotifications && (
                    <span
                      className="notification-badge"
                      style={{
                        position: "absolute",
                        top: "-5px",
                        right: "-5px",
                        background: "red",
                        color: "white",
                        borderRadius: "50px",
                        padding: "2px 6px",
                        fontSize: "12px",
                        lineHeight: "1",
                      }}
                    >
                      {totalUnreadEmails}
                    </span>
                  )}
                </div>

                {showNotifications && (
                  <div
                    className="notification-menu dropdown-menu show"
                    style={{
                      position: "absolute",
                      top: "100%",
                      right: 0,
                      zIndex: 1000,
                    }}
                  >
                    <h6 className="sub-head">Notifications</h6>
                    <div className="d-flex flex-column gap-3 mb-0 scroll-box">
                      {latestNotifications.length > 0 ? (
                        latestNotifications.map((notification, index): any => (
                          <div
                            key={index}
                            className="list-box"
                            onClick={() =>
                              handleNotificationClick(notification)
                            }
                            style={{
                              cursor: notification?.metadata?.module
                                ? "pointer"
                                : "default",
                            }}
                          >
                            <span>
                              {notification.username
                                ? notification.username
                                    .split(" ")
                                    .map((word) => word[0]?.toUpperCase() || "")
                                    .join("")
                                : "N/A"}
                            </span>
                            <div className="content-box">
                              <h5>{notification.message}</h5>
                              <div className="flex-box">
                                <p className="m-0">
                                  {moment(notification.created_at).format(
                                    "YYYY-MM-DD"
                                  )}
                                </p>
                                <p className="m-0">
                                  {moment(notification.created_at).format(
                                    "HH:mm"
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="d-flex flex-column gap-3 justify-content-center align-items-center">
                          <img src={noAlarm} alt="" />
                          No Notifications
                        </div>
                      )}
                    </div>
                    <div className="bottom">
                      <button
                        className="filled-btn"
                        onClick={() => {
                          navigate(
                            {
                              pathname: NOTIFICATION_APP_URL,
                              search: `?currentPage=${String(
                                1
                              )}&sort=${"desc"}&sortColumn=${"created_at"}&searchText=${""}&type=${""}&perPage=${String(
                                10
                              )}&isRead=${String(null)}&startDate=${String(
                                ""
                              )}&endDate=${String("")}`,
                            },
                            { replace: false }
                          );
                          handleNotificationDropdown();
                        }}
                      >
                        View Notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </li>

            <li className="dropdown profile-dropdown">
              <Link
                to="#"
                className="btn btn-secondary dropdown-toggle px-0"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <span className="profile-icn">
                  {user?.first_name
                    ? user?.first_name[0].toUpperCase()
                    : user?.email[0].toUpperCase()}
                </span>
              </Link>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <button className="dropdown-item border-bottom mb-2 pb-2">
                    <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                    {user?.email}
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={handleProfile}>
                    <FontAwesomeIcon icon={faUser} className="me-2" />
                    Profile
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>
                    <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                    Logout
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile Header */}
      <nav
        className={`navbar navbar-expand header  mobile-header flex-column ${
          currentTheme === "dark" ? "dark" : "light"
        }`}
      >
        <div className="d-flex border-bottom px-3 py-1 w-100">
          <button
            className="btn"
            id="sidebar-toggle"
            type="button"
            onClick={toggleSidebar}
          >
            <img src={humburgerIcon} alt="humburger_icon" />
          </button>
          <div className="navbar-collapse navbar">
            <ul className="navbar-nav ms-auto">
              {/* Profile Dropdown */}

              {/* Order Status Details Section */}
              <li className="nav-item quantity-details">
                <div className="quantity-container">
                  {/* Pending Orders */}

                  <Tooltip title={`Total Blood Kit`}>
                    <div className="quantity-item">
                      <FontAwesomeIcon icon={faTint} className="" />
                      <span>{quantity?.bloodQuantity}</span>
                    </div>
                  </Tooltip>

                  <Tooltip title={`Total Ordered Kit / Total Saliva Kit`}>
                    <div className="quantity-item">
                      <FontAwesomeIcon icon={faVial} className="" />
                      <span>
                        {orderCounts?.totalQunatity}/{quantity?.salivaQuantity}
                      </span>
                    </div>
                  </Tooltip>

                  <Tooltip title="Total Pending Orders">
                    <div
                      className="quantity-item"
                      onClick={() => handleOrderNavigate("pending")}
                    >
                      <FontAwesomeIcon
                        icon={faHourglassHalf} // Icon for Pending
                        className="me-2" // Add color or style specific to status
                      />
                      <span>{orderCounts?.pending}</span>
                    </div>
                  </Tooltip>

                  {/* Ready for Dispatch Orders */}
                  <Tooltip title="Total Ready For Dispatched Orders">
                    <div
                      className="quantity-item"
                      onClick={() => handleOrderNavigate("processing")}
                    >
                      <FontAwesomeIcon
                        icon={faBoxOpen} // Icon for Ready to Dispatch
                        className=""
                      />
                      <span>{orderCounts?.processing}</span>
                    </div>
                  </Tooltip>

                  {/* Dispatched Orders */}
                  <Tooltip title="Total Dispatched Orders">
                    <div
                      className="quantity-item"
                      onClick={() => handleOrderNavigate("dispatched")}
                    >
                      <FontAwesomeIcon
                        icon={faTruck} // Icon for Dispatched
                        className=""
                      />
                      <span>{orderCounts?.dispatched}</span>
                    </div>
                  </Tooltip>

                  {/* Shipped Orders */}
                  {/* <Tooltip title="Total Shipped Orders">
                    <div className="quantity-item">
                      <FontAwesomeIcon
                        icon={faShippingFast} // Icon for Shipped
                        className="me-2 text-info"
                      />
                      <span>{orderCounts?.shipped}</span>
                    </div>
                  </Tooltip> */}
                </div>
              </li>

              <li className="nav-item d-flex align-items-center gap-4">
                <button
                  className="theme-toggle nav-link p-0"
                  onClick={toggleTheme}
                >
                  <span className="moon">
                    <img
                      src={currentTheme === "light" ? moonImage : sunImage}
                      alt="moon"
                      width={20}
                    />
                  </span>
                </button>

                {/* Notification Dropdown */}
                {/* Hover-based Notification Dropdown */}
                <div
                  className="position-relative"
                  onClick={handleMobileNotificationDropdown}
                >
                  <div className="notification-icon">
                    <FontAwesomeIcon icon={faBell} />
                    {hasUnreadNotifications && (
                      <span
                        className="notification-badge"
                        style={{
                          position: "absolute",
                          top: "-5px",
                          right: "-5px",
                          background: "red",
                          color: "white",
                          borderRadius: "50px",
                          padding: "2px 6px",
                          fontSize: "12px",
                          lineHeight: "1",
                        }}
                      >
                        {totalUnreadEmails}
                      </span>
                    )}
                  </div>

                  {showMobileNotifications && (
                    <div
                      className="notification-menu dropdown-menu show"
                      style={{
                        position: "absolute",
                        top: "100%",
                        right: 0,
                        zIndex: 1000,
                      }}
                    >
                      <h6 className="sub-head">Notifications</h6>
                      <div className="d-flex flex-column gap-3 mb-0 scroll-box">
                        {latestNotifications.length > 0 ? (
                          latestNotifications.map((notification, index) => (
                            <div
                              key={index}
                              className="list-box"
                              onClick={() =>
                                handleNotificationClick(notification)
                              }
                              style={{
                                cursor: notification?.metadata?.module
                                  ? "pointer"
                                  : "default",
                              }}
                            >
                              <span>
                                {notification.username
                                  ? notification.username
                                      .split(" ")
                                      .map(
                                        (word) => word[0]?.toUpperCase() || ""
                                      )
                                      .join("")
                                  : "N/A"}
                              </span>
                              <div className="content-box">
                                <h5>{notification.message}</h5>
                                <div className="flex-box">
                                  <p className="m-0">
                                    {moment(notification.created_at).format(
                                      "YYYY-MM-DD"
                                    )}
                                  </p>
                                  <p className="m-0">
                                    {moment(notification.created_at).format(
                                      "HH:mm"
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="d-flex flex-column gap-3 justify-content-center align-items-center">
                            <img src={noAlarm} alt="" />
                            No Notifications
                          </div>
                        )}
                      </div>
                      <div className="bottom">
                        <button
                          className="filled-btn"
                          onClick={() => {
                            navigate(
                              {
                                pathname: NOTIFICATION_APP_URL,
                                search: `?currentPage=${String(
                                  1
                                )}&sort=${"desc"}&sortColumn=${"created_at"}&searchText=${""}&type=${""}&perPage=${String(
                                  10
                                )}&isRead=${String(null)}&startDate=${String(
                                  ""
                                )}&endDate=${String("")}`,
                              },
                              { replace: false }
                            );
                            handleMobileNotificationDropdown();
                          }}
                        >
                          View Notifications
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </li>

              <li className="dropdown profile-dropdown">
                <Link
                  to="#"
                  className="btn btn-secondary dropdown-toggle px-0"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <span className="profile-icn">
                    {user?.first_name
                      ? user?.first_name[0].toUpperCase()
                      : user?.email[0].toUpperCase()}
                  </span>
                </Link>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <button className="dropdown-item border-bottom mb-2 pb-2">
                      <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                      {user?.email}
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={handleProfile}>
                      <FontAwesomeIcon icon={faUser} className="me-2" />
                      Profile
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>

        <ul className="navbar-nav py-3 justify-content-center px-0">
          <li className="nav-item quantity-details d-block">
            <div className="quantity-container justify-content-center">
              {/* Pending Orders */}
              <Tooltip title={`Total Blood Kit`}>
                <div className="quantity-item">
                  <FontAwesomeIcon icon={faTint} className="" />
                  <span>{quantity?.bloodQuantity}</span>
                </div>
              </Tooltip>

              <Tooltip title={`Total Ordered Kit / Total Saliva Kit`}>
                <div className="quantity-item">
                  <FontAwesomeIcon icon={faVial} className="" />
                  <span>
                    {orderCounts?.totalQunatity}/{quantity?.salivaQuantity}
                  </span>
                </div>
              </Tooltip>

              <Tooltip title="Total Pending Orders">
                <div
                  className="quantity-item"
                  onClick={() => handleOrderNavigate("pending")}
                >
                  <FontAwesomeIcon
                    icon={faHourglassHalf} // Icon for Pending
                    className="" // Add color or style specific to status
                  />
                  <span>{orderCounts?.pending}</span>
                </div>
              </Tooltip>

              {/* Ready for Dispatch Orders */}
              <Tooltip title="Total Ready For Dispatched Orders">
                <div
                  className="quantity-item"
                  onClick={() => handleOrderNavigate("processing")}
                >
                  <FontAwesomeIcon icon={faBoxOpen} className="" />
                  <span>{orderCounts?.processing}</span>
                </div>
              </Tooltip>

              {/* Dispatched Orders */}
              <Tooltip title="Total Dispatched Orders">
                <div
                  className="quantity-item"
                  onClick={() => handleOrderNavigate("dispatched")}
                >
                  <FontAwesomeIcon icon={faTruck} className="" />
                  <span>{orderCounts?.dispatched}</span>
                </div>
              </Tooltip>
            </div>
          </li>
        </ul>
        <div className="d-flex pb-3 justify-content-center">
          <GlobalSearch />
        </div>
      </nav>
    </>
  );
};

export default Header;

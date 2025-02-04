// src/components/Sidebar/Sidebar.tsx

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxOpen,
  faCheckCircle,
  faChevronDown,
  faChevronUp,
  faClockRotateLeft,
  faFlask,
  faHourglassHalf,
  faQuestionCircle,
  faTimes,
  faTruck,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import logo_light from "../../../assets/images/logo_new.jpeg";
import logo_dark from "../../../assets/images/logo_new-dark.png";
import {
  SidebarItem,
  SidebarProps,
  SidebarSubItem,
} from "../../../types/layouts.type";
import {
  MANAGE_CUSTOMER_APP_URL,
  MANAGE_INVENTORY_APP_URL,
  MANAGE_ORDER_APP_URL,
  MANAGE_POST_BACK_ORDERS_APP_URL,
  MANAGE_STAFF_APP_URL,
} from "../../../constants/appUrl";
import { useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";
import ThemeImage from "../../common/icons/ThemeImage";

// Sidebar configuration array with flexible sub-items structure
const sidebarItems: SidebarItem[] = [
  {
    path: MANAGE_INVENTORY_APP_URL,
    name: "Manage Inventory",
    imageName: "manageInventoryImage",
    roles: ["super-admin", "admin"],
  },
  {
    path: MANAGE_STAFF_APP_URL,
    name: "Manage Staff",
    imageName: "manageStaffImage",
    roles: ["super-admin"],
  },
  {
    path: MANAGE_CUSTOMER_APP_URL,
    name: "Manage Customers",
    imageName: "manageCustomerImage",
    roles: ["super-admin", "admin"],
  },
  {
    path: MANAGE_ORDER_APP_URL,
    name: "Manage Orders",
    imageName: "manageOrderImage",
    roles: ["super-admin", "admin"],
    subItems: [
      {
        path: MANAGE_ORDER_APP_URL,
        name: "Pending Orders",
        roles: ["super-admin", "admin"],
        queryParams: {
          orderStatus: "pending",
          paymentStatus: "completed",
          perPage: 10,
          sort: "desc",
          sortColumn: "created_at",
        },
        icon: faHourglassHalf,
      },
      {
        path: MANAGE_ORDER_APP_URL,
        name: "Processing Orders",
        roles: ["super-admin", "admin"],
        queryParams: {
          orderStatus: "processing",
          paymentStatus: "completed",
          perPage: 10,
          sort: "desc",
          sortColumn: "created_at",
        },
        icon: faBoxOpen,
      },
      {
        path: MANAGE_ORDER_APP_URL,
        name: "Dispatched Orders",
        roles: ["super-admin", "admin"],
        queryParams: {
          orderStatus: "dispatched",
          paymentStatus: "completed",
          perPage: 10,
          sort: "desc",
          sortColumn: "created_at",
        },
        icon: faTruck,
      },
    ],
  },
  {
    path: MANAGE_POST_BACK_ORDERS_APP_URL,
    name: "Manage Post Back Orders",
    imageName: "managePostBackOrderImage",
    roles: ["super-admin", "admin"],
    subItems: [
      {
        path: MANAGE_POST_BACK_ORDERS_APP_URL,
        name: "Not Received Kits",
        roles: ["super-admin", "admin"],
        queryParams: {
          status: "Not-Received",
          perPage: 10,
          sort: "desc",
          sortColumn: "created_at",
        },
        icon: faClockRotateLeft,
      },
      {
        path: MANAGE_POST_BACK_ORDERS_APP_URL,
        name: "Received Kits",
        roles: ["super-admin", "admin"],
        queryParams: {
          status: "Received",
          perPage: 10,
          sort: "desc",
          sortColumn: "created_at",
        },
        icon: faCheckCircle,
      },
      {
        path: MANAGE_POST_BACK_ORDERS_APP_URL,
        name: "Send to Lab",
        roles: ["super-admin", "admin"],
        queryParams: {
          status: "Send",
          perPage: 10,
          sort: "desc",
          sortColumn: "created_at",
        },
        icon: faFlask,
      },
      {
        path: MANAGE_POST_BACK_ORDERS_APP_URL,
        name: "Rejected Kits",
        roles: ["super-admin", "admin"],
        queryParams: {
          status: "Reject",
          perPage: 10,
          sort: "desc",
          sortColumn: "created_at",
        },
        icon: faXmarkCircle,
      },
    ],
  },
];

const hasAccess = (userRole: string, itemRoles: string[]): boolean => {
  return itemRoles.includes(userRole);
};

const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  setSidebarCollapsed,
}) => {
  // const dispatch = useAppDispatch();
  // const navigate = useNavigate();
  const location = useLocation();
  const user = useAppSelector((state: RootState) => state.auth.user);
  const currentTheme = useAppSelector((state: RootState) => state.theme.theme);

  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>(
    {}
  );

  const toggleDropdown = (itemName: string) => {
    setOpenDropdowns((prevState) => ({
      ...prevState,
      [itemName]: !prevState[itemName],
    }));
  };

  const isActiveRoute = (
    path: string,
    queryParams?: SidebarSubItem["queryParams"]
  ): boolean => {
    if (!queryParams) {
      return location.pathname === path;
    }

    const searchParams = new URLSearchParams(location.search);
    return (
      location.pathname === path &&
      (searchParams.get("orderStatus") === queryParams.orderStatus ||
        searchParams.get("status") === queryParams.status)
    );
  };

  const renderIcon = (item: SidebarItem | SidebarSubItem) => {
    if (item.imageName) {
      return (
        <ThemeImage
          imageName={item.imageName}
          alt={item.name}
          className={
            currentTheme === "dark" ? "dark-icon-image" : "light-icon-image"
          }
        />
      );
    }
    if (item.icon) {
      return <FontAwesomeIcon icon={item.icon} />;
    }
    return null;
  };

  const constructUrl = (subItem: SidebarSubItem): string => {
    if (!subItem.queryParams) return subItem.path;

    const searchParams = new URLSearchParams();
    Object.entries(subItem.queryParams).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });
    searchParams.append("currentPage", "1");
    searchParams.append("searchText", "");

    return `${subItem.path}?${searchParams.toString()}`;
  };

  const renderSubItems = (subItems: SidebarSubItem[]) => (
    <ul className="sidebar-dropdown list-unstyled">
      {subItems.map((subItem) => (
        <li
          key={`${subItem.path}-${subItem.name}`}
          className={`sidebar-item mb-2 ${
            isActiveRoute(subItem.path, subItem.queryParams) ? "active" : ""
          }`}
        >
          <Link
            to={constructUrl(subItem)}
            className="sidebar-link"
            onClick={() => setSidebarCollapsed(false)}
          >
            <span className="side-ico">{renderIcon(subItem)}</span>
            {subItem.name}
          </Link>
        </li>
      ))}
    </ul>
  );
  return (
    <>
      {collapsed && (
        <div className="overlay" onClick={() => setSidebarCollapsed(false)} />
      )}
      <aside
        id="sidebar"
        className={`flex-column sidebar ${currentTheme} ${
          collapsed ? "collapsed open" : ""
        }`}
      >
        <div className="sidebar-outer h-100">
          <div>
            <div className="logo-box">
              <Link to={MANAGE_INVENTORY_APP_URL} className="logo-brand">
                <img
                  src={currentTheme === "light" ? logo_light : logo_dark}
                  alt="logo"
                />
              </Link>
              <button
                className="btn ms-auto border-0"
                onClick={() => setSidebarCollapsed(false)}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <ul className="sidebar-nav" data-bs-parent="#sidebar">
              {sidebarItems.map((item) => {
                if (hasAccess(user?.role?.name, item.roles)) {
                  const isDropdownOpen = openDropdowns[item.name] || false;

                  return (
                    <li
                      key={item.path}
                      className={`sidebar-item ${
                        !item.subItems && isActiveRoute(item.path)
                          ? "active"
                          : "dropdown-outer"
                      }`}
                    >
                      {item.subItems ? (
                        <>
                          <div
                            className="sidebar-link d-flex gap-2 align-items-center justify-content-between"
                            onClick={() => toggleDropdown(item.name)}
                          >
                            <span className="d-flex gap-2 align-items-center sub-menu-font">
                              <span className="side-ico">
                                {renderIcon(item)}
                              </span>
                              {item.name}
                            </span>
                            <FontAwesomeIcon
                              icon={
                                isDropdownOpen ? faChevronUp : faChevronDown
                              }
                              className="dropdown-arrow"
                            />
                          </div>
                          {isDropdownOpen && renderSubItems(item.subItems)}
                        </>
                      ) : (
                        <Link
                          to={item.path}
                          className="sidebar-link"
                          onClick={() => setSidebarCollapsed(false)}
                        >
                          <span className="side-ico">{renderIcon(item)}</span>
                          {item.name}
                        </Link>
                      )}
                    </li>
                  );
                }
                return null;
              })}
            </ul>
          </div>

          <ul className="sidebar-nav sidebar-btm">
            <li className="sidebar-item">
              <Link
                to="https://www.theranostics.co.nz/faqs/"
                target="_blank"
                className="sidebar-link"
              >
                <span className="side-ico">
                  <FontAwesomeIcon icon={faQuestionCircle} />
                </span>
                Have a Question? Find it here
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

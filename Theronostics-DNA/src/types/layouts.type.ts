import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

export interface SidebarItem {
  path: string;
  name: string;
  imageName?: any;
  icon?: any;
  roles: string[];
  subItems?: SidebarSubItem[];
}
// Define the SidebarItem interface with an optional subItems property
export interface SidebarSubItem {
  path: string;
  name: string;
  imageName?: any;
  icon?: IconDefinition;
  roles: string[];
  isActive?: boolean;
  queryParams?: {
    orderStatus?: string;
    status?: string;
    paymentStatus?: string;
    perPage?: number;
    sort?: string;
    sortColumn?: string;
  };
}

export interface HeaderProps {
  toggleSidebar: () => void;
}

export interface FooterProps {
  sidebarCollapsed: boolean;
}

export interface SidebarProps {
  collapsed: boolean;
  setSidebarCollapsed: any;
}

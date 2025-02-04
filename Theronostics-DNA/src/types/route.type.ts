import { LazyExoticComponent, ReactNode } from "react";

export interface TemplateProps {
  children: ReactNode;
  rolePermission?: string[] | null;
}

export interface PublicTemplateProps {
  children: ReactNode; // Children prop to represent valid React nodes
}

export interface ProductPublicTemplateProps {
  children: ReactNode; // Children prop to represent valid React nodes
}

export interface RouteConfig {
  path: string;
  component: LazyExoticComponent<React.ComponentType<any>>;
  exact?: boolean;
  roles?: string[]; // Array of required permissions
}

import React from "react";
import { useSelector } from "react-redux";
import viewDarkImage from "../../../assets/images/view_dark.svg";
import viewLightImage from "../../../assets/images/view_light.svg";
import editDarkImage from "../../../assets/images/edit_dark.svg";
import editLightImage from "../../../assets/images/edit_light.svg";
import deleteDarkImage from "../../../assets/images/delete_dark.svg";
import deleteLightImage from "../../../assets/images/delete_light.svg";
import passwordDarkImage from "../../../assets/images/locak_dark.svg";
import passwordLightImage from "../../../assets/images/lock_light.svg";
import assignKitDarkImage from "../../../assets/images/assignKit_dark.svg";
import assignKitLightImage from "../../../assets/images/assignKit_light.svg";
import customerListImage from "../../../assets/images/Customer-Lists-Icon.svg";
import kitListImage from "../../../assets/images/Kit-List-Icon.svg";
import manageCustomerImage from "../../../assets/images/Manage-Customer-Icon.svg";
import manageInventoryImage from "../../../assets/images/Manage-Inventory-Icon.svg";
import manageOrderImage from "../../../assets/images/Manage-Order-Icon.svg";
import managePostBackOrderImage from "../../../assets/images/Manage-Post-Back-Order-Icon.svg";
import manageStaffImage from "../../../assets/images/Manage-Staff-Icon.svg";
import orderListImage from "../../../assets/images/Order-List-Icon.svg";
import postOrderListImage from "../../../assets/images/Post-Order-List-Icon.svg";
import staffMemberImage from "../../../assets/images/Staff-Members-Icon.svg";

import { RootState } from "../../../redux/store";
interface ThemeImageProps {
  imageName: keyof typeof images;
  alt?: string;
  className?: string;
}

// Centralized image URL mapping
const images = {
  viewImage: {
    light: viewLightImage,
    dark: viewDarkImage,
  },
  kitAssign: {
    light: assignKitLightImage,
    dark: assignKitDarkImage,
  },
  editImage: {
    light: editLightImage,
    dark: editDarkImage,
  },
  deleteImage: {
    light: deleteLightImage,
    dark: deleteDarkImage,
  },
  lockImage: {
    light: passwordLightImage,
    dark: passwordDarkImage,
  },
  customerListImage: {
    light: customerListImage,
    dark: customerListImage,
  },
  kitListImage: {
    light: kitListImage,
    dark: kitListImage,
  },
  manageCustomerImage: {
    light: manageCustomerImage,
    dark: manageCustomerImage,
  },
  manageInventoryImage: {
    light: manageInventoryImage,
    dark: manageInventoryImage,
  },
  manageOrderImage: {
    light: manageOrderImage,
    dark: manageOrderImage,
  },
  managePostBackOrderImage: {
    light: managePostBackOrderImage,
    dark: managePostBackOrderImage,
  },
  manageStaffImage: {
    light: manageStaffImage,
    dark: manageStaffImage,
  },
  orderListImage: {
    light: orderListImage,
    dark: orderListImage,
  },
  postOrderListImage: {
    light: postOrderListImage,
    dark: postOrderListImage,
  },
  staffMemberImage: {
    light: staffMemberImage,
    dark: staffMemberImage,
  },

  // Add more image mappings here as needed
} as const;

const ThemeImage: React.FC<ThemeImageProps> = ({
  imageName,
  alt = "",
  className = "",
}) => {
  const currentTheme = useSelector((state: RootState) => state.theme.theme) as
    | "light"
    | "dark";

  const selectedImage = images[imageName][currentTheme];

  if (!selectedImage) {
    console.error(
      `Image not found for imageName: ${imageName} and theme: ${currentTheme}`
    );
    return null;
  }

  return <img src={selectedImage} alt={alt} className={className} />;
};

export default ThemeImage;

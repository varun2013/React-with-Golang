import React from "react";
import {  useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";

import KitList from "../../components/features/manage-inventory/KitList";
import ThemeImage from "../../components/common/icons/ThemeImage";

const ManageInventory: React.FC = () => {

  const currentTheme = useAppSelector((state: RootState) => state.theme.theme);


  return (
    <div className="main">
      <div className="row row-gap-3">
        <div className="col-lg-12">
          <div
            className="card main-head py-3 px-3 rounded-3"
            style={{ backgroundColor: "var(--bs-body-bg)" }}
          >
            <h3 className="m-0">
              {/* <FontAwesomeIcon icon={faTruck} className="me-2" /> */}
              <ThemeImage
                imageName="manageInventoryImage"
                alt="manageInventoryImage"
                className={
                  currentTheme === "dark"
                    ? "dark-icon-image me-2"
                    : "light-icon-image me-2"
                }
              />
              Manage Inventory
            </h3>
          </div>
        </div>
        <KitList />
      </div>
    </div>
  );
};

export default ManageInventory;

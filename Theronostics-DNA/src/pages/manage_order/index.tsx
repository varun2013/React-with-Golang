import React from "react";
import { useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import OrderList from "../../components/features/manage-order/oder-list.component";
import ThemeImage from "../../components/common/icons/ThemeImage";

const ManageOrder: React.FC = () => {
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
              {" "}
              {/* <FontAwesomeIcon icon={faTags} className="me-2" /> */}
              <ThemeImage
                imageName="manageOrderImage"
                alt="manageOrderImage"
                className={
                  currentTheme === "dark"
                    ? "dark-icon-image me-2"
                    : "light-icon-image me-2"
                }
              />
              Manage Orders
            </h3>
          </div>
        </div>
        <OrderList />
      </div>
    </div>
  );
};

export default ManageOrder;

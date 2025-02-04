import React from "react";
import { useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import PostOrderList from "../../components/features/manage-post-orders/post-order-list.component";
import ThemeImage from "../../components/common/icons/ThemeImage";

const ManagePostOrder: React.FC = () => {
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
              {/* <FontAwesomeIcon icon={faClipboardList} className="me-2" /> */}
              <ThemeImage
                imageName="managePostBackOrderImage"
                alt="managePostBackOrderImage"
                className={
                  currentTheme === "dark"
                    ? "dark-icon-image me-2"
                    : "light-icon-image me-2"
                }
              />
              Manage Post Back Orders
            </h3>
          </div>
        </div>
        <PostOrderList />
      </div>
    </div>
  );
};

export default ManagePostOrder;

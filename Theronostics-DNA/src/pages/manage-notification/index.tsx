// NotificationPanel.tsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import NotificationList from "../../components/features/manage-notification/notification-list.component";

const NotificationPanel: React.FC = () => {


  return (
    <div className="main">
      <div className="row row-gap-3">
        <div className="col-lg-12">
          <div
            className="card main-head py-3 px-3 rounded-3"
            style={{ backgroundColor: "var(--bs-body-bg)" }}
          >
            <h3 className="m-0">
              <FontAwesomeIcon icon={faBell} className="me-2" />
              Notification Panel
            </h3>
          </div>
        </div>
        <NotificationList />
      </div>
    </div>
  );
};

export default NotificationPanel;

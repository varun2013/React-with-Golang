import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCog } from "@fortawesome/free-solid-svg-icons";
import PersonalDetails from "../../components/features/manage-profile/personal-details.component";
import ResetPassword from "../../components/features/manage-profile/reset-password.component";

const ManageProfile = () => {
  return (
    <>
      <div className="main">
        <div className="row row-gap-3">
          <div className="col-lg-12">
            <div
              className="card main-head py-3 px-3 rounded-3"
              style={{ backgroundColor: "var(--bs-body-bg)" }}
            >
              <h3 className="m-0">
                {" "}
                <FontAwesomeIcon icon={faUserCog} className="me-2" />
                Manage Profile
              </h3>
            </div>
          </div>
          <PersonalDetails />
          <ResetPassword />
        </div>
      </div>
    </>
  );
};

export default ManageProfile;

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faSave,
  faTimes,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import CommonForm from "../../common/form/CommonForm";
import {
  PersonalDetailsErrorState,
  PersonalDetailsField,
  PersonalDetailsState,
} from "../../../types/manage-profile.type";
import CommonButton from "../../common/button/CommonButton";
import { handleUpdateProfileSubmit } from "./personal-details.event";

const PersonalDetails: React.FC = () => {
  const user = useAppSelector((state: RootState) => state.auth.user);
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState<PersonalDetailsState>({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
  });
  const [errorState, setErrorState] = useState<PersonalDetailsErrorState>({
    first_name: "",
    last_name: "",
  });
  const loading = useAppSelector((state: RootState) => state.loader.loader);

  const fields: PersonalDetailsField[] = [
    {
      name: "first_name",
      label: "First Name",
      type: "text",
      placeholder: "Enter your first name",
      required: true,
      favImage: faUser,
      maxLength: 50,
      validationRules: {
        type: "nameWithSpace",
        maxLength: 50,
        minLength: 3,
        required: true,
      },
    },
    {
      name: "last_name",
      label: "Last Name",
      type: "text",
      placeholder: "Enter your last name",
      required: false,
      favImage: faUser,
      maxLength: 50,
      minLength: 3,
      validationRules: {
        type: "nameWithSpace",
        maxLength: 50,
        minLength: 3,
        required: false,
      },
    },
  ];

  const isFormValid = () => {
    const isAnyFieldEmpty = fields.some(
      (field) => field.required && !formState[field.name]
    );
    const hasErrors = Object.values(errorState).some(
      (error) => error && error.length > 0
    );
    return !isAnyFieldEmpty && !hasErrors;
  };

  const onSubmit = () => {
    handleUpdateProfileSubmit({
      formState,
      dispatch,
      setErrorState,
      setIsEditing,
      fields,
    });
  };

  return (
    <>
      <div className="col-lg-12">
        <div
          className="card shadow-sm rounded-3"
          style={{ backgroundColor: "var(--bs-body-bg)" }}
        >
          <div className="card-header d-flex justify-content-between align-items-center">
            <h4 className="mb-0">Personal Details</h4>
            {!isEditing && (
              <button className="filled-btn" onClick={() => setIsEditing(true)}>
                <FontAwesomeIcon icon={faEdit} className="me-2" />
                Edit
              </button>
            )}
          </div>
          <div className="card-body">
            {!isEditing ? (
              <div>
                <p>
                  <strong>First Name:</strong> {user?.first_name}
                </p>
                <p>
                  <strong>Last Name:</strong>{" "}
                  {user?.last_name ? user?.last_name : "N/A"}
                </p>
                <p>
                  <strong>Email:</strong> {user?.email}
                </p>
                <p>
                  <strong>Role:</strong> {user?.role?.name}
                </p>
              </div>
            ) : (
              <>
                <CommonForm
                  state={formState}
                  setState={setFormState}
                  errorState={errorState}
                  setErrorState={setErrorState}
                  fields={fields}
                  onSubmit={onSubmit}
                />
                {errorState.general && (
                  <div className="error-message">{errorState.general}</div>
                )}
                <div className="d-flex justify-content-end mt-3 gap-3">
                  <CommonButton
                    type="button"
                    className="btn btn-secondary"
                    text="Cancel"
                    icon={<FontAwesomeIcon icon={faTimes} />}
                    onClick={() => setIsEditing(false)}
                  />
                  <CommonButton
                    type="submit"
                    className={!isFormValid() ? "disabled-btn" : "filled-btn"}
                    text="Update"
                    icon={<FontAwesomeIcon icon={faSave} />}
                    onClick={onSubmit}
                    loading={loading}
                    disabled={!isFormValid()}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PersonalDetails;

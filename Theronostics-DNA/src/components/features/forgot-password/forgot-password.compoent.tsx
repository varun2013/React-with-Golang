import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import CommonForm from "../../common/form/CommonForm";
import CommonButton from "../../common/button/CommonButton";
import emailImage from "../../../assets/images/email.svg";
import { RootState } from "../../../redux/store";
import {
  ForgotPasswordErrorState,
  ForgotPasswordField,
  ForgotPasswordState,
} from "../../../types/forgot-password.type";
import { handleForgotPasswordSubmit } from "./forget-password.event";
import { LOGIN_APP_URL } from "../../../constants/appUrl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey } from "@fortawesome/free-solid-svg-icons";

const ForgotPasswordComponent: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const loading = useAppSelector((state: RootState) => state.loader.loader);

  const [formState, setFormState] = useState<ForgotPasswordState>({
    email: "",
  });
  const [errorState, setErrorState] = useState<ForgotPasswordErrorState>({
    email: "",
  });

  const fields: ForgotPasswordField[] = [
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "Enter your email",
      required: true,
      image: emailImage,
      maxLength: 255,
      validationRules: { type: "email", maxLength: 255, required: true },
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
    handleForgotPasswordSubmit({
      formState,
      dispatch,
      navigate,
      setErrorState,
      fields,
    });
  };

  return (
    <div className="right-content">
      <div className="form-outer">
        <h2 className="mb-3">Forgot Password</h2>
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
        <div className="d-flex justify-content-end">
          <Link
            className="form-label"
            style={{ fontWeight: "400" }}
            to={LOGIN_APP_URL}
          >
            Back to login page?
          </Link>
        </div>
        <div className="d-flex justify-content-end mt-3">
          <CommonButton
            type="submit"
            className={!isFormValid() ? "disabled-btn w-100" : "filled-btn w-100"}
            text="Forgot Password"
            icon={<FontAwesomeIcon icon={faKey} />}
            onClick={onSubmit}
            loading={loading}
            disabled={!isFormValid()}
          />
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordComponent;

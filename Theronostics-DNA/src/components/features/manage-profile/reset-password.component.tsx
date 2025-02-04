import { useState } from "react";
import CommonForm from "../../common/form/CommonForm";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";
import {
  ResetPasswordErrorState,
  ResetPasswordField,
  ResetPasswordState,
} from "../../../types/manage-profile.type";
import passwordLockImage from "../../../assets/images/passwordLock.svg";
import CommonButton from "../../common/button/CommonButton";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { handleResetPasswordSubmit } from "./reset-password.event";

const ResetPassword = () => {
  const [formState, setFormState] = useState<ResetPasswordState>({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [errorState, setErrorState] = useState<ResetPasswordErrorState>({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const loading = useAppSelector((state: RootState) => state.loader.loader);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const fields: ResetPasswordField[] = [
    {
      name: "old_password",
      label: "Old Password",
      type: "password",
      placeholder: "Enter old password",
      required: true,
      minLength: 8,
      maxLength: 20,
      image: passwordLockImage,
      validationRules: {
        type: "password",
        minLength: 8,
        maxLength: 20,
        required: true,
      },
      passwordTooltipShow: true,
    },

    {
      name: "new_password",
      label: "New Password",
      type: "password",
      placeholder: "Enter new password",
      required: true,
      minLength: 8,
      maxLength: 20,
      image: passwordLockImage,
      validationRules: {
        type: "password",
        minLength: 8,
        maxLength: 20,
        required: true,
      },
      passwordTooltipShow: true,
    },

    {
      name: "confirm_password",
      label: "Confirm Password",
      type: "password",
      placeholder: "Enter confirm password",
      required: true,
      minLength: 8,
      maxLength: 20,
      image: passwordLockImage,
      validationRules: {
        type: "password",
        minLength: 8,
        maxLength: 20,
        required: true,
      },
      passwordTooltipShow: true,
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
    handleResetPasswordSubmit({
      formState,
      dispatch,
      navigate,
      setErrorState,
      fields,
    });
  };

  return (
    <div
      className="content px-3 py-4 rounded-3"
      style={{ backgroundColor: "var(--bs-body-bg)" }}
    >
      <div className="dash_col dashboard-filter mb-4">
        <h4 className="m-0">Reset Password</h4>
      </div>
      <CommonForm
        state={formState}
        setState={setFormState}
        errorState={errorState}
        setErrorState={setErrorState}
        fields={fields}
        onSubmit={onSubmit}
      />
      <div className="d-flex justify-content-end mt-3 gap-3">
        <CommonButton
          type="submit"
          className={!isFormValid() ? "disabled-btn" : "filled-btn"}
          text="Reset Password"
          icon={<FontAwesomeIcon icon={faLock} />}
          onClick={onSubmit}
          loading={loading}
          disabled={!isFormValid()}
        />
      </div>
    </div>
  );
};

export default ResetPassword;

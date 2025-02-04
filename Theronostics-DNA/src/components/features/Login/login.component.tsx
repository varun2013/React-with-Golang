import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { useState } from "react";
import {
  LoginErrorState,
  LoginField,
  LoginState,
} from "../../../types/login.types";
import { RootState } from "../../../redux/store";
import emailImage from "../../../assets/images/email.svg";
import passwordLockImage from "../../../assets/images/passwordLock.svg";
import CommonForm from "../../common/form/CommonForm";
import { FORGET_PASSWORD_APP_URL } from "../../../constants/appUrl";
import CommonButton from "../../common/button/CommonButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import { handleLoginSubmit } from "./login.events";

const LoginComponent: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [loginState, setLoginState] = useState<LoginState>({
    email: "",
    password: "",
  });

  const [errLoginState, setErrLoginState] = useState<LoginErrorState>({
    email: "",
    password: "",
  });

  const loading = useAppSelector((state: RootState) => state.loader.loader);

  const fields: LoginField[] = [
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "Enter email",
      required: true,
      image: emailImage,
      maxLength: 255,
      validationRules: {
        type: "email",
        maxLength: 255,
        required: true,
      },
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Enter password",
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

  const isFormValid = (): boolean => {
    const isAnyFieldEmpty = fields.some(
      (field) => field.required && !loginState[field.name]
    );

    const hasErrors = Object.values(errLoginState).some(
      (error) => error && error.length > 0
    );

    return !isAnyFieldEmpty && !hasErrors;
  };

  const onSubmit = () => {
    handleLoginSubmit({
      loginState,
      dispatch,
      navigate,
      setErrLoginState,
      fields,
    });
  };

  return (
    <div className="right-content">
      <div className="form-outer">
        <h2 className="mb-3">Login</h2>
        <CommonForm
          state={loginState}
          setState={setLoginState}
          errorState={errLoginState}
          setErrorState={setErrLoginState}
          fields={fields}
          onSubmit={onSubmit}
        />
        {errLoginState.general && (
          <div className="text-danger mb-3">{errLoginState.general}</div>
        )}
        <div className="d-flex justify-content-end">
          <Link
            className="form-label"
            style={{ fontWeight: "400" }}
            to={FORGET_PASSWORD_APP_URL}
          >
            Forgot Password?
          </Link>
        </div>

        <div className="d-flex justify-content-end mt-3">
          <CommonButton
            type="submit"
            className={!isFormValid() ? "disabled-btn w-100" : "filled-btn w-100"}
            text="Login"
            icon={<FontAwesomeIcon icon={faSignInAlt} />}
            onClick={onSubmit}
            loading={loading}
            disabled={!isFormValid()}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;

import React from "react";
import { Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "antd";
import { CommonInputProps } from "../../../types/formInput.type";

const CommonInput: React.FC<CommonInputProps> = ({
  field,
  value,
  onChange,
  onBlur,
  onKeyDown,
  error,
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const isRequired = field.required ?? true;
  const isPasswordField = field.type === "password";
  const colAttributes = field.colProps || { xs: 12 };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Col {...colAttributes}>
        <label htmlFor={field.name} className="form-label required-field">
          {field.label}
          {isRequired && <span className="text-danger ms-1">*</span>}
        </label>
        <div className={`input-group ${isPasswordField ? "password-box" : ""}`}>
          {field.image && (
            <span className="input-group-text">
              <img src={field.image} alt={`${field.name}_icon`} />
            </span>
          )}
          {field.favImage && (
            <span className="input-group-text">
              <FontAwesomeIcon icon={field.favImage} />
            </span>
          )}
          <input
            type={isPasswordField && showPassword ? "text" : field.type}
            name={field.name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            placeholder={field.placeholder}
            required={field.required}
            maxLength={field.maxLength}
            minLength={field.minLength}
            className="form-control"
            disabled={field.disabled}
          />
          {isPasswordField && (
            <span className="toggle-password">
              <FontAwesomeIcon
                icon={showPassword ? faEye : faEyeSlash}
                className="field_icon toggle-password fa-fw"
                onClick={toggleShowPassword}
              />
              {field.passwordTooltipShow && (
                <Tooltip title="Password must be 8-20 characters long, contain uppercase and lowercase letters, a number, and a special character.">
                  <FontAwesomeIcon
                    icon={faInfoCircle}
                    className="field_icon toggle-password fa-fw d-none d-lg-block"
                  />
                </Tooltip>
              )}
            </span>
          )}
        </div>
        {error && <div className="text-danger error-text mt-1">{error}</div>}
    </Col>
  );
};

export default CommonInput;

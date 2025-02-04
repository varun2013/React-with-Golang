import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { ButtonProps } from "../../../types/button.type";

const CommonButton: React.FC<ButtonProps> = ({
  type,
  className,
  text,
  icon,
  onClick,
  loading = false,
  disabled = false,
}) => {
  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {loading ? (
        <FontAwesomeIcon icon={faSpinner} spin className="me-2" />
      ) : (
        icon && <span className="me-2">{icon}</span>
      )}
      {text}
    </button>
  );
};

export default CommonButton;

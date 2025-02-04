import React from "react";
import { Col } from "react-bootstrap";
import { CommonInputProps } from "../../../types/formInput.type";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

const CommonSelect: React.FC<CommonInputProps> = ({
  field,
  value,
  onChange,
  onBlur,
  onKeyDown,
  error,
}) => {
  const isRequired = field.required ?? true;
  const colAttributes = field.colProps || { xs: 12 };

  return (
    <Col {...colAttributes}>
     <div className="position-relative">
        <label htmlFor={field.name} className="form-label required-field">
          {field.label}
          {isRequired && <span className="text-danger ms-1">*</span>}
        </label>
        <div className="position-relative">
        <select
          name={field.name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          className="form-control"
          required={isRequired}
        >
          <option value="">Select {field.label}</option>
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="position-absolute top-50 end-0 translate-middle-y me-3 pointer-events-none">
            <FontAwesomeIcon icon={faCaretDown} />
          </div>
        </div>
        
        {error && <div className="text-danger error-text mt-1">{error}</div>}
      </div>
    </Col>
  );
};

export default CommonSelect;
import React from "react";
import { Col } from "react-bootstrap";
import { CommonInputProps } from "../../../types/formInput.type";

const CommonTextarea: React.FC<CommonInputProps> = ({
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
        <label htmlFor={field.name} className="form-label required-field">
          {field.label}
          {isRequired && <span className="text-danger ms-1">*</span>}
        </label>
        <textarea
          name={field.name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          placeholder={field.placeholder}
          required={isRequired}
          maxLength={field.maxLength}
          minLength={field.minLength}
          className="form-control restricted-textarea "
          rows={4}
        />
        
        {error && <div className="text-danger error-text mt-1">{error}</div>}
    </Col>
  );
};

export default CommonTextarea;
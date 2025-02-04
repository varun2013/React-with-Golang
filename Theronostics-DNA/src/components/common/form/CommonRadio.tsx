import React from "react";
import { Col } from "react-bootstrap";
import { CommonRadioProps } from "../../../types/formInput.type";

const CommonRadio: React.FC<CommonRadioProps> = ({
  field,
  value,
  onChange,
  onBlur,
  onKeyDown,
  error,
  options,
  defaultValue,
}) => {
  const isRequired = field.required ?? true;
  const colAttributes = field.colProps || { xs: 12 };

  // Use defaultValue if provided and no current value exists
  const currentValue = value || defaultValue;

  return (
    <Col {...colAttributes}>
      <label className="form-label required-field">
        {field.label}
        {isRequired && <span className="text-danger ms-1">*</span>}
      </label>

      <div className="radio-group">
        {options.map((option) => (
          <div
            key={String(option.value)}
            className="form-check form-check-inline"
          >
            <input
              type="radio"
              id={`${field.name}_${option.value}`}
              name={field.name}
              value={option.value}
              checked={currentValue === option.value}
              onChange={onChange}
              onBlur={onBlur}
              onKeyDown={onKeyDown}
              disabled={option.disabled}
              className="form-check-input"
              required={isRequired}
            />
            <label
              htmlFor={`${field.name}_${option.value}`}
              className="form-check-label"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>

      {error && <div className="text-danger error-text mt-1">{error}</div>}
    </Col>
  );
};

export default CommonRadio;

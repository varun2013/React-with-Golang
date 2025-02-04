import React from "react";
import { Dropdown } from "react-bootstrap";
import { CommonDropdownProps } from "../../../types/dropdown.type";

const CommonDropdown: React.FC<CommonDropdownProps> = ({
  label,
  options,
  selectedValue,
  onSelect,
}) => {
  return (
    <div className="table_filter d-flex justify-content-center align-items-center">
      <span>{label}: </span>
      <Dropdown onSelect={(eventKey: string | null | number) => onSelect(eventKey!)}>
        <Dropdown.Toggle variant="success" id={`dropdown-${label}`}>
          {options.find((option) => option.value === selectedValue)?.label}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {options.map((option) => (
            <Dropdown.Item key={option.value} eventKey={option.value}>
              {option.label}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default CommonDropdown;

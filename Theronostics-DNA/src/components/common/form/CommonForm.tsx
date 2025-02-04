import React from "react";
import CommonInput from "./CommonInput";
import { Form, Row } from "react-bootstrap";
import { CommonFormPropsInterface } from "../../../types/formInput.type";
import {
  handleFormChange,
  handleFormBlur,
  handleFormKeyDown,
} from "./CommonFormEvents";
import CommonSelect from "./CommonSelect";
import CommonTextarea from "./CommonTextarea";
import CommonRadio from "./CommonRadio";

const CommonForm: React.FC<CommonFormPropsInterface> = ({
  state,
  setState,
  errorState,
  setErrorState,
  fields,
  onSubmit,
}) => {
  const renderInput = (field: any) => {
    switch (field.type) {
      case "radio":
        return (
          <CommonRadio
            key={field.name}
            field={field}
            options={field.options}
            defaultValue={field.defaultValue}
            value={state[field.name] || ""}
            onChange={(e) =>
              handleFormChange(e, field, setState, setErrorState, state)
            }
            onBlur={(e) => handleFormBlur(e, field, setErrorState, state)}
            onKeyDown={(e) => handleFormKeyDown(e, field, onSubmit)}
            error={errorState[field.name]}
          />
        );

      case "select":
        return (
          <CommonSelect
            key={field.name}
            field={field}
            value={state[field.name] || ""}
            onChange={(e) =>
              handleFormChange(e, field, setState, setErrorState, state)
            }
            onBlur={(e) => handleFormBlur(e, field, setErrorState, state)}
            onKeyDown={(e) => handleFormKeyDown(e, field, onSubmit)}
            error={errorState[field.name]}
          />
        );
      case "textarea":
        return (
          <CommonTextarea
            key={field.name}
            field={field}
            value={state[field.name] || ""}
            onChange={(e) =>
              handleFormChange(e, field, setState, setErrorState, state)
            }
            onBlur={(e) => handleFormBlur(e, field, setErrorState, state)}
            onKeyDown={(e) => handleFormKeyDown(e, field, onSubmit)}
            error={errorState[field.name]}
          />
        );
      default:
        return (
          <CommonInput
            key={field.name}
            field={field}
            value={state[field.name] || ""}
            onChange={(e) =>
              handleFormChange(e, field, setState, setErrorState, state)
            }
            onBlur={(e) => handleFormBlur(e, field, setErrorState, state)}
            onKeyDown={(e) => handleFormKeyDown(e, field, onSubmit)}
            error={errorState[field.name]}
          />
        );
    }
  };

  return (
    <Form>
      <Row className="row-gap-3">{fields.map((field) => renderInput(field))}</Row>
    </Form>
  );
};

export default CommonForm;

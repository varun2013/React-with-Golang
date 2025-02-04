import React from "react";
import { Form } from "react-bootstrap";
import { PatientDetailsFormProps } from "../../../types/kit-register.type";
import CommonForm from "../../common/form/CommonForm";
import CommonButton from "../../common/button/CommonButton";
import { Link } from "react-router-dom";

/**
 * PatientDetailsForm component
 *
 * @param {PatientDetailsFormProps} props - component props
 * @returns {ReactElement} - component element
 */
export const PatientDetailsForm: React.FC<PatientDetailsFormProps> = ({
  isOrderSelf,
  customerOrderData,
  fields,
  formValues,
  setFormValues,
  errFormValues,
  setErrFormValues,
  handleCheckboxChange,
  handleSubmit,
  isFormValid,
  setPatientFormShow,
  patientFormShow,
  isAgree,
  setIsAgree,
  isClinicInform,
  setIsClinicInform,
}) => {
  return (
    <div className="card mt-4">
      <div className="card-header order-detail-header text-white">
        <h5 className="mb-0">Patient Details</h5>
      </div>
      <div className="card-body">
        <div className="billingg-form">
          {/* Checkbox for registering the kit for the customer themselves */}
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              id="sameAddress"
              label="Would you like to register the kit for yourself?"
              onChange={handleCheckboxChange}
              checked={isOrderSelf}
            />
          </Form.Group>
          {customerOrderData?.clinic_id && (
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                id="isClinicInform"
                label="Would you like to inform the clinic?"
                onChange={() => setIsClinicInform(!isClinicInform)}
                checked={isClinicInform}
              />
            </Form.Group>
          )}

          {/* Form for filling out the patient details */}
          <CommonForm
            state={formValues}
            setState={setFormValues}
            errorState={errFormValues}
            setErrorState={setErrFormValues}
            fields={fields}
            onSubmit={handleSubmit}
          />

          {/* Checkbox for agreeing to the privacy policy */}
          <Form.Group className="mt-3">
            <Form.Check
              type="checkbox"
              id="agreeServices"
              label={
                <>
                  I agree to the
                  <Link
                    to="https://www.theranostics.co.nz/privacy/"
                    target="_blank"
                    className="ms-1"
                  >
                    Privacy Policy
                  </Link>
                  .<span className="text-danger ms-1">* </span>
                </>
              }
              onChange={() => {
                setIsAgree(!isAgree);
              }}
              checked={isAgree}
            />
          </Form.Group>

          {/* Buttons for submitting the form and showing the order details */}
          <div className="d-flex justify-content-end gap-3 mt-4">
            <CommonButton
              type="button"
              className="outlined-btn "
              text={
                patientFormShow
                  ? "Show Order Details"
                  : "Click here to fill out the patient form."
              }
              onClick={() => setPatientFormShow(!patientFormShow)}
            />
            <CommonButton
              type="submit"
              className={!isFormValid() ? "disabled-btn" : "filled-btn"}
              text="Submit"
              onClick={handleSubmit}
              disabled={!isFormValid()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

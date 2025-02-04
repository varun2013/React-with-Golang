import React from "react";
import CommonForm from "../../common/form/CommonForm";

const BillingForm: React.FC<any> = ({
  formValues,
  setFormValues,
  errFormValues,
  setErrFormValues,
  onSubmit,
  billingFields,
  clinicField,
}) => {
  return (
    <>
      <div className="billingg-form">
        <CommonForm
          state={formValues}
          setState={setFormValues}
          errorState={errFormValues}
          setErrorState={setErrFormValues}
          fields={billingFields}
          onSubmit={onSubmit}
        />
        {formValues?.type === "clinic" ? (
          <div className="mt-3">
            <CommonForm
              state={formValues}
              setState={setFormValues}
              errorState={errFormValues}
              setErrorState={setErrFormValues}
              fields={clinicField}
              onSubmit={onSubmit}
            />
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default BillingForm;

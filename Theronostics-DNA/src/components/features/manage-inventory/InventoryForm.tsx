import React from "react";
import { useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";
import CommonForm from "../../common/form/CommonForm";
import CommonButton from "../../common/button/CommonButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";

const InventoryForm: React.FC<any> = ({
  formState,
  setFormState,
  errorState,
  setErrorState,
  onSubmit,
  isFormValid,
  fields,
  isEditModal,
  onCancel,
}) => {
  const loading = useAppSelector((state: RootState) => state.loader.loader);
  return (
    <>
      <CommonForm
        state={formState}
        setState={setFormState}
        errorState={errorState}
        setErrorState={setErrorState}
        fields={fields}
        onSubmit={onSubmit}
      />
      <div className="d-flex justify-content-end mt-3 gap-2">
        <CommonButton
          type="button"
          className="outlined-btn"
          text="Cancel"
          onClick={onCancel}
        />
        <CommonButton
          type="submit"
          className={!isFormValid() ? "disabled-btn" : "filled-btn"}
          text={isEditModal ? "Update" : "Submit"}
          icon={<FontAwesomeIcon icon={faSave} />}
          onClick={onSubmit}
          loading={loading}
          disabled={!isFormValid()}
        />
      </div>
    </>
  );
};

export default InventoryForm;

import React from "react";
import CommonForm from "../../common/form/CommonForm";
import CommonButton from "../../common/button/CommonButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";

// Define the interface for FormField
interface FormField {
    name: string;
    label: string;
    type: string;
    placeholder?: string;
    maxLength?: number;
    validationRules?: {
      type: string;
      maxLength?: number;
    };
    required: boolean;
  }
  
  // Define the interface for ErrorState
  interface ErrorState {
    [key: string]: string;
  }
  
  // Define the props for the OrderStatusChange component
  interface OrderStatusChangeModalProps {
    selectedData?: {
      id: string; // Replace with the actual structure of selectedData if known
      [key: string]: any; // Add additional fields if needed
    };
    formState: Record<string, string>;
    setFormState: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    errFormState: ErrorState;
    setErrFormState: React.Dispatch<React.SetStateAction<ErrorState>>;
    formFields: FormField[];
    handleSubmit: () => Promise<void>;
    isFormValid: () => boolean;
    handleCloseModal: () => void;
    loading: boolean;
    handleSubmitWithoutTrackingID: () => Promise<void>;
  }

const OrderStatusChange: React.FC<OrderStatusChangeModalProps> = ({
  selectedData,
  formState,
  setFormState,
  errFormState,
  setErrFormState,
  formFields,
  handleSubmit,
  isFormValid,
  handleCloseModal,
  loading,
  handleSubmitWithoutTrackingID,
}) => {
  if (!selectedData) return null;

  return (
    <>
      <div className="container">
        <p>
          Do you want to add a tracking ID for this order? You can proceed with
          or without it.
        </p>
        <CommonForm
          state={formState}
          setState={setFormState}
          errorState={errFormState}
          setErrorState={setErrFormState}
          fields={formFields}
          onSubmit={handleSubmit}
        />
        <div className="d-flex justify-content-end mt-3 gap-2">
          <CommonButton
            type="button"
            className="danger-btn"
            text="Cancel"
            onClick={handleCloseModal}
          />
          <CommonButton
            type="button"
            className="outlined-btn"
            text={"Skip"}
            onClick={handleSubmitWithoutTrackingID}
          />
          <CommonButton
            type="submit"
            className={!isFormValid() ? "disabled-btn":"filled-btn"}
            text={"Continue"}
            icon={<FontAwesomeIcon icon={faSave} />}
            onClick={handleSubmit}
            disabled={!isFormValid()}
          />
        </div>
      </div>
    </>
  );
};

export default OrderStatusChange;

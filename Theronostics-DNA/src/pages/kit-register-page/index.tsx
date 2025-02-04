import React, { useEffect, useRef, useState } from "react";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { kitRegister, setLoader, verifyBarcodeData } from "../../redux/action";
import { RootState } from "../../redux/store";
import flashMessage from "../../utils/notifications/antdMessageUtils";
import {
  BarcodeErrorState,
  BarcodeFormState,
  FormField,
} from "../../types/kit-register.type";
import { BarcodeScanner } from "../../components/features/kit-register/BarcodeScanner";
import { OrderDetails } from "../../components/features/kit-register/OrderDetails";
import { validateForm } from "../../utils/validation/validationUtils";
import { PatientDetailsForm } from "../../components/features/kit-register/PatientDetailsForm";
import { encrypt } from "../../utils/encryption/encryption";
import { useNavigate } from "react-router-dom";
import { SuccessMessageInterface } from "../../types/redux.type";
import CommonForm from "../../components/common/form/CommonForm";
import emailImage from "../../assets/images/email.svg";

const BARCODE_LENGTH = 30;
const BARCODE_REGEX = /^[A-Za-z0-9]+$/;

const KitRegister: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { customerOrderData } = useAppSelector(
    (state: RootState) => state.kitRegister
  );
  const [formState, setFormState] = useState<BarcodeFormState>({
    barcode_number: "",
    isScannedData: false,
  });
  const [errorState, setErrorState] = useState<BarcodeErrorState>({
    barcode_number: "",
  });

  const [isOrderSelf, setIsOrderSelf] = useState<boolean>(false);
  const [isClinicInform, setIsClinicInform] = useState<boolean>(true);
  const [isAgree, setIsAgree] = useState<boolean>(false);

  const [formValues, setFormValues] = useState<any>({
    first_name: "",
    last_name: "",
    email : "",
    age: "",
    gender: "male",
  });

  const [errFormValues, setErrFormValues] = useState<any>({
    first_name: "",
    last_name: "",
    email : "",
    age: "",
    gender: "",
  });

  const [barcodeType, setBarcodeType] = useState({
    type: "manual",
  });
  const [showManual, setShowManual] = useState(true);
  const [errBarcodeType, setErrBarcodeType] = useState({
    type: "",
  });
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (barcodeType?.type === "manual") {
      setShowManual(true);
    } else {
      setShowManual(false);
    }
  }, [barcodeType]);

  const [patientFormShow, setPatientFormShow] = useState(false);
  const fields: FormField[] = [
    {
      name: "gender",
      label: "Gender",
      type: "radio",
      placeholder: "Choose Gender",
      required: true,
      defaultValue: "male",
      options: [
        { label: "Male", value: "male" },
        { label: "Female", value: "female" },
        { label: "Other", value: "other" },
      ],
      colProps: { xs: 12, md: 6 },
    },
    {
      name: "first_name",
      label: "First Name",
      type: "text",
      placeholder: "Enter your first name",
      required: true,
      favImage: faUser,
      maxLength: 50,
      validationRules: {
        type: "nameWithSpace",
        maxLength: 50,
        minLength: 3,
        required: true,
      },
      colProps: { xs: 12, md: 6 },
      disabled: isOrderSelf,
    },
    {
      name: "last_name",
      label: "Last Name",
      type: "text",
      placeholder: "Enter your last name",
      required: false,
      favImage: faUser,
      maxLength: 50,
      minLength: 3,
      validationRules: {
        type: "nameWithSpace",
        maxLength: 50,
        minLength: 3,
        required: false,
      },
      colProps: { xs: 12, md: 6 },
      disabled: isOrderSelf,
    },
    {
      name: "email",
      label: "Email",
      type: "text",
      placeholder: "Enter your email",
      required: false,
      image: emailImage,
      maxLength: 255,
      validationRules: {
        type: "email",
        maxLength: 255,
        required: false,
      },
      colProps: { xs: 12, md: 6 },
      disabled: isOrderSelf,
    },
    {
      name: "age",
      label: "Age",
      type: "text",
      placeholder: "Enter your age",
      required: true,
      maxLength: 3,
      validationRules: {
        type: "age",
        maxLength: 3,
        required: true,
      },
      colProps: { xs: 12, md: 6 },
    },
  ];

  const validateBarcodeCriteria = (barcode: string): string | null => {
    barcode = barcode.trim();
    if (barcode === "") {
      return "";
    }
    if (barcode.length !== BARCODE_LENGTH) {
      return `QRCode/Barcode must be exactly ${BARCODE_LENGTH} characters long`;
    }

    if (!BARCODE_REGEX.test(barcode)) {
      return "QRCode/Barcode must contain only letters and numbers";
    }
    return null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanedInput = e.target.value;

    setFormState((prev) => ({
      ...prev,
      barcode_number: cleanedInput.trim(),
      isScannedData: false,
    }));
    const validationError = validateBarcodeCriteria(cleanedInput);
   
      setErrorState({
        barcode_number: validationError || "",
      });

    // Clear previous timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Set new timeout for 5 seconds
    debounceTimeout.current = setTimeout(() => {
      if (validationError) {
        setErrorState({
          barcode_number: validationError || "",
        });
    
      } else {
        if (cleanedInput === "") {
          return;
        }
        setErrorState({ barcode_number: "" });
        handleVerifyBarcode(cleanedInput);
      }
    }, 2000);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {

      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
        debounceTimeout.current = null;
      }

      const validationError = validateBarcodeCriteria(formState?.barcode_number);
      if (validationError) {
        flashMessage(validationError, "error");
      }  else if (formState?.barcode_number !== "") {
        setErrorState({ barcode_number: "" });
        handleVerifyBarcode(formState?.barcode_number);
      }
    }
  };

  const handleScan = (result: any) => {
    setErrorState({ barcode_number: "" });
    if (result && result.length > 0) {
      const scannedBarcode = result[result.length - 1].rawValue;

      const validationError = validateBarcodeCriteria(scannedBarcode);

      if (validationError) {
        flashMessage(validationError, "error");
        setErrorState({ barcode_number: validationError });
        return;
      }

      setFormState((prev) => ({
        ...prev,
        barcode_number: scannedBarcode.trim(),
        isScannedData: true,
      }));

      flashMessage("QRCode/Barcode scanned successfully", "success");
      setErrorState({ barcode_number: "" });
      handleVerifyBarcode(scannedBarcode.trim());
      setShowManual(true);
    }
  };

  const handleVerifyBarcode = async (query: string) => {
    const validationError = validateBarcodeCriteria(query);
    if (validationError) {
      setErrorState({ barcode_number: validationError });
      return;
    }

    try {
      await dispatch(setLoader(true));
      await dispatch(
        verifyBarcodeData({ barcode_number: query })
      );
    } catch (err) {
      console.error("Error assigning kit:", err);
      flashMessage("Failed to verify barcode", "error");
    } finally {
      await dispatch(setLoader(false));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setIsOrderSelf(checked);
    if (checked) {
      // If checked, copy the current address to the shipping address
      setFormValues((prev: any) => ({
        ...prev,
        first_name: customerOrderData?.first_name,
        last_name: customerOrderData?.last_name,
        email : customerOrderData?.email,
        age: "",
        gender: "male",
        type: "patient",
      }));
    } else {
      // If unchecked, clear the shipping address
      setFormValues((prev: any) => ({
        ...prev,
        first_name: "",
        last_name: "",
        email: "",
        age: "",
        gender: "",
        type: "",
      }));
    }
    setErrFormValues({
      ...errFormValues,
      first_name: "",
      last_name: "",
      email: "",
      age: "",
      gender: "",
    })
  };

  const isFormValid = () => {
    const isAnyFieldEmpty = fields.some(
      (field) => field.required && !formValues[field.name]
    );
    const hasErrors = Object.values(errorState).some(
      (error) => error && error.length > 0
    );
    return !isAnyFieldEmpty && !hasErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm(formValues, fields);

    if (Object.keys(validationErrors).length > 0) {
      setErrorState((prevErrors) => ({ ...prevErrors, ...validationErrors }));
      return;
    }

    if (!isAgree) {
      flashMessage("Please agree to service terms.", "error");
      return;
    }

    const data = {
      first_name: formValues.first_name,
      last_name: formValues.last_name,
      email: formValues.email,
      gender: formValues.gender,
      age: Number(formValues.age),
      order_id: customerOrderData?.order_id,
      customer_id: customerOrderData?.customer_id,
      barcode_number: customerOrderData?.barcode_number,
      is_clinic_inform: isClinicInform
    };

    const encryptedData = await encrypt(JSON.stringify(data));
    try {
      await dispatch(setLoader(true));
      await dispatch(
        kitRegister(
          { patient_data: encryptedData },
          async (response: SuccessMessageInterface) => {
            await dispatch(setLoader(false));
            if (response.success) {
              await dispatch(setLoader(true));
              navigate("/");
            }
          }
        )
      );
    } catch (err) {
      console.error("Error assigning kit:", err);
      flashMessage("Failed to send patient data", "error");
    } finally {
      await dispatch(setLoader(false));
    }
  };

  const chooseTypeFields = [
    {
      name: "type",
      label: "Scan/Enter the QRCode/Barcode number",
      type: "radio",
      placeholder: "Choose type",
      required: true,
      defaultValue: "manual",
      options: [
        { label: "Enter Barcode", value: "manual" },
        { label: "Scan Barcode", value: "scan" },
      ],
      colProps: { xs: 12, md: 12 },
    },
  ];

  return (
    <>
      <section>
        <div className="">
          <div className="heading-bg">
            <h1>Register Your Kit</h1>
          </div>
        </div>
      </section>
      <div className="container mt-4 mb-4">
        <div className="card">
          <div className="card-body">
            {!customerOrderData && (
              <div>
                <CommonForm
                  state={barcodeType}
                  setState={setBarcodeType}
                  errorState={errBarcodeType}
                  setErrorState={setErrBarcodeType}
                  fields={chooseTypeFields}
                />
              </div>
            )}
            <div className="barcode-input-section mb-3 mt-3">
              {showManual && (
                <div className="input-groups d-flex align-items-center gap-3">
                  <input
                    type="text"
                    placeholder="Enter QRCode/Barcode Number"
                    value={formState.barcode_number}
                    onChange={handleInputChange}
                    className="form-control"
                    disabled={!!customerOrderData}
                    onKeyDown={handleKeyDown}
                    maxLength={30}
                  />

                  {/* <CommonButton
                    type="submit"
                    className={
                      !!customerOrderData ? "disabled-btn" : "filled-btn"
                    }
                    text={!!customerOrderData ? "Verified" : "Verify"}
                    onClick={handleVerifyBarcode}
                    disabled={!!customerOrderData}
                  /> */}
                </div>
              )}
              {errorState.barcode_number && (
                <div className="text-danger mt-1 small">
                  {errorState.barcode_number}
                </div>
              )}

              {!showManual && (
                <BarcodeScanner
                  onScan={handleScan}
                  onCancel={() => {
                    setBarcodeType({
                      type: "manual",
                    });
                    setShowManual(true);
                    setFormState({
                      isScannedData: false,
                      barcode_number: "",
                    });
                  }}
                />
              )}
            </div>

            {customerOrderData && (
              <>
                {!patientFormShow && (
                  <OrderDetails
                    orderData={customerOrderData}
                    setPatientFormShow={setPatientFormShow}
                    patientFormShow={patientFormShow}
                  />
                )}
                {patientFormShow && (
                  <PatientDetailsForm
                    isOrderSelf={isOrderSelf}
                    customerOrderData={customerOrderData}
                    fields={fields}
                    formValues={formValues}
                    setFormValues={setFormValues}
                    errFormValues={errFormValues}
                    setErrFormValues={setErrFormValues}
                    handleCheckboxChange={handleCheckboxChange}
                    handleSubmit={handleSubmit}
                    isFormValid={isFormValid}
                    setPatientFormShow={setPatientFormShow}
                    patientFormShow={patientFormShow}
                    isAgree={isAgree}
                    setIsAgree={setIsAgree}
                    isClinicInform={isClinicInform}
                    setIsClinicInform={setIsClinicInform}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default KitRegister;

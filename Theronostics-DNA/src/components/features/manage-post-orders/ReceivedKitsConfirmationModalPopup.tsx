import { faInfoCircle, faQrcode } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip } from "antd";
import { Button, Modal } from "react-bootstrap";
import CommonScanner from "../../common/scanner/Scanner";
import { useAppDispatch } from "../../../redux/hooks";
import flashMessage from "../../../utils/notifications/antdMessageUtils";
import { globalSearch, setLoader } from "../../../redux/action";
import { SuccessMessageInterface } from "../../../types/redux.type";
import CommonButton from "../../common/button/CommonButton";
import { decrypt } from "../../../utils/encryption/decryption";

const ReceivedKitsConfirmationModalPopup = ({
  show,
  onHide,
  setSearchText,
  setError,
  debounceTimeout,
  setScannerModalOpen,
  searchText,
  setPatientData,
  patientData,
  isScannerModalOpen,
  error,
  onConfirm,
}: any) => {
  const dispatch = useAppDispatch();


  const validateBarcode = (barcode: string): string | null => {
    if (barcode === "") {
      return null;
    }
    if (barcode.length !== 30) {
      return "QRCode/Barcode must be exactly 30 characters long.";
    }

    const alphanumericRegex = /^[a-zA-Z0-9]+$/;
    if (!alphanumericRegex.test(barcode)) {
      return "QRCode/Barcode must contain only alphanumeric characters.";
    }

    return null;
  };

  const handleSearchInputChange = (value: string) => {
    setSearchText(value);
    const validationError = validateBarcode(value);
    setError(validationError);
    // Clear previous timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Set new timeout for 5 seconds
    debounceTimeout.current = setTimeout(() => {
      if (validationError) {
        setError(validationError);
      } else {
        if (value === "") {
          return;
        }
        setError(null);
        executeSearch(value);
      }
    }, 2000);
  };

  const handleBarcodeScan = (scannedData: any) => {
    if (scannedData?.length > 0) {
      const barcode = scannedData[scannedData.length - 1].rawValue;
      const validationError = validateBarcode(barcode);

      if (validationError) {
        flashMessage(validationError, "error");
        setError(validationError);
        return;
      }

      setSearchText(barcode);
      executeSearch(barcode);
      setScannerModalOpen(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
        debounceTimeout.current = null;
      }

      const validationError = validateBarcode(searchText);
      if (validationError) {
        flashMessage(validationError, "error");
      } else if (searchText !== "") {
        executeSearch(searchText);
      }
    }
  };

  const executeSearch = async (query: string) => {
    setError(null);
    try {
      dispatch(setLoader(true));
      setScannerModalOpen(false);
      await dispatch(
        globalSearch({}, query, async (response: SuccessMessageInterface) => {
          dispatch(setLoader(false));

          if (response && response.success) {
            if (response?.data?.kit_status !== "Not-Received") {
              flashMessage("This Kit already received", "error");
            } else {
              setPatientData({
                barcode_number: response?.data?.barcode_number,
                customer_email: response?.data?.email,
                customer_name:
                  response?.data?.first_name + " " + response?.data?.last_name,
                id: response?.data?.kit_registration_id,
                kit_status: response?.data?.kit_status,
                order_number: response?.data?.order_number,
                patient_age: response?.data?.patient_age
                  ? decrypt(response?.data?.patient_age)
                  : "",
                patient_email: response?.data?.patient_email
                  ? decrypt(response?.data?.patient_email)
                  : "",
                patient_first_name: response?.data?.patient_first_name
                  ? decrypt(response?.data?.patient_first_name)
                  : "",
                patient_gender: response?.data?.patient_gender
                  ? decrypt(response?.data?.patient_gender)
                      .charAt(0)
                      .toUpperCase() +
                    decrypt(response?.data?.patient_gender)
                      .slice(1)
                      .toLowerCase()
                  : "",
                patient_last_name: response?.data?.patient_last_name
                  ? decrypt(response?.data?.patient_last_name)
                  : "",
              });
            }
          }
        })
      );
    } catch (error) {
      console.error("Error executing search:", error);
    } finally {
      dispatch(setLoader(false));
    }
  };

  return (
    <Modal show={show} onHide={onHide} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title className="modelTitle">Recieved Kit</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <>
          {!patientData && (
            <>
              <h6 className="mb-3">Enter/Scan QRCode/Barcode number</h6>
              <div className="d-flex  align-items-center gap-3 w-full">
                <div className="search_outer">
                  <input
                    placeholder="Search by QRCode/Barcode Number"
                    onChange={(e) => handleSearchInputChange(e.target.value)}
                    value={searchText}
                    onKeyDown={handleKeyDown}
                    maxLength={30}
                  />
                  <div className="info-icon">
                    <Tooltip title={`Find Kit by QRCode/Barcode Number`}>
                      <FontAwesomeIcon icon={faInfoCircle} className="fa-fw" />
                    </Tooltip>
                  </div>
                </div>

                <Tooltip title={`Scan the QRCode/Barcode`}>
                  <button
                    className="action_btn"
                    onClick={() => setScannerModalOpen(!isScannerModalOpen)}
                  >
                    <FontAwesomeIcon icon={faQrcode} />
                  </button>
                </Tooltip>
              </div>
              {error && (
                <div className="text-danger error-text mt-1">{error}</div>
              )}

              {isScannerModalOpen && (
                <div className="mt-4">
                  <CommonScanner onScan={handleBarcodeScan} />
                </div>
              )}
            </>
          )}

          {patientData && (
            <>
              <div className="report_detail container px-0">
                <div className="row row-gap-3">
                  <div className="col-md-6">
                    <div className="report_inn">
                      <p className="mb-1">
                        <b>QRCode/Barcode Number</b>
                      </p>
                      <p className="txt">{patientData?.barcode_number}</p>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="report_inn">
                      <p className="mb-1">
                        <b>Order ID</b>
                      </p>
                      <p className="txt">{patientData?.order_number}</p>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="report_inn">
                      <p className="mb-1">
                        <b>Customer Name</b>
                      </p>
                      <p className="txt">{patientData?.customer_name}</p>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="report_inn">
                      <p className="mb-1">
                        <b>Customer Email</b>
                      </p>
                      <p className="txt">{patientData?.customer_email}</p>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="report_inn">
                      <p className="mb-1">
                        <b>Patient Name</b>
                      </p>
                      <p className="txt">
                        {patientData?.patient_first_name +
                          " " +
                          patientData?.patient_last_name}
                      </p>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="report_inn">
                      <p className="mb-1">
                        <b>Patient Email</b>
                      </p>
                      <p className="txt">{patientData?.patient_email}</p>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="report_inn">
                      <p className="mb-1">
                        <b>Patient Age</b>
                      </p>
                      <p className="txt">{patientData?.patient_age}</p>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="report_inn">
                      <p className="mb-1">
                        <b>Patient Gender</b>
                      </p>
                      <p className="txt">{patientData?.patient_gender}</p>
                    </div>
                  </div>
                </div>
                <div className="col-sm-12">
                <p className="mt-2">
                  Are you sure you want to change the status of this kit to
                  Received? This action is final and cannot be reverted. Please
                  confirm that the kit has been received.
                </p>
                </div>
              </div>
              
            </>
          )}
        </>
      </Modal.Body>
      <Modal.Footer>
        <div className="d-flex justify-content-between w-100 btn_wrap mt-3">
          <div className="btn_grp">
            <Button className="outlined-btn" onClick={onHide}>
              Cancel
            </Button>
            <CommonButton
              type="submit"
              className={!patientData ? "disabled-btn" : "filled-btn"}
              text="Received Kit"
              onClick={onConfirm}
              disabled={!patientData}
            />
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ReceivedKitsConfirmationModalPopup;

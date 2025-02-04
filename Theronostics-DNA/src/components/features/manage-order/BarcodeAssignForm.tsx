import React, { useRef, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { AssignKitToUser, closeModal, setLoader } from "../../../redux/action";
import { RootState } from "../../../redux/store";
import { SuccessMessageInterface } from "../../../types/redux.type";
import flashMessage from "../../../utils/notifications/antdMessageUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faQrcode,
  faSave,
  faTimes,
  faPlus,
  faTrash,
  faCheck,
  faEdit,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import CommonButton from "../../common/button/CommonButton";
import ConfirmationModal from "../../common/Modal/ConfirmationModal";
import { Tooltip } from "antd";
import NoScannedImage from "../../../assets/images/noscannedCode.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { MANAGE_ORDER_APP_URL } from "../../../constants/appUrl";
import { FetchOrderDetailsParams } from "../../../types/manage-order.type";
import { handleFetchAllOrderDetails } from "../../../pages/manage_order/orderEvents";
import CommonScanner from "../../common/scanner/Scanner";
// Barcode Item Interface
interface BarcodeItem {
  id: string;
  value: string;
  isEditable: boolean;
  isDeletable: boolean;
  isNewValue: boolean;
}

const BarcodeAssignForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedData } = useAppSelector((state: RootState) => state.modal);
  const scannedCodes: any = [];
  // State Initialization with Specified Structure
  const [barcodes, setBarcodes] = useState<BarcodeItem[]>([
    ...(selectedData?.barcode_numbers
      ? selectedData.barcode_numbers.split(",").map((barcode: string) => ({
          id: crypto.randomUUID(),
          value: barcode.trim(),
          isEditable: false,
          isDeletable: false,
          isNewValue: false,
        }))
      : []),
  ]);

  // UI and Input States
  const [inputBarcode, setInputBarcode] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [showBarcodeList, setShowBarcodeList] = useState(true);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showCancelConfirmationModal, setShowCancelConfirmationModal] =
    useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [editingBarcodeId, setEditingBarcodeId] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  // Computed Values
  const orderQuantity = selectedData.quantity || 0;
  const totalAssignedBarcodes = barcodes.length;
  const validateBarcode = useCallback(
    (barcode: string): string | null => {
      if (barcode.length !== 30) {
        return "QRCode/Barcode must be exactly 30 characters long";
      }

      const alphanumericRegex = /^[a-zA-Z0-9]+$/;
      if (!alphanumericRegex.test(barcode)) {
        return "QRCode/Barcode must be alphanumeric";
      }

      // Filter out the currently editing barcode from the existing barcodes check
      const existingBarcodes = barcodes
        .filter((item) => item.id !== editingBarcodeId)
        .map((item) => item.value.trim());

      if (existingBarcodes.includes(barcode.trim())) {
        return "QRCode/Barcode already exists";
      }

      return null;
    },
    [barcodes, editingBarcodeId]
  );

  // Input Change Handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 30);

    const error = inputValue.length > 0 ? validateBarcode(inputValue) : null;

    setInputBarcode(inputValue);
    setValidationError(error);
  };

  // Handle key down to add/update on Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputBarcode.length > 0) {
      handleAddBarcode();
    }
  };

  // Add/Update Barcode Handler
  const handleAddBarcode = () => {
    const error = validateBarcode(inputBarcode);

    if (error) {
      setValidationError(error);
      return;
    }

    if (editingBarcodeId) {
      // Update existing barcode
      setBarcodes((prev) =>
        prev.map((item) =>
          item.id === editingBarcodeId ? { ...item, value: inputBarcode } : item
        )
      );
      setEditingBarcodeId(null);
      flashMessage("QRCode/Barcode number updated successfully.", "success");
    } else {
      // Add new barcode
      setBarcodes((prev) => [
        {
          id: crypto.randomUUID(),
          value: inputBarcode,
          isEditable: true,
          isDeletable: true,
          isNewValue: true,
        },
        ...prev,
      ]);
    }

    setInputBarcode("");
    setValidationError(null);
    inputRef.current?.focus();
  };

  // Scan Barcode Handler
  const handleScan = (result: any) => {
    if (result && result.length > 0) {
      const scannedBarcode = result[result.length - 1].rawValue;
      const error = validateBarcode(scannedBarcode);

      if (error) {
        flashMessage(error, "error");
        return;
      }

      if (scannedCodes.includes(scannedBarcode)) {
        flashMessage("This QRCode/Barcode already exists", "error");
        return;
      } else {
        scannedCodes.push(scannedBarcode);
      }

      setBarcodes((prev) => [
        {
          id: crypto.randomUUID(),
          value: scannedBarcode,
          isEditable: false,
          isDeletable: true,
          isNewValue: true,
        },
        ...prev,
      ]);

      flashMessage("QRCode/Barcode scanned successfully", "success");

      // Stop scanning if all barcodes are assigned
      if (barcodes.length + scannedCodes.length === orderQuantity) {
        setIsScanning(false);
        setShowBarcodeList(true);
      }
    }
  };

  // Submit Handler
  const handleSubmit = async () => {
    const allBarcodes = barcodes
      .filter((item) => item.isNewValue === true)
      .map((item) => item.value.trim());

    if (
      !showConfirmationModal &&
      barcodes.length !== 0 &&
      barcodes.length < orderQuantity
    ) {
      setShowConfirmationModal(true);
      return;
    }

    try {
      await dispatch(setLoader(true));
      await dispatch(
        AssignKitToUser(
          { barcode_numbers: allBarcodes.join(",") },
          selectedData.id,
          async (response: SuccessMessageInterface) => {
            if (response.success) {
              dispatch(closeModal());
              flashMessage("Barcode(s) assigned successfully", "success");

              if (barcodes.length !== 0 && barcodes.length < orderQuantity) {
                const searchParams = new URLSearchParams(location.search);
                const initialParams: FetchOrderDetailsParams = {
                  currentPage: Number(searchParams.get("currentPage")) || 1,
                  perPage: Number(searchParams.get("perPage")) || 10,
                  sort: searchParams.get("sort") || "desc",
                  sortColumn: searchParams.get("sortColumn") || "created_at",
                  searchText: searchParams.get("searchText") || "",
                  orderStatus: searchParams.get("orderStatus") || "pending",
                  paymentStatus:
                    searchParams.get("paymentStatus") || "completed",
                };

                handleFetchAllOrderDetails(
                  dispatch,
                  initialParams,
                  navigate,
                  location
                );
              } else {
                navigate(
                  {
                    pathname: MANAGE_ORDER_APP_URL,
                    search: `?currentPage=1&sort=${"desc"}&sortColumn=${"created_at"}&searchText=${""}&orderStatus=${
                      barcodes.length !== 0 && barcodes.length < orderQuantity
                        ? "pending"
                        : "processing"
                    }&paymentStatus=${"completed"}&perPage=${String(10)}`,
                  },
                  { replace: false }
                );
              }
            }
          }
        )
      );
    } catch (err) {
      console.error("Error assigning kit:", err);
      flashMessage("Error assigning barcodes", "error");
    } finally {
      await dispatch(setLoader(false));
    }
  };

  // Delete Barcode Handler
  const handleDeleteBarcode = (id: string) => {
    setBarcodes((prev) => prev.filter((barcode) => barcode.id !== id));
    if (editingBarcodeId && editingBarcodeId === id) {
      setEditingBarcodeId(null);
      setValidationError(null);
      setInputBarcode("");
    }
    flashMessage("QRCode/Barcode number deleted successfully.", "success");
  };

  // Edit Barcode Handler
  const handleEditBarcode = (barcode: BarcodeItem) => {
    setInputBarcode(barcode.value);
    setEditingBarcodeId(barcode.id);
  };

  // Computed Disabled States
  const isSubmitDisabled = validationError !== null || barcodes.length === 0;
  const isInputDisabled = barcodes.length >= orderQuantity && !editingBarcodeId;
  const isAddButtonDisabled = inputBarcode === "" || validationError !== null;
  // const isViewButtonDisabled = barcodes.length === 0;

  return (
    <div className="px-0 report_detail container">
      {/* Order Details Section */}
      <div className="row row-gap-3">
        <div className="col-md-4">
          <div className="report_inn">
            <p className="mb-1">
              <b>Order ID</b>
            </p>
            <p className="txt">{selectedData.order_number}</p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="report_inn">
            <p className="mb-1">
              <b>Quantity Ordered</b>
            </p>
            <p className="txt">{orderQuantity}</p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="report_inn">
            <p className="mb-1">
              <b>Assigned Barcode(s) List</b>
            </p>
            <div className="d-flex gap-3 align-items-center">
              <p className="txt">{totalAssignedBarcodes}</p>
              <Tooltip title="Click here to view the scanned barcodes.">
                <button
                  className="view_action_btn gap-1 view_barcode_button"
                  onClick={() => {
                    setShowBarcodeList(!showBarcodeList);
                    setIsScanning(false);
                  }}
                >
                  <FontAwesomeIcon icon={faList} />
                  <span>View</span>
                </button>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>

      {/* Barcode Input Section */}
      {!isScanning && (
        <div className="barcode-input-section my-3">
          <div className="input-group">
            <input
              ref={inputRef}
              type="text"
              placeholder={editingBarcodeId ? "Edit Barcode" : "Enter Barcode"}
              value={inputBarcode}
              onChange={handleInputChange}
              className="form-control"
              disabled={isInputDisabled}
              maxLength={30}
              onKeyDown={handleKeyDown}
            />
            {editingBarcodeId ? (
              <>
                <Tooltip title="Update">
                  <button
                    type="button"
                    className={
                      isAddButtonDisabled ? "disabled-btn" : "filled-btn"
                    }
                    onClick={handleAddBarcode}
                    disabled={isAddButtonDisabled}
                  >
                    <FontAwesomeIcon icon={faCheck} />
                  </button>
                </Tooltip>
                <Tooltip title="Cancel">
                  <button
                    type="button"
                    className="danger-btn"
                    onClick={() => {
                      setInputBarcode("");
                      setEditingBarcodeId(null);
                      setValidationError(null);
                    }}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </Tooltip>
              </>
            ) : (
              <Tooltip
                title={
                  isAddButtonDisabled
                    ? "Please insert some value"
                    : "Add inserted value"
                }
              >
                <button
                  type="button"
                  className={
                    isAddButtonDisabled ? "disabled-btn" : "filled-btn"
                  }
                  onClick={handleAddBarcode}
                  disabled={isAddButtonDisabled}
                >
                  <span className="me-2">
                    <FontAwesomeIcon icon={faPlus} />
                  </span>
                  Add
                </button>
              </Tooltip>
            )}
          </div>
          {validationError && (
            <div className="text-danger mt-1 small">{validationError}</div>
          )}
        </div>
      )}

      {/* Barcode List Section */}
      {showBarcodeList && (
        <div className="barcode-list-section border rounded p-3 mb-3">
          <h5 className="mb-3 fs-6">Assigned Barcodes</h5>
          <div className="barcode-list">
            {barcodes && barcodes.length > 0 ? (
              barcodes.map((barcode, index) => (
                <div key={barcode.id} className="barcode-item">
                  <div>
                    <span className="barcode-text me-1">
                      {barcodes.length - index}.
                    </span>
                    <span className="barcode-text">{barcode.value}</span>
                  </div>
                  <div className="barcode-actions">
                    {barcode.isEditable && (
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => handleEditBarcode(barcode)}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                    )}
                    {barcode.isDeletable && (
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteBarcode(barcode.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="d-flex flex-wrap gap-2 text-center justify-content-center">
                <img src={NoScannedImage} alt="No Scanned Barcode" />
                <p className="w-100 m-0">No Barcode(s) assigned.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Barcode Scanner */}
      {isScanning && (
       <CommonScanner onScan={handleScan} />
      )}

      {/* Action Buttons */}
      <div className={`mt-3 d-flex justify-content-between flex-wrap gap-2`}>
        {isScanning ? (
          // Buttons when scanning
          <div className="d-flex gap-2 flex-wrap">
            <CommonButton
              type="button"
              className="danger-btn"
              text="Cancel"
              onClick={() => {
                setIsScanning(false);
                setShowBarcodeList(true);
              }}
            />
          </div>
        ) : (
          // Regular buttons when not scanning
          <div className="d-flex gap-2 align-items-center">
            <CommonButton
              type="button"
              className="danger-btn"
              text="Cancel"
              onClick={() =>
                barcodes.some((barcode) => barcode.isNewValue)
                  ? setShowCancelConfirmationModal(true)
                  : dispatch(closeModal())
              }
            />
          </div>
        )}
        <div className="d-flex gap-2 align-items-center">
          {!isScanning && (
            <CommonButton
              type="button"
              className={isInputDisabled ? "disabled-btn" : "outlined-btn"}
              text="Scan"
              icon={<FontAwesomeIcon icon={faQrcode} />}
              onClick={() => {
                setIsScanning(true);
                setShowBarcodeList(false);
                setInputBarcode("");
                setEditingBarcodeId(null);
              }}
              disabled={isInputDisabled}
            />
          )}
          <CommonButton
            type="submit"
            className={isSubmitDisabled ? "disabled-btn" : "filled-btn"}
            text="Submit"
            icon={<FontAwesomeIcon icon={faSave} />}
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
          />
        </div>
      </div>

      {/* Confirmation Modals */}
      <ConfirmationModal
        show={showConfirmationModal}
        onHide={() => setShowConfirmationModal(false)}
        onConfirm={() => {
          setShowConfirmationModal(false);
          handleSubmit();
        }}
        title="Incomplete QRCode/Barcode Assignment"
        message={`You have assigned ${totalAssignedBarcodes} out of ${orderQuantity} barcodes. 
          The order will not be processed for dispatch until all barcodes are assigned. 
          Do you want to continue?`}
      />

      <ConfirmationModal
        show={showCancelConfirmationModal}
        onHide={() => setShowCancelConfirmationModal(false)}
        onConfirm={() => {
          setShowCancelConfirmationModal(false);
          dispatch(closeModal());
        }}
        title="Confirm QRCode/Barcode Removal"
        message={`Are you sure you want to discard the assigned barcodes? This action will remove all the barcodes from the list without saving them to the database.`}
      />
    </div>
  );
};

export default BarcodeAssignForm;

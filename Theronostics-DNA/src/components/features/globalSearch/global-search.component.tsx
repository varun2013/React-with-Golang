import React, {  useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import flashMessage from "../../../utils/notifications/antdMessageUtils";
import {
  globalSearch,
  patientUpdateStatus,
  setLoader,
} from "../../../redux/action";
import { SuccessMessageInterface } from "../../../types/redux.type";
import { Tooltip } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faQrcode } from "@fortawesome/free-solid-svg-icons";
import BarcodeScannerModal from "./barcode-scanner-modal.component";
import OrderDetailsModal from "./order-details-modal.component";
import ConfirmationModal from "../../common/Modal/ConfirmationModal";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../../redux/store";
import {
  MANAGE_ORDER_APP_URL,
  MANAGE_POST_BACK_ORDERS_APP_URL,
} from "../../../constants/appUrl";

const GlobalSearch: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState<string>("");

  const [isScannerModalOpen, setScannerModalOpen] = useState<boolean>(false);
  const [isOrderDetailsModalOpen, setOrderDetailsModalOpen] =
    useState<boolean>(false);
  const [
    isProcessingConfirmationModalOpen,
    setIsProcessingConfirmationModalOpen,
  ] = useState(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const { response } = useAppSelector((state: RootState) => state.globalSearch);

  const handleSearchInputChange = (value: string) => {
    setSearchText(value);

    // Clear previous timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Set new timeout for 5 seconds
    debounceTimeout.current = setTimeout(() => {
      const validationError = validateBarcode(value);
      if (validationError) {
        flashMessage(validationError, "error");
      } else {
        if (value === "") {
          return;
        }

        executeSearch(value);
      }
    }, 2000);
  };

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

  const handleBarcodeScan = (scannedData: any) => {
    if (scannedData?.length > 0) {
      const barcode = scannedData[scannedData.length - 1].rawValue;
      const validationError = validateBarcode(barcode);

      if (validationError) {
        flashMessage(validationError, "error");
        return;
      }

      setSearchText(barcode);
      executeSearch(barcode);
      setScannerModalOpen(false);
    }
  };

  const executeSearch = async (query: string) => {
    try {
      dispatch(setLoader(true));
      setScannerModalOpen(false);
      await dispatch(
        globalSearch({}, query, async (response: SuccessMessageInterface) => {
          dispatch(setLoader(false));

          if (response && response.success) {
            setOrderDetailsModalOpen(true);
          }
        })
      );
    } catch (error) {
      console.error("Error executing search:", error);
    } finally {
      dispatch(setLoader(false));
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
      }  else if (searchText !== "") {
        executeSearch(searchText);
      }
    }
  };

  const handleDropdownChange = (newStatus: string) => {
    setScannerModalOpen(false);
    if (newStatus === "processing") {
      if (!response?.quantity_matches) {
        setIsProcessingConfirmationModalOpen(true);
      }
    } else if (newStatus === "dispatched") {
      if (!response?.quantity_matches) {
        setIsProcessingConfirmationModalOpen(true);
      } else {
        setOrderDetailsModalOpen(false);
        navigate(
          {
            pathname: MANAGE_ORDER_APP_URL,
            search: `?currentPage=1&sort=${"desc"}&sortColumn=${"created_at"}&searchText=${
              response?.order_number
            }&orderStatus=${"processing"}&paymentStatus=${"completed"}&perPage=${String(
              10
            )}&isDispatchModalOpen=${true}`,
          },
          { replace: false }
        );
      }
    }
  };

  const handleProcessingModalConfirm = () => {
    setIsProcessingConfirmationModalOpen(false);
    setOrderDetailsModalOpen(false);
    navigate(
      {
        pathname: MANAGE_ORDER_APP_URL,
        search: `?currentPage=1&sort=${"desc"}&sortColumn=${"created_at"}&searchText=${
          response?.order_number
        }&orderStatus=${"pending"}&paymentStatus=${"completed"}&perPage=${String(
          10
        )}&isAssignBarcodeModalOpen=${true}`,
      },
      { replace: false }
    );
  };

  const handleKitStatusDropdownChange = async (newStatus: string) => {
    if (newStatus === "Received") {
      let data = {
        status: newStatus,
        reason: "",
      };
      const barcode = response?.barcode_number;
      try {
        await dispatch(setLoader(true));
        await dispatch(
          patientUpdateStatus(
            {
              ...data,
            },
            response?.kit_registration_id,
            async (response: SuccessMessageInterface) => {
              await dispatch(setLoader(false));
              if (response.success) {
                await dispatch(setLoader(true));
                await dispatch(
                  globalSearch(
                    {},
                    barcode,
                    async (response: SuccessMessageInterface) => {
                      dispatch(setLoader(false));

                      if (response && response.success) {
                        setOrderDetailsModalOpen(true);
                      }
                    }
                  )
                );
              }
            }
          )
        );
      } catch (err) {
        console.error("Error updating user:", err);
        return { general: "Failed to update user" };
      } finally {
        await dispatch(setLoader(false));
      }
    } else if (newStatus === "Send") {
      setScannerModalOpen(false);
      setOrderDetailsModalOpen(false);
      navigate(
        {
          pathname: MANAGE_POST_BACK_ORDERS_APP_URL,
          search: `?currentPage=1&sort=${"desc"}&sortColumn=${"created_at"}&searchText=${
            response?.barcode_number
          }&status=${response?.kit_status}&perPage=${String(
            10
          )}&isSendModalOpen=${true}&patientID=${
            response?.kit_registration_id
          }`,
        },
        { replace: false }
      );
    } else {
      setScannerModalOpen(false);
      setOrderDetailsModalOpen(false);
      navigate(
        {
          pathname: MANAGE_POST_BACK_ORDERS_APP_URL,
          search: `?currentPage=1&sort=${"desc"}&sortColumn=${"created_at"}&searchText=${
            response?.barcode_number
          }&status=${response?.kit_status}&perPage=${String(
            10
          )}&isRejectModalOpen=${true}&patientID=${
            response?.kit_registration_id
          }`,
        },
        { replace: false }
      );
    }
  };

  const handleUploadReport = () => {
    setScannerModalOpen(false);
    setOrderDetailsModalOpen(false);
    navigate(
      {
        pathname: MANAGE_POST_BACK_ORDERS_APP_URL,
        search: `?currentPage=1&sort=${"desc"}&sortColumn=${"created_at"}&searchText=${
          response?.barcode_number
        }&status=${response?.kit_status}&perPage=${String(
          10
        )}&isUploadReportModalOpen=${true}&patientID=${
          response?.kit_registration_id
        }`,
      },
      { replace: false }
    );
  }
  return (
    <>
      <div className="d-flex justify-content-center align-items-center gap-3 search-bar ">
        <div className="search_outer">
          <input
            placeholder="Search by QRCode/Barcode number"
            onChange={(e) => handleSearchInputChange(e.target.value)}
            value={searchText}
            onKeyDown={handleKeyDown}
            maxLength={30}
          />
          <div className="info-icon">
            <Tooltip title={`Search by QRCode/Barcode Number`}>
              <FontAwesomeIcon icon={faInfoCircle} className="fa-fw" />
            </Tooltip>
          </div>
        </div>
        <button
          className="action_btn"
          onClick={() => setScannerModalOpen(true)}
        >
          <FontAwesomeIcon icon={faQrcode} />
        </button>
      </div>

      <BarcodeScannerModal
        show={isScannerModalOpen}
        onHide={() => setScannerModalOpen(false)}
        handleScan={handleBarcodeScan}
      />

      <OrderDetailsModal
        show={isOrderDetailsModalOpen}
        onHide={() => setOrderDetailsModalOpen(false)}
        handleDropdownChange={handleDropdownChange}
        handleKitStatusDropdownChange={handleKitStatusDropdownChange}
        handleUploadReport={handleUploadReport}
      />
      <ConfirmationModal
        show={isProcessingConfirmationModalOpen}
        onHide={() => setIsProcessingConfirmationModalOpen(false)}
        onConfirm={handleProcessingModalConfirm}
        title="Confirm Order Status Change"
        message="There are some barcodes need to assign before proceed to change the status to processing. Will you want to assign barcodes to this order?"
      />
    </>
  );
};

export default GlobalSearch;

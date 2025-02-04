import {
  faInfoCircle,
  faQrcode,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import CommonTable from "../../common/table/CommonTable";
import { Column } from "../../../types/table.type";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";
import moment from "moment";
import { decrypt } from "../../../utils/encryption/decryption";
import { handleFetchAllKitRegisterDetails } from "../../../pages/manage-post-back-orders/manage-post-orders.event";
import { Tooltip } from "antd";
import CommonDropdown from "../../common/dropdown/CommonDropdown";
import {
  closeModal,
  fetchLabList,
  openModal,
  patientUpdateStatus,
  setLoader,
} from "../../../redux/action";
import ThemeImage from "../../common/icons/ThemeImage";
import CommonModal from "../../common/Modal/CommonModal";
import ViewPostOrderModal from "./view-post-order-details.modal.component";
import { Button } from "react-bootstrap";
import KitStatusConfirmationModal from "../manage-order/KitStatusConfirmationModal";
import UploadLabReport from "./upload-lab-report.component";
import { SuccessMessageInterface } from "../../../types/redux.type";
import flashMessage from "../../../utils/notifications/antdMessageUtils";
import { useLocation, useNavigate } from "react-router-dom";
import { IFetchPostOrdersDetailsParams } from "../../../types/manage-post-order.type";
import LabDetailsModal from "./lab-details-modal.component";
import { MANAGE_POST_BACK_ORDERS_APP_URL } from "../../../constants/appUrl";
import CommonScanner from "../../common/scanner/Scanner";
import StatusSelect from "./StatusSelect";
import CommonButton from "../../common/button/CommonButton";
import ReceivedKitsConfirmationModalPopup from "./ReceivedKitsConfirmationModalPopup";

const PostOrderList = () => {
  const {
    records,
    page,
    totalPages,
    sort,
    sortColumn,
    searchText,
    status,
    perPage,
    totalRecords,
  } = useAppSelector((state: RootState) => state.kitRegister);
  const { isOpen, modalType, selectedData } = useAppSelector(
    (state: RootState) => state.modal
  );
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const currentTheme = useAppSelector((state: RootState) => state.theme.theme);

  const [localSearchText, setLocalSearchText] = useState(searchText);
  const [localStatus, setLocalStatus] = useState(status);
  const [localPerPage, setLocalPerPage] = useState(perPage);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [selectedStatusData, setSelectedStatusData] = useState<any>({
    status: null,
    id: null,
    reason: null,
  });
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [labDetailsModalOpen, setLabDetailsModalOpen] = useState(false);
  const [selectedKitData, setSelectedKitData] = useState<any>({
    id: null,
    lab_name: null,
    lab_address: null,
    nhi_number: null,
    type: "new",
    lab_id: 0,
  });
  const [errSelectedKitData, setErrSelectedKitData] = useState<any>({
    id: null,
    lab_name: null,
    lab_address: null,
    nhi_number: null,
    type: null,
    lab_id: null,
  });
  const searchParams = new URLSearchParams(location.search);

  const [receivedConfirmationModalOpen, setReceivedConfirmationModalOpen] =
    useState(false);

  const [receivedSearchText, setReceivedSearchText] = useState<string>("");
  const [receivedError, setReceivedError] = useState<string | null>(null);
  const [isReceivedScannerModalOpen, setReceivedScannerModalOpen] = useState<boolean>(false);
  const receivedDebounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const [receivedPatientData, setReceivedPatientData] = useState<any>(null);


  useEffect(() => {
    setLocalSearchText(searchParams.get("searchText") || "");
    setLocalStatus(searchParams.get("status") || "");
    setLocalPerPage(Number(searchParams.get("perPage")) || 10);

    const initialParams: IFetchPostOrdersDetailsParams = {
      currentPage: Number(searchParams.get("currentPage")) || 1,
      perPage: Number(searchParams.get("perPage")) || 10,
      sort: searchParams.get("sort") || "desc",
      sortColumn: searchParams.get("sortColumn") || "created_at",
      searchText: searchParams.get("searchText") || "",
      status: searchParams.get("status") || "Not-Received",
    };

    handleFetchAllKitRegisterDetails(
      dispatch,
      initialParams,
      navigate,
      location
    );

    // eslint-disable-next-line
  }, [location.search]);

  const handleCallModal = async () => {
    const isSendModalOpen = searchParams.get("isSendModalOpen");
    const isRejectModalOpen = searchParams.get("isRejectModalOpen");
    const isUploadReportModalOpen = searchParams.get("isUploadReportModalOpen");

    const patientID = searchParams.get("patientID");

    if (isSendModalOpen) {
      setLabDetailsModalOpen(true);
      setSelectedKitData({
        ...selectedKitData,
        id: patientID,
        type: "new",
      });
      try {
        await dispatch(setLoader(true));
        await dispatch(fetchLabList({}));
      } catch (err) {
        console.error("Error updating user:", err);
        return { general: "Failed to update user" };
      } finally {
        await dispatch(setLoader(false));
      }
    } else if (isRejectModalOpen) {
      setIsConfirmationModalOpen(true);
      setSelectedStatusData({
        status: "Reject",
        id: patientID,
        reason: null,
      });
    } else if (isUploadReportModalOpen && records && records.length === 1) {
      const data = records[0];
      dispatch(openModal({ type: "add", data }));
    }
  };
  useEffect(() => {
    handleCallModal();
    // eslint-disable-next-line
  }, [location.search, records]);

  const columns: Column[] = [
    {
      key: "barcode_number",
      label: "QRCode/Barcode Number",
      sortable: true,
      render: (value: any, item: any) => (
        <span
          className="view-modal-open"
          onClick={() => dispatch(openModal({ type: "view", data: item }))}
        >
          {value}
        </span>
      ),
    },
    { key: "patient_first_name", label: "Patient First Name", sortable: false },
    { key: "patient_last_name", label: "Patient Last Name", sortable: false },
    { key: "patient_email", label: "Patient Email", sortable: false },
    { key: "patient_age", label: "Patient Age", sortable: false },
    { key: "patient_gender", label: "Patient Gender", sortable: false },
    { key: "created_at", label: "Register On", sortable: true },

    {
      key: "kit_status",
      label: "Status",
      sortable: false,
      className: "status_table_data",
      render: (value: string, item: any) => {
        return (
          <StatusSelect
            value={value}
            item={item}
            handleDropdownStatusChange={handleDropdownStatusChange}
            setReceivedConfirmationModalOpen={setReceivedConfirmationModalOpen}
            setReceivedPatientData={setReceivedPatientData}
          />
        );
      },
    },
  ];

  const handleDropdownStatusChange = async (
    patientId: number,
    newStatus: string
  ) => {
    if (newStatus === "Reject") {
      setIsConfirmationModalOpen(true);
      setSelectedStatusData({
        status: newStatus,
        id: patientId,
        reason: null,
      });
    } else if (newStatus === "Send") {
      setLabDetailsModalOpen(true);
      setSelectedKitData({
        ...selectedKitData,
        id: patientId,
        type: "new",
      });
      try {
        await dispatch(setLoader(true));
        await dispatch(fetchLabList({}));
      } catch (err) {
        console.error("Error updating user:", err);
        return { general: "Failed to update user" };
      } finally {
        await dispatch(setLoader(false));
      }
    } else {
      handleStatusChange(patientId, newStatus, "");
    }
  };

  const handleCancelConfirmationPopup = () => {
    setIsConfirmationModalOpen(false);
    setSelectedStatusData({
      status: null,
      id: null,
      reason: null,
    });
  };

  const handleConfirmConfirmationPopup = (reason: string) => {
    handleStatusChange(
      selectedStatusData.id,
      selectedStatusData.status,
      reason
    );
    setIsConfirmationModalOpen(false);
    setSelectedStatusData({
      status: null,
      id: null,
      reason: null,
    });
  };

  const handleStatusChange = async (
    patientId: number,
    newStatus: string,
    reason: string
  ) => {
    let data = {};
    if (newStatus === "Send") {
      data = {
        status: newStatus,
        reason,
        lab_name: selectedKitData.lab_name,
        lab_address: selectedKitData.lab_address,
        nhi_number: selectedKitData.nhi_number,
        type: selectedKitData.type,
        lab_id: selectedKitData.lab_id,
      };
      handleLabDetailsModalClose();
    } else {
      data = {
        status: newStatus,
        reason,
      };
    }
    try {
      await dispatch(setLoader(true));
      await dispatch(
        patientUpdateStatus(
          {
            ...data,
          },
          patientId,
          async (response: SuccessMessageInterface) => {
            await dispatch(setLoader(false));
            if (response.success) {
              await dispatch(setLoader(true));
              navigate(
                {
                  pathname: MANAGE_POST_BACK_ORDERS_APP_URL,
                  search: `?currentPage=${String(
                    1
                  )}&sort=${"desc"}&sortColumn=${"created_at"}&searchText=${""}&status=${newStatus}&perPage=${String(
                    10
                  )}`,
                },
                { replace: false }
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
  };

  const formattedRecords =
    records && records.length > 0
      ? records.map((data: any) => ({
          ...data,
          created_at: moment(data.created_at).format("YYYY-MM-DD"),
          patient_first_name: data?.patient_first_name
            ? decrypt(data?.patient_first_name)
            : "",
          patient_last_name: data?.patient_last_name
            ? decrypt(data?.patient_last_name)
            : "",
          patient_email: data?.patient_email
            ? decrypt(data?.patient_email)
            : "",
          patient_age: data?.patient_age ? decrypt(data?.patient_age) : "",
          patient_gender: data?.patient_gender
            ? decrypt(data?.patient_gender).charAt(0).toUpperCase() +
              decrypt(data?.patient_gender).slice(1).toLowerCase()
            : "",
        }))
      : [];

  const handleSearchInputChange = (value: string) => {
    setLocalSearchText(value);

    // Clear the previous timeout if it exists
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set a new timeout
    const newTimeout = setTimeout(() => {
      handleSearch(value);
    }, 300); // Adjust the delay as needed (300 ms in this case)

    setSearchTimeout(newTimeout);
  };

  const handleSearch = (value: string) => {
    handleFetchAllKitRegisterDetails(
      dispatch,
      {
        currentPage: 1,
        sort,
        sortColumn,
        searchText: value,
        status,
        perPage,
      },
      navigate,
      location
    );
  };

  // const handleStatusFilter = (value: string) => {
  //   setLocalStatus(value); // now `value` is correctly typed
  //   handleFetchAllKitRegisterDetails(
  //     dispatch,
  //     {
  //       currentPage: 1,
  //       sort,
  //       sortColumn,
  //       searchText: localSearchText,
  //       status: value,
  //       perPage,
  //     },
  //     navigate,
  //     location
  //   );
  // };

  const handlePerPageFilter = (value: number) => {
    setLocalPerPage(Number(value));
    handleFetchAllKitRegisterDetails(
      dispatch,
      {
        currentPage: 1,
        sort,
        sortColumn,
        searchText: localSearchText,
        status: localStatus,
        perPage: Number(value),
      },
      navigate,
      location
    );
  };

  const handleSort = (column: string) => {
    const newDirection = sort === "asc" ? "desc" : "asc";
    handleFetchAllKitRegisterDetails(
      dispatch,
      {
        currentPage: page,
        sort: newDirection,
        sortColumn: column,
        searchText,
        status,
        perPage,
      },
      navigate,
      location
    );
  };

  const handlePageChange = (selectedItem: { selected: number }) => {
    handleFetchAllKitRegisterDetails(
      dispatch,
      {
        currentPage: selectedItem.selected + 1,
        sort,
        sortColumn,
        searchText,
        status,
        perPage,
      },
      navigate,
      location
    );
  };

  const renderActions = (data: any) => (
    <div className="actions_wrap">
      <Tooltip title={`View Patient Details`}>
        <button
          className="action_btn"
          onClick={() => dispatch(openModal({ type: "view", data }))}
        >
          <ThemeImage imageName="viewImage" />
        </button>
      </Tooltip>
      <Tooltip
        title={
          data?.kit_status === "Not-Received"
            ? "Kit not received yet."
            : data?.kit_status === "Reject"
            ? "Kit rejected."
            : `Upload Patient Lab Report`
        }
      >
        <button
          className={
            data?.kit_status !== "Send" ? "action-disabled-btn" : "action_btn"
          }
          onClick={() => dispatch(openModal({ type: "add", data }))}
          disabled={data?.kit_status !== "Send"}
        >
          <FontAwesomeIcon icon={faUpload} />
        </button>
      </Tooltip>
    </div>
  );

  const validateBarcode = (barcode: string): string | null => {
    if (barcode.length !== 30) {
      return "QRCode/Barcode must be exactly 30 characters long";
    }

    const alphanumericRegex = /^[a-zA-Z0-9]+$/;
    if (!alphanumericRegex.test(barcode)) {
      return "QRCode/Barcode must be alphanumeric";
    }

    return null;
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

      setLocalSearchText(scannedBarcode);
      handleFetchAllKitRegisterDetails(
        dispatch,
        {
          currentPage: 1,
          sort,
          sortColumn,
          searchText: scannedBarcode,
          status,
          perPage,
        },
        navigate,
        location
      );
      dispatch(closeModal());
    }
  };

  const renderModalContent = () => {
    switch (modalType) {
      case "view":
        return <ViewPostOrderModal selectedData={selectedData} />;
      case "add":
        return <UploadLabReport selectedData={selectedData} />;
      case "assignKit":
        return (
          <>
            <CommonScanner onScan={handleScan} />

            <div className="d-flex justify-content-end w-100 btn_wrap mt-3">
              <Button
                className="outlined-btn"
                onClick={() => dispatch(closeModal())}
              >
                Cancel
              </Button>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const handleLabDetailsModalClose = () => {
    setSelectedKitData({
      id: null,
      lab_name: null,
      lab_address: null,
      nhi_number: null,
      type: "new",
      lab_id: 0,
    });
    setErrSelectedKitData({
      id: null,
      lab_name: null,
      lab_address: null,
      nhi_number: null,
      type: null,
    });
    setLabDetailsModalOpen(false);
  };


  const handleConfirm = () => {
    if (receivedPatientData) {
      handleDropdownStatusChange(receivedPatientData?.id, "Received");
      handleCloseConfirmationModal();
    }
  };

  const handleCloseConfirmationModal = () => {
    setReceivedConfirmationModalOpen(false);
    setReceivedPatientData(null);
    setReceivedSearchText("");
    setReceivedError(null);
    setReceivedScannerModalOpen(false);
  };



  return (
    <>
      <div className="col-lg-12">
        <div className="card shadow-sm rounded-3">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h4 className="mb-0">
              {/* <FontAwesomeIcon icon={faTasks} className="me-2" /> */}
              <ThemeImage
                imageName="postOrderListImage"
                alt="postOrderListImage"
                className={
                  currentTheme === "dark"
                    ? "dark-icon-image me-2"
                    : "light-icon-image me-2"
                }
              />
              Post Orders List
            </h4>
            {status === "Not-Received" && (
              <CommonButton
                type="button"
                className="filled-btn"
                text="Received Kits"
                onClick={() =>
                  setReceivedConfirmationModalOpen(
                    !receivedConfirmationModalOpen
                  )
                }
              />
            )}
          </div>

          <div className="table_top">
            <div>
              <div className="d-flex justify-content-center align-items-center gap-3">
                <div className="search_outer">
                  <input
                    placeholder="Search patient"
                    onChange={(e) => handleSearchInputChange(e.target.value)}
                    // style={{ width: 300 }}
                    value={localSearchText}
                  />
                  <div className="info-icon">
                    <Tooltip
                      title={`Search by QRCode/Barcode Number,Patient First Name,Patient Last Name,Patient Email, Patient Age, Created On`}
                    >
                      <FontAwesomeIcon icon={faInfoCircle} className="fa-fw" />
                    </Tooltip>
                  </div>
                </div>

                <Tooltip title={`Scan the Barcode`}>
                  <button
                    className="action_btn"
                    onClick={() =>
                      dispatch(openModal({ type: "assignKit", data: {} }))
                    }
                  >
                    <FontAwesomeIcon icon={faQrcode} />
                  </button>
                </Tooltip>
              </div>
              <p className="exact-match">
                * Search data should be the exact match
              </p>
            </div>

            <div className="d-flex gap-2 align-items-center">
              {/* <CommonDropdown
                label="Status"
                options={[
                  { label: "All", value: "all" },
                  { label: "Not Received", value: "Not-Received" },
                  { label: "Received", value: "Received" },
                  { label: "Send", value: "Send" },
                  { label: "Reject", value: "Reject" },
                ]}
                selectedValue={localStatus}
                onSelect={(value) => handleStatusFilter(value as any)}
              /> */}
              <CommonDropdown
                label="Per Page"
                options={[
                  { label: "5", value: 5 },
                  { label: "10", value: 10 },
                  { label: "15", value: 15 },
                ]}
                selectedValue={localPerPage}
                onSelect={(value) => handlePerPageFilter(Number(value))}
              />
            </div>
          </div>

          <div className="card-body">
            <CommonTable
              columns={columns}
              data={formattedRecords}
              sortColumn={sortColumn}
              sortDirection={sort}
              onSort={handleSort}
              onPageChange={handlePageChange}
              totalPages={totalPages}
              currentPage={page}
              renderActions={renderActions}
              totalRecords={totalRecords}
            />
          </div>
        </div>
      </div>
      <CommonModal
        show={isOpen}
        onHide={() => dispatch(closeModal())}
        title={
          modalType === "add"
            ? "Upload Patient Report"
            : modalType === "assignKit" || modalType === "receivedKitScan"
            ? "Scan bar code"
            : "View Patient Details"
        }
      >
        {renderModalContent()}
      </CommonModal>

      <KitStatusConfirmationModal
        show={isConfirmationModalOpen}
        onHide={handleCancelConfirmationPopup}
        onConfirm={handleConfirmConfirmationPopup}
        title="Confirm Before Reject"
        message="Are you sure you want to reject this kit?"
      />

      <LabDetailsModal
        show={labDetailsModalOpen}
        onHide={handleLabDetailsModalClose}
        selectedKitData={selectedKitData}
        setSelectedKitData={setSelectedKitData}
        errSelectedKitData={errSelectedKitData}
        setErrSelectedKitData={setErrSelectedKitData}
        handleStatusChange={handleStatusChange}
      />

      <ReceivedKitsConfirmationModalPopup
       show ={receivedConfirmationModalOpen}
       onHide ={handleCloseConfirmationModal}
       setSearchText ={setReceivedSearchText}
       setError ={setReceivedError}
       debounceTimeout  ={receivedDebounceTimeout}
       setScannerModalOpen ={setReceivedScannerModalOpen}
       searchText ={receivedSearchText}
       setPatientData ={setReceivedPatientData}
       patientData ={receivedPatientData}
       isScannerModalOpen ={isReceivedScannerModalOpen}
       error ={receivedError}
       onConfirm ={handleConfirm}

       setReceivedConfirmationModalOpen ={setReceivedConfirmationModalOpen}



      />
    </>
  );
};

export default PostOrderList;

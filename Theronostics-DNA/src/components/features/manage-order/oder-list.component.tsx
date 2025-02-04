import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";
import { Column } from "../../../types/table.type";
import {
  FetchOrderDetailsParams,
  OrderStatus,
} from "../../../types/manage-order.type";
import {
  handleFetchAllOrderDetails,
  handlePageChange,
  handlePerPageFilter,
  handleSearch,
  handleSort,
  handleStatusChange,
} from "../../../pages/manage_order/orderEvents";
import { Badge, Button } from "react-bootstrap";
import moment from "moment";
import { Tooltip } from "antd";
import { closeModal, openModal, setLoader } from "../../../redux/action";
import ThemeImage from "../../common/icons/ThemeImage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInfoCircle,
  faQrcode,
  faTruck,
} from "@fortawesome/free-solid-svg-icons";
import BarcodeAssignForm from "./BarcodeAssignForm";
import ViewOrderModal from "./ViewOrderModal";
import CommonDropdown from "../../common/dropdown/CommonDropdown";
import CommonTable from "../../common/table/CommonTable";
import CommonModal from "../../common/Modal/CommonModal";
import OrderStatusChange from "./OrderStatusChange";
import { validateForm } from "../../../utils/validation/validationUtils";
import flashMessage from "../../../utils/notifications/antdMessageUtils";
import { useLocation, useNavigate } from "react-router-dom";
import CommonScanner from "../../common/scanner/Scanner";

const OrderList: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    records,
    page,
    totalPages,
    sort,
    sortColumn,
    searchText,
    perPage,
    paymentStatus,
    orderStatus,
    totalRecords,
  } = useAppSelector((state: RootState) => state.manageOrder);

  const { isOpen, modalType, selectedData } = useAppSelector(
    (state: RootState) => state.modal
  );
  const currentTheme = useAppSelector((state: RootState) => state.theme.theme);

  const [localSearchText, setLocalSearchText] = useState(searchText);
  const [localPerPage, setLocalPerPage] = useState(perPage);
  const [searchTimeout, setSearchTimeout] = useState<any>(null);

  const searchParams = new URLSearchParams(location.search);

  useEffect(() => {
    setLocalSearchText(searchParams.get("searchText") || "");
    setLocalPerPage(Number(searchParams.get("perPage")) || 10);

    const initialParams: FetchOrderDetailsParams = {
      currentPage: Number(searchParams.get("currentPage")) || 1,
      perPage: Number(searchParams.get("perPage")) || 10,
      sort: searchParams.get("sort") || "desc",
      sortColumn: searchParams.get("sortColumn") || "created_at",
      searchText: searchParams.get("searchText") || "",
      orderStatus: searchParams.get("orderStatus") || "pending",
      paymentStatus: searchParams.get("paymentStatus") || "completed",
   
    };
   
    handleFetchAllOrderDetails(dispatch, initialParams, navigate, location);

    // eslint-disable-next-line
  }, [location.search]);

  useEffect(() => {
    if (
      searchParams.get("isAssignBarcodeModalOpen") &&
      records &&
      records.length === 1
    ) {
      const data = records[0];
      dispatch(openModal({ type: "assignKit", data }));
    }else  if (
      searchParams.get("isDispatchModalOpen") &&
      records &&
      records.length === 1
    ) {
      const data = records[0];
      dispatch(openModal({ type: "orderStatusChange", data }));
    }
     // eslint-disable-next-line
  },[location.search, records]);

  const columns: Column[] = [
    {
      key: "order_number",
      label: "Order ID",
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
    { key: "customer_first_name", label: "First Name", sortable: true },
    { key: "customer_last_name", label: "Last Name", sortable: true },
    { key: "customer_clinic_id", label: "Clinic ID", sortable: true },
    { key: "created_at", label: "Order Date", sortable: true },
    // {
    //   key: "order_status",
    //   label: "Order Status",
    //   sortable: true,
    //   className: "order_status_table_data",
    //   render: (value: string, item: OrderStatus) => {
    //     const handleDropdownChange = (newStatus: string) => {
    //       handleStatusChange(dispatch, item.id, newStatus, {
    //         page,
    //         sort,
    //         sortColumn,
    //         searchText,
    //         perPage,
    //         paymentStatus,
    //         orderStatus,
    //       });
    //     };

    //     return (
    //       <Dropdown
    //         onSelect={(eventKey: string | null) =>
    //           handleDropdownChange(eventKey || "")
    //         }
    //       >
    //         <Dropdown.Toggle variant="secondary" size="sm">
    //           {value}
    //         </Dropdown.Toggle>

    //         <Dropdown.Menu>
    //           {[
    //             "pending",
    //             "processing",
    //             "cancelled",
    //             "dispatched",
    //             "shipped",
    //             "delivered",
    //           ].map((status) => (
    //             <Dropdown.Item key={status} eventKey={status}>
    //               {status.charAt(0).toUpperCase() + status.slice(1)}
    //             </Dropdown.Item>
    //           ))}
    //         </Dropdown.Menu>
    //       </Dropdown>
    //     );
    //   },
    // },
    // {
    //   key: "order_status",
    //   label: "Order Status",
    //   sortable: true,
    //   render: (value: string) => (
    //     <Badge bg={getOrderStatusBadgeVariant(value)}>{value}</Badge>
    //   ),
    // },
    {
      key: "barcode_count_number",
      label: "Assigned Barcode",
      sortable: false,
      className: "text-center",

      headerClassName: " justify-content-center",
      render: (value: string) => (
        <Badge className="custom-badge" bg="">
          {value}
        </Badge>
      ),
    },

    // {
    //   key: "payment_status",
    //   label: "Payment Status",
    //   sortable: true,
    //   render: (value: string) => (
    //     <Badge bg={getBadgeVariant(value)}>{value}</Badge>
    //   ),
    // },
  ];

  const formattedRecords =
    records && records.length > 0
      ? records.map((order: OrderStatus) => ({
          ...order,
          customer_first_name: order.customer.first_name,
          customer_last_name: order.customer.last_name
            ? order.customer.last_name
            : "N/A",
          customer_clinic_id: order.customer.clinic_id
            ? order.customer.clinic_id
            : "N/A",
          created_at: moment(order.created_at).format("YYYY-MM-DD"),
          barcode_count_number: `${order?.barcode_count}/${order?.quantity}`,
        }))
      : [];

  const renderActions = (data: OrderStatus) => (
    <div className="actions_wrap">
      <Tooltip title="View Order Details">
        <button
          className="action_btn"
          onClick={() => dispatch(openModal({ type: "view", data }))}
        >
          <ThemeImage imageName="viewImage" />
        </button>
      </Tooltip>
      <Tooltip
        title={
          data.payment_status !== "Completed"
            ? "Customer Not completed the payment."
            : data.barcode_count === data.quantity
            ? "All barcode(s) assigned."
            : "Assign Barcode(s) to Kit(s)"
        }
      >
        <button
          className={
            data.payment_status !== "Completed" ||
            data.barcode_count === data.quantity
              ? "action-disabled-btn"
              : "action_btn"
          }
          onClick={() => dispatch(openModal({ type: "assignKit", data }))}
          disabled={
            data.payment_status !== "Completed" ||
            data.barcode_count === data.quantity
          }
        >
          <FontAwesomeIcon icon={faQrcode} />
        </button>
      </Tooltip>
      <Tooltip
        title={
          data.barcode_count !== data.quantity
            ? "Some barcodes not assigned."
            : data.order_status.toLowerCase() === "dispatched"
            ? "Order already dispatched."
            : "Click here to dispatch the order."
        }
      >
        <button
          className={
            data.payment_status !== "Completed" ||
            data.order_status.toLowerCase() === "dispatched" ||
            data.barcode_count !== data.quantity
              ? "action-disabled-btn"
              : "action_btn"
          }
          onClick={() =>
            dispatch(openModal({ type: "orderStatusChange", data }))
          }
          disabled={
            data.payment_status !== "Completed" ||
            data.order_status.toLowerCase() === "dispatched" ||
            data.barcode_count !== data.quantity
          }
        >
          <FontAwesomeIcon icon={faTruck} />
        </button>
      </Tooltip>
    </div>
  );

  const handleSearchInputChange = (value: string) => {
    setLocalSearchText(value);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const newTimeout = setTimeout(() => {
      handleSearch(
        dispatch,
        value,
        {
          sort,
          sortColumn,
          perPage,
          paymentStatus,
          orderStatus,
        },
        navigate,
        location
      );
    }, 300);

    setSearchTimeout(newTimeout);
  };
  const loading = useAppSelector((state: RootState) => state.loader.loader);

  const [formState, setFormState] = useState<Record<string, string>>({
    tracking_id: "",
  });
  const [errFormState, setErrFormState] = useState<Record<string, string>>({
    tracking_id: "",
  });
  const formFields = [
    {
      name: "tracking_id",
      label: "Tracking ID",
      type: "text",
      placeholder: "Enter tracking id",
      maxLength: 50,
      validationRules: {
        type: "textarea",
        maxLength: 50,
      },
      required: false,
    },
  ];

  const handleSubmit = async () => {
    const validationErrors = validateForm(formState, formFields);

    if (Object.keys(validationErrors).length > 0) {
      setErrFormState((prevErrors: any) => ({
        ...prevErrors,
        ...validationErrors,
      }));
      return;
    }
    try {
      await dispatch(setLoader(true));
      await handleStatusChange(
        dispatch,
        selectedData.id,
        "dispatched",
        formState.tracking_id,
        {
          page,
          sort,
          sortColumn,
          searchText,
          perPage,
          paymentStatus,
          orderStatus,
        },
        navigate,
        location
      );
      handleCloseModal();
    } catch (err) {
      console.error("Error while creating kit:", err);
    } finally {
      await dispatch(setLoader(false));
    }
  };

  const handleSubmitWithoutTrackingID = async () => {
    try {
      await dispatch(setLoader(true));
      await handleStatusChange(
        dispatch,
        selectedData.id,
        "dispatched",
        "",
        {
          page,
          sort,
          sortColumn,
          searchText,
          perPage,
          paymentStatus,
          orderStatus,
        },
        navigate,
        location
      );
      await handleCloseModal();
    } catch (err) {
      console.error("Error while creating kit:", err);
    } finally {
      await dispatch(setLoader(false));
    }
  };

  const isFormValid = () => {
    const isAnyFieldEmpty = formFields.some(
      (field) => field?.required && !formState[field.name]
    );
    const hasErrors = Object.values(errFormState).some(
      (error) => error && error.length > 0
    );
    return !isAnyFieldEmpty && !hasErrors;
  };

  const handleCloseModal = () => {
    dispatch(closeModal());
    setFormState({
      tracking_id: "",
    });
    setErrFormState({
      tracking_id: "",
    });
  };

  const renderModalContent = () => {
    switch (modalType) {
      case "assignKit":
        return <BarcodeAssignForm />;
      case "view":
        return (
          <ViewOrderModal
            selectedData={selectedData}
            onClose={() => dispatch(closeModal())}
          />
        );
      case "orderStatusChange":
        return (
          <OrderStatusChange
            selectedData={selectedData}
            formState={formState}
            setFormState={setFormState}
            errFormState={errFormState}
            setErrFormState={setErrFormState}
            formFields={formFields}
            handleSubmit={handleSubmit}
            isFormValid={isFormValid}
            handleCloseModal={handleCloseModal}
            loading={loading}
            handleSubmitWithoutTrackingID={handleSubmitWithoutTrackingID}
          />
        );
      case "viewBarcode":
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
      handleFetchAllOrderDetails(
        dispatch,
        {
          currentPage: 1,
          sort: sort,
          sortColumn: sortColumn,
          searchText: scannedBarcode,
          perPage: perPage,
          paymentStatus: paymentStatus,
          orderStatus: orderStatus,
        },
        navigate,
        location
      );
      dispatch(closeModal());
    }
  };

  return (
    <div className="col-lg-12">
      <div className="card shadow-sm rounded-3">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4 className="mb-0">
            {/* <FontAwesomeIcon icon={faCartShopping} className="me-2" /> */}
            <ThemeImage
              imageName="orderListImage"
              alt="orderListImage"
              className={
                currentTheme === "dark"
                  ? "dark-icon-image me-2"
                  : "light-icon-image me-2"
              }
            />
            Orders List
          </h4>
        </div>

        <div className="table_top">
          <div className="d-flex jsutify-content-center align-items-center gap-3">
            <div className="search_outer">
              <input
                placeholder="Search Orders"
                onChange={(e) => handleSearchInputChange(e.target.value)}
                // style={{ width: 300 }}
                value={localSearchText}
              />
              <div className="info-icon">
                <Tooltip
                  title={`Search by QRCode/Barcode Number, Order ID,Clinic ID,First Name,Last Name,Order Date,Order Status`}
                >
                  <FontAwesomeIcon icon={faInfoCircle} className="fa-fw" />
                </Tooltip>
              </div>
            </div>
            <Tooltip title={`Scan the Barcode`}>
              <button
                className="action_btn"
                onClick={() =>
                  dispatch(openModal({ type: "viewBarcode", data: {} }))
                }
              >
                <FontAwesomeIcon icon={faQrcode} />
              </button>
            </Tooltip>
          </div>
          <div className="d-flex gap-2 align-items-center">
            {/* <div className="table_filter d-flex justify-content-center align-items-center">
              <span>Order Status: </span>
              <Dropdown
                onSelect={(eventKey) => {
                  if (eventKey) {
                    handleOrderStatusFilter(dispatch, eventKey, {
                      page,
                      perPage,
                      sort,
                      sortColumn,
                      searchText,
                      paymentStatus,
                    },navigate,location);
                  }
                }}
              >
                <Dropdown.Toggle variant="secondary" size="sm">
                  {orderStatus.charAt(0).toUpperCase() + orderStatus.slice(1)}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {[
                    "all",
                    "pending",
                    "processing",
                    // "cancelled",
                    "dispatched",
                    // "shipped",
                    // "delivered",
                  ].map((status) => (
                    <Dropdown.Item key={status} eventKey={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div> */}

            <CommonDropdown
              label="Per Page"
              options={[
                { label: "5", value: 5 },
                { label: "10", value: 10 },
                { label: "15", value: 15 },
              ]}
              selectedValue={localPerPage}
              onSelect={(value) => {
                setLocalPerPage(Number(value));
                handlePerPageFilter(
                  dispatch,
                  Number(value),
                  {
                    page,
                    sort,
                    sortColumn,
                    searchText,
                    paymentStatus,
                    orderStatus,
                  },
                  navigate,
                  location
                );
              }}
            />
          </div>
        </div>

        <div className="card-body">
          <CommonTable
            columns={columns}
            data={formattedRecords}
            sortColumn={sortColumn}
            sortDirection={sort}
            onSort={(column) =>
              handleSort(
                dispatch,
                column,
                sort,
                {
                  page,
                  searchText: localSearchText,
                  perPage,
                  paymentStatus,
                  orderStatus,
                },
                navigate,
                location
              )
            }
            onPageChange={(selectedItem) =>
              handlePageChange(
                dispatch,
                selectedItem,
                {
                  sort,
                  sortColumn,
                  searchText: localSearchText,
                  perPage,
                  paymentStatus,
                  orderStatus,
                },
                navigate,
                location
              )
            }
            totalPages={totalPages}
            currentPage={page}
            renderActions={renderActions}
            totalRecords={totalRecords}
          />
        </div>
      </div>
      <CommonModal
        show={isOpen}
        onHide={() => dispatch(closeModal())}
        title={
          modalType === "assignKit"
            ? "Assign Barcode(s) to Kit(s)"
            : modalType === "view"
            ? `Order Details for ${selectedData?.order_number}`
            : modalType === "orderStatusChange"
            ? `Add Tracking ID for : ${selectedData?.order_number} (Optional)`
            : modalType === "viewBarcode"
            ? "Scan Barcode"
            : ""
        }
      >
        {renderModalContent()}
      </CommonModal>
    </div>
  );
};

export default OrderList;

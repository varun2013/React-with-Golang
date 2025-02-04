import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";
import { useEffect, useState } from "react";
import { Column } from "../../../types/table.type";
import { Badge, Button } from "react-bootstrap";
import moment from "moment";
import { Tooltip } from "antd";
import { closeModal, openModal } from "../../../redux/action";
import ThemeImage from "../../common/icons/ThemeImage";
import config from "../../../config/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faInfoCircle,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import { handleFetchAllCustomerOrderDetails } from "../../../pages/customer_details_page/customerEvents";
import { MANAGE_CUSTOMER_APP_URL } from "../../../constants/appUrl";
import CommonDropdown from "../../common/dropdown/CommonDropdown";
import CommonTable from "../../common/table/CommonTable";
import CommonModal from "../../common/Modal/CommonModal";
import { FetchCustomerOrderDetailsParams } from "../../../types/manage-customer.type";

const CustomerDetails: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    records,
    page,
    totalPages,
    sort,
    sortColumn,
    searchText,
    perPage,
    firstName,
    lastName,
    email,
    phoneNumber,
    createdAt,
    ClinicID,
    totalRecords,
    country,
    address,
    townCity,
    region,
    postcode,
    shippingCountry,
    shippingAddress,
    shippingTownCity,
    shippingRegion,
    shippingPostcode,
  } = useAppSelector((state: RootState) => state.manageCustomerOrder);
  const { isOpen, modalType, selectedData } = useAppSelector(
    (state: RootState) => state.modal
  );
  const { customerID } = useParams() as { customerID: string };
  const [localSearchText, setLocalSearchText] = useState(searchText);
  const [localPerPage, setLocalPerPage] = useState(perPage);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);

    setLocalSearchText(searchParams.get("searchText") || "");
    setLocalPerPage(Number(searchParams.get("perPage")) || 10);

    const initialParams: FetchCustomerOrderDetailsParams = {
      currentPage: Number(searchParams.get("currentPage")) || 1,
      perPage: Number(searchParams.get("perPage")) || 10,
      sort: searchParams.get("sort") || "desc",
      sortColumn: searchParams.get("sortColumn") || "created_at",
      searchText: searchParams.get("searchText") || "",
    };

    handleFetchAllCustomerOrderDetails(
      dispatch,
      initialParams,
      customerID,
      navigate,
      location
    );

    // eslint-disable-next-line
  }, [location.search]);

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
    { key: "product_name", label: "Product Name", sortable: true },
    { key: "quantity", label: "Quantity", sortable: true },
    { key: "total_price", label: "Total Price", sortable: true },

    {
      key: "payment_status",
      label: "Payment Status",
      sortable: true,
      render: (value: string) => {
        return <Badge bg={getBadgeVariant(value)}>{value}</Badge>;
      },
    },
    { key: "created_at", label: "Order Date", sortable: true },
  ];
  const formattedRecords =
    records && records.length > 0
      ? records.map((order: any) => ({
          ...order,
          created_at: moment(order.created_at).format("YYYY-MM-DD"),
          total_price: order.total_price > 0 ? "$" + order.total_price : 0,
        }))
      : [];

  const renderActions = (data: any) => (
    <div className="actions_wrap">
      <Tooltip title={`View Order Details`}>
        <button
          className="action_btn"
          onClick={() => dispatch(openModal({ type: "view", data }))}
        >
          <ThemeImage imageName="viewImage" />
        </button>
      </Tooltip>
    </div>
  );
  // Function to get badge variant based on payment status
  const getBadgeVariant = (status: string) => {
    if (status) {
      switch (status.toLowerCase()) {
        case "completed":
          return "success";
        case "pending":
          return "warning";
        case "failed":
          return "danger";
        case "processing":
          return "info"; // Blue for processing
        case "cancelled":
          return "danger"; // Red for cancelled
        case "dispatched":
          return "primary"; // Dark Blue for dispatched
        case "shipped":
          return "success"; // Green for shipped
        case "delivered":
          return "success";
        default:
          return "secondary";
      }
    }

    return "";
  };

  const renderModalContent = () => {
    return (
      <div>
        <div className="px-0 report_detail container">
          <div className="row  row-gap-3">
            {/* Order Details Section */}

            <div className="col-md-6">
              <div className="report_inn">
                <p className="mb-1">
                  <b>Order ID</b>
                </p>
                <p className="txt">{selectedData?.order_number}</p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="report_inn">
                <p className="mb-1">
                  <b>Order Status</b>
                </p>
                <p className="txt">
                  <Badge bg={getBadgeVariant(selectedData?.order_status)}>
                    {selectedData?.order_status}
                  </Badge>
                </p>
              </div>
            </div>

            {/* Created Date */}
            <div className="col-md-6">
              <div className="report_inn">
                <p className="mb-1">
                  <b>Order Date</b>
                </p>
                <p className="txt">
                  {moment(selectedData?.created_at).format("YYYY-MM-DD")}
                </p>
              </div>
            </div>

            <div className="col-md-6">
              <div className="report_inn">
                <p className="mb-1">
                  <b>Transaction ID</b>
                </p>
                <p className="txt">
                  {selectedData?.payments[0]?.transaction_id}
                </p>
              </div>
            </div>

            <div className="col-md-6">
              <div className="report_inn">
                <p className="mb-1">
                  <b>Quantity</b>
                </p>
                <p className="txt">{selectedData?.quantity}</p>
              </div>
            </div>

            {/* Payment Details */}
            <div className="col-md-6">
              <div className="report_inn">
                <p className="mb-1">
                  <b>Payment Status</b>
                </p>
                <p className="txt">
                  {selectedData?.payment_status && (
                    <Badge bg={getBadgeVariant(selectedData.payment_status)}>
                      {selectedData.payment_status}
                    </Badge>
                  )}
                </p>
              </div>
            </div>

            {/* Invoice Section */}
            <div className="col-md-6">
              <div className="report_inn">
                {selectedData?.payment_status === "Completed" && (
                  <div>
                    <p className="mb-1">
                      <b>Invoice</b>
                    </p>
                    <Link
                      target="_blank"
                      className="txt"
                      to={`${config.apiUrl}/${selectedData?.payments[0]?.invoices[0]?.invoice_link}`}
                    >
                      Download Invoice (
                      {selectedData?.payments[0]?.invoices[0]?.invoice_id})
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {selectedData?.tracking_id && (
              <div className="col-md-6">
                <div className="report_inn">
                  <p className="mb-1 form-label">Tracking ID</p>
                  <p className="txt">{selectedData?.tracking_id || "N/A"}</p>
                </div>
              </div>
            )}
          </div>

          {selectedData?.barcodes && selectedData?.barcodes.length > 0 && (
            <div className="row row-gap-3 mt-2">
              <div className="col-md-6">
                <div className="report_inn">
                  <p className="mb-1 form-label">
                    Barcode(s) Assigned To Kit(s)
                  </p>

                  <div
                    className="txt"
                    style={{
                      maxHeight: "100px",
                      overflow: "auto",
                      lineHeight: "1.8",
                    }}
                  >
                    {selectedData?.barcodes.map((b: any, index: number) => (
                      <div key={index} style={{ marginBottom: "8px" }}>
                        <span>{index + 1}. </span>
                        <span>{b?.barcode_number}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="row row-gap-3 mt-3">
            {/* Product Details Section */}
            <div className="col-md-6">
              <div className="report_inn">
                <p className="mb-1">
                  <b>Product Name</b>
                </p>
                <p className="txt">{selectedData?.product_name}</p>
              </div>
            </div>

            <div className="col-md-6">
              <div className="report_inn">
                <p className="mb-1">
                  <b>Product Description</b>
                </p>
                <div className="prod-description">
                  <p
                    className="txt"
                    style={{ maxHeight: "100px", overflow: "auto" }}
                  >
                    {selectedData?.product_description}
                  </p>
                </div>
              </div>
            </div>

            {/* Pricing Section */}

            {/* Pricing Details */}
            <div className="col-md-6">
              <div className="report_inn">
                <p className="mb-1 form-label">Product Price($)</p>
                <p className="txt">
                  {selectedData?.product_price > 0
                    ? `$${selectedData?.product_price.toFixed(2)}`
                    : "0.00"}
                </p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="report_inn">
                <p className="mb-1 form-label">GST Price($)</p>
                <p className="txt">
                  {selectedData?.product_gst_price > 0
                    ? `$${selectedData?.product_gst_price.toFixed(2)}`
                    : "0.00"}
                </p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="report_inn">
                <p className="mb-1 form-label">Product Discount(%)</p>
                <p className="txt">
                  {selectedData?.product_discount === 0
                    ? 0
                    : selectedData?.product_discount + "%"}
                </p>
              </div>
            </div>
            {/* Order Quantity and Total */}

            <div className="col-md-6">
              <div className="report_inn">
                <p className="mb-1">
                  <b>Total Price</b>
                </p>
                <p className="txt">{`${selectedData?.total_price}`}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-end w-100 btn_wrap mt-3">
          <Button
            className="outlined-btn"
            onClick={() => dispatch(closeModal())}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  };

  const handleSearchInputChange = (value: string) => {
    setLocalSearchText(value);

    // Clear the previous timeout if it exists
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set a new timeout
    const newTimeout = setTimeout(() => {
      handleSearch(value);
    }, 300);

    setSearchTimeout(newTimeout);
  };

  const handleSearch = (value: string) => {
    handleFetchAllCustomerOrderDetails(
      dispatch,
      {
        currentPage: 1,
        sort,
        sortColumn,
        searchText: value,
        perPage,
      },
      customerID,
      navigate,
      location
    );
  };

  const handlePerPageFilter = (value: number) => {
    setLocalPerPage(Number(value));
    handleFetchAllCustomerOrderDetails(
      dispatch,
      {
        currentPage: page,
        sort,
        sortColumn,
        searchText: localSearchText,
        perPage: Number(value),
      },
      customerID,
      navigate,
      location
    );
  };
  const handleSort = (column: string) => {
    const newDirection = sort === "asc" ? "desc" : "asc";
    handleFetchAllCustomerOrderDetails(
      dispatch,
      {
        currentPage: page,
        sort: newDirection,
        sortColumn: column,
        searchText: localSearchText,
        perPage,
      },
      customerID,
      navigate,
      location
    );
  };

  const handlePageChange = (selectedItem: { selected: number }) => {
    handleFetchAllCustomerOrderDetails(
      dispatch,
      {
        currentPage: selectedItem.selected + 1,
        sort,
        sortColumn,
        searchText: localSearchText,
        perPage,
      },
      customerID,
      navigate,
      location
    );
  };

  const handleBackClick = () => {
    navigate(
      {
        pathname: MANAGE_CUSTOMER_APP_URL,
        search: `?currentPage=${String(
          1
        )}&sort=${"desc"}&sortColumn=${"created_at"}&searchText=${""}&perPage=${String(
          10
        )}`,
      },
      { replace: false }
    );
  };
  return (
    <div className="col-lg-12">
      <div className="user-details-container card">
        <div className="card-body">
          <div className="d-flex justify-content-start align-items-center mb-3 gap-3 main-head card-header p-0 pb-2">
            <Button onClick={handleBackClick} className="filled-btn px-2">
              <FontAwesomeIcon icon={faArrowLeft} />
            </Button>

            <h4 className="m-0">Customer Details</h4>
          </div>
          <div className="report-detail container-fluid">
            <div className="row row-gap-3">
              <div className="col">
                <div className="report-item">
                  <p className="form-label">First Name</p>
                  <p className="value mb-0">{firstName}</p>
                </div>
              </div>
              <div className="col">
                <div className="report-item">
                  <p className="form-label">Last Name</p>
                  <p
                    className="value mb-0"
                    style={!lastName ? { marginBottom: "32px" } : undefined}
                  >
                    {lastName ? lastName : "N/A"}
                  </p>
                </div>
              </div>
              <div className="col">
                <div className="report-item">
                  <p className="form-label">Email</p>
                  <p className="value mb-0">{email}</p>
                </div>
              </div>
              <div className="col">
                <div className="report-item">
                  <p className="form-label">Phone Number</p>
                  <p className="value mb-0">{phoneNumber}</p>
                </div>
              </div>
              <div className="col">
                <div className="report-item">
                  <p className="form-label">Current Address</p>
                  <p className="value mb-0">
                    {address},{townCity},{region},{country},{postcode}
                  </p>
                </div>
              </div>
              <div className="col">
                <div className="report-item">
                  <p className="form-label">Shipping Address</p>
                  <p className="value mb-0">
                    {shippingAddress},{shippingTownCity},{shippingRegion},
                    {shippingCountry},{shippingPostcode}
                  </p>
                </div>
              </div>
              {ClinicID && (
                <div className="col">
                  <div className="report-item">
                    <p className="form-label">Clinic ID</p>
                    <p className="value mb-0">{ClinicID}</p>
                  </div>
                </div>
              )}
              <div className="col">
                <div className="report-item">
                  <p className="form-label">Created On</p>
                  <p className="value mb-0">
                    {moment(createdAt).format("YYYY-MM-DD")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card shadow-sm rounded-3 mt-3">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4 className="mb-0">
                <FontAwesomeIcon icon={faList} className="me-2" />
                Orders List
              </h4>
            </div>

            <div className="table_top">
              <div className="search_outer">
                <input
                  placeholder="Search orders"
                  onChange={(e) => handleSearchInputChange(e.target.value)}
                  // style={{ width: 300 }}
                  value={localSearchText}
                />
                <div className="info-icon">
                  <Tooltip
                    title={`Search by Order ID,Product Name,Quantity,Total Price,Payment Status`}
                  >
                    <FontAwesomeIcon icon={faInfoCircle} className="fa-fw" />
                  </Tooltip>
                </div>
              </div>
              <div className="d-flex">
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
      </div>

      <CommonModal
        show={isOpen}
        onHide={() => dispatch(closeModal())}
        title={
          modalType === "view"
            ? `Order Details for ${selectedData?.order_number}`
            : " "
        }
      >
        {renderModalContent()}
      </CommonModal>
    </div>
  );
};

export default CustomerDetails;

import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Column } from "../../../types/table.type";
import moment from "moment";
import {
  Customer,
  FetchCustomerDetailsParams,
} from "../../../types/manage-customer.type";
import { Tooltip } from "antd";
import { CUSTOMER_DETAILS_APP_URL } from "../../../constants/appUrl";
import ThemeImage from "../../common/icons/ThemeImage";
import {
  handleFetchAllCustomeretails,
} from "../../../pages/manage_customer/customerEvents";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import CommonDropdown from "../../common/dropdown/CommonDropdown";
import CommonTable from "../../common/table/CommonTable";

const CustomerList: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const {
    records,
    page,
    totalPages,
    sort,
    sortColumn,
    searchText,
    perPage,
    totalRecords,
  } = useAppSelector((state: RootState) => state.manageCustomer);
  const currentTheme = useAppSelector((state: RootState) => state.theme.theme);

  const [localSearchText, setLocalSearchText] = useState(searchText);
  const [localPerPage, setLocalPerPage] = useState(perPage);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);

    setLocalSearchText(searchParams.get("searchText") || "");

    setLocalPerPage(Number(searchParams.get("perPage")) || 10);

    const initialParams: FetchCustomerDetailsParams = {
      currentPage: Number(searchParams.get("currentPage")) || 1,
      perPage: Number(searchParams.get("perPage")) || 10,
      sort: searchParams.get("sort") || "desc",
      sortColumn: searchParams.get("sortColumn") || "created_at",
      searchText: searchParams.get("searchText") || "",
    };

    handleFetchAllCustomeretails(dispatch, initialParams, navigate, location);

    // eslint-disable-next-line
  }, [location.search]);

  const columns: Column[] = [
    {
      key: "first_name",
      label: "First Name",
      sortable: true,
      render: (value: any, item: any) => (
        <span
          className="view-modal-open"
          onClick={() => {
            const url = CUSTOMER_DETAILS_APP_URL.replace(":customerID", item.id);
            navigate(url, {
              state: { data: item.id },
            });
          }}
        >
          {value}
        </span>
      ),
    },
    { key: "last_name", label: "Last Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "phone_number", label: "Phone Number", sortable: true },
    { key: "country", label: "Country", sortable: true },
    { key: "clinic_id", label: "Clinic Id", sortable: true },
    { key: "created_at", label: "Created On", sortable: true },
  ];
  const formattedRecords =
    records && records.length > 0
      ? records.map((customer: any) => ({
          ...customer,
          created_at: moment(customer.created_at).format("YYYY-MM-DD"),
          last_name: customer.last_name ? customer.last_name : "N/A",
          clinic_id: customer.clinic_id !== "" ? customer.clinic_id : "N/A",
        }))
      : [];

  const renderActions = (user: Customer) => (
    <div className="actions_wrap">
      <Tooltip title={`View Customer Details`}>
        <button
          className="action_btn"
          onClick={() => {
            const url = CUSTOMER_DETAILS_APP_URL.replace(":customerID", user.id);
            navigate(url, {
              state: { data: user.id },
            });
          }}
        >
          <ThemeImage imageName="viewImage" />
        </button>
      </Tooltip>
    </div>
  );

  const handleSort = (column: string) => {
    const newDirection = sort === "asc" ? "desc" : "asc";
    handleFetchAllCustomeretails(
      dispatch,
      {
        currentPage: page,
        sort: newDirection,
        sortColumn: column,
        searchText: localSearchText,
        perPage,
      },
      navigate,
      location
    );
  };

  const handlePageChange = (selectedItem: { selected: number }) => {
    handleFetchAllCustomeretails(
      dispatch,
      {
        currentPage: selectedItem.selected + 1,
        sort,
        sortColumn,
        searchText: localSearchText,
        perPage,
      },
      navigate,
      location
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
    }, 300); // Adjust the delay as needed (300 ms in this case)

    setSearchTimeout(newTimeout);
  };

  const handleSearch = (value: string) => {
    handleFetchAllCustomeretails(
      dispatch,
      {
        currentPage: 1,
        sort,
        sortColumn,
        searchText: value,
        perPage,
      },
      navigate,
      location
    );
  };

  const handlePerPageFilter = (value: number) => {
    setLocalPerPage(Number(value));
    handleFetchAllCustomeretails(
      dispatch,
      {
        currentPage: page,
        sort,
        sortColumn,
        searchText: localSearchText,
        perPage: Number(value),
      },
      navigate,
      location
    );
  };

  return (
    <div className="col-lg-12">
      <div className="card shadow-sm rounded-3">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4 className="mb-0">
            {/* <FontAwesomeIcon icon={faFileMedical} className="me-2" /> */}
            <ThemeImage
              imageName="customerListImage"
              alt="customerListImage"
              className={
                currentTheme === "dark"
                  ? "dark-icon-image me-2"
                  : "light-icon-image me-2"
              }
            />
            Customers List
          </h4>
        </div>

        <div className="table_top">
          <div className="search_outer">
            <input
              placeholder="Search Customers"
              onChange={(e) => handleSearchInputChange(e.target.value)}
              // style={{ width: 300 }}
              value={localSearchText}
            />
            <div className="info-icon">
              <Tooltip
                title={`Search by Clinic ID,First Name,Last Name,Email,Phone Number,Country`}
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
  );
};

export default CustomerList;

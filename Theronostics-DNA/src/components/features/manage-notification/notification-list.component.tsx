import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";
import moment from "moment";
import { DatePicker, Switch, Tooltip } from "antd";
import {
  LoadNotificationParams,
  Notification,
} from "../../../types/notification.type";
import {
  handleFetchAllNotificationDetails,
} from "../../../pages/manage-notification/notificationEvent";
import {
  closeModal,
  deleteNotification,
  deleteSpecificNotification,
  fetchLatestNotificationList,
  markAllNotificationAsread,
  markNotificationAsread,
  openModal,
  setLoader,
} from "../../../redux/action";
import ThemeImage from "../../common/icons/ThemeImage";
import { Button, Dropdown } from "react-bootstrap";
import {
  faClipboardList,
  faInfoCircle,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs, { Dayjs } from "dayjs";
import CommonDropdown from "../../common/dropdown/CommonDropdown";
import CommonTable from "../../common/table/CommonTable";
import CommonModal from "../../common/Modal/CommonModal";
import ConfirmationModal from "../../common/Modal/ConfirmationModal";
import { useLocation, useNavigate } from "react-router-dom";

const NotificationList: React.FC = () => {
  // Redux state
  const {
    itemsPerPage,
    notificationRecords,
    currentPage,
    sortDirection,
    sortField,
    searchQuery,
    readStatus,
    totalPageCount,
    notificationType,
    startDate,
    endDate,
    totalRecordCount,
  } = useAppSelector((state: RootState) => state.notification);

  const { isOpen, selectedData } = useAppSelector(
    (state: RootState) => state.modal
  );

  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  // Local state
  const [localSearchText, setLocalSearchText] = useState(searchQuery);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [localPerPage, setLocalPerPage] = useState(itemsPerPage);
  const [localStatus, setLocalStatus] = useState(readStatus);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedNotificationId, setSelectedNotificationId] = useState<
    number | null
  >(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);

    setLocalSearchText(searchParams.get("searchText") || "");
    setLocalPerPage(Number(searchParams.get("perPage")) || itemsPerPage);

    const initialParams: LoadNotificationParams = {
      currentPage: Number(searchParams.get("currentPage")) || 1,
      perPage: Number(searchParams.get("perPage")) || 10,
      sort: searchParams.get("sort") || "desc",
      sortColumn: searchParams.get("sortColumn") || "created_at",
      searchText: searchParams.get("searchText") || "",
      type: searchParams.get("type") || "",
      isRead:
        searchParams.get("isRead") === "true"
          ? true
          : searchParams.get("isRead") === "false"
          ? false
          : null,
      startDate: searchParams.get("startDate") || "",
      endDate: searchParams.get("endDate") || "",
    };

    handleFetchAllNotificationDetails(
      dispatch,
      initialParams,
      navigate,
      location
    );

    // eslint-disable-next-line
  }, [location.search]);

  // Table columns definition
  const columns = [
    {
      key: "created_at",
      label: "Created On",
      sortable: true,
      render: (value: any, item: any) => (
        <span
          className="view-modal-open"
          onClick={() => dispatch(openModal({ type: "view", data: item }))}
        >
          {moment(value).format("YYYY-MM-DD")}
        </span>
      ),
    },
    {
      key: "title",
      label: "Title",
      sortable: true,
    },
    {
      key: "type",
      label: "Type",
      sortable: true,
    },
    {
      key: "message",
      label: "Message",
      sortable: false,
    },
    {
      key: "is_read",
      label: "Status",
      sortable: true,
      render: (value: boolean, item: Notification) => (
        <Switch
          checked={value}
          onChange={() => handleStatusChange(item.id, !value)}
        />
      ),
    },
  ];

  // Pagination and filtering handlers
  const handleSort = (column: string) => {
    const newDirection = sortDirection === "asc" ? "desc" : "asc";
    handleFetchAllNotificationDetails(
      dispatch,
      {
        currentPage,
        sort: newDirection,
        sortColumn: column,
        searchText: searchQuery,
        isRead: readStatus,
        perPage: itemsPerPage,
        type: notificationType,
        startDate,
        endDate,
      },
      navigate,
      location
    );
  };

  const handlePageChange = (selectedItem: { selected: number }) => {
    handleFetchAllNotificationDetails(
      dispatch,
      {
        currentPage: selectedItem.selected + 1,
        sort: sortDirection,
        sortColumn: sortField,
        searchText: searchQuery,
        isRead: readStatus,
        perPage: itemsPerPage,
        type: notificationType,
        startDate,
        endDate,
      },
      navigate,
      location
    );
  };

  // Search input handling with debounce
  const handleSearchInputChange = (value: string) => {
    setLocalSearchText(value);
    if (searchTimeout) clearTimeout(searchTimeout);

    const newTimeout = setTimeout(() => {
      handleFetchAllNotificationDetails(
        dispatch,
        {
          currentPage: 1,
          sort: sortDirection,
          sortColumn: sortField,
          searchText: value,
          isRead: readStatus,
          perPage: itemsPerPage,
          type: notificationType,
          startDate,
          endDate,
        },
        navigate,
        location
      );
    }, 300);

    setSearchTimeout(newTimeout);
  };

  // Status and per page filtering
  const handleStatusFilter = (value: string) => {
    const statusValue =
      value === "read" ? true : value === "unread" ? false : null;

    setLocalStatus(statusValue);
    handleFetchAllNotificationDetails(
      dispatch,
      {
        currentPage: 1,
        sort: sortDirection,
        sortColumn: sortField,
        searchText: searchQuery,
        isRead: statusValue,
        perPage: itemsPerPage,
        type: notificationType,
        startDate,
        endDate,
      },
      navigate,
      location
    );
  };

  const handlePerPageFilter = (value: number) => {
    setLocalPerPage(Number(value));
    handleFetchAllNotificationDetails(
      dispatch,
      {
        currentPage: 1,
        sort: sortDirection,
        sortColumn: sortField,
        searchText: searchQuery,
        isRead: localStatus,
        perPage: Number(value),
        type: notificationType,
        startDate,
        endDate,
      },
      navigate,
      location
    );
  };

  // Helper functions for dropdown selections
  const showSelectedStatus = () => {
    if (localStatus === true) return "Read";
    if (localStatus === false) return "Un-Read";
    return "All";
  };

  // Handlers for marking notifications
  const handleAllNotificationMarkAsRead = async () => {
    try {
      dispatch(setLoader(true));
      await dispatch(
        markAllNotificationAsread({}, async (response) => {
          if (response.success) {
            handleFetchAllNotificationDetails(
              dispatch,
              {
                currentPage: 1,
                sort: sortDirection,
                sortColumn: sortField,
                searchText: searchQuery,
                isRead: readStatus,
                perPage: itemsPerPage,
                type: notificationType,
                startDate,
                endDate,
              },
              navigate,
              location
            );
            await fetchLatestNotificationList({});
          }
        })
      );
    } catch (err) {
      console.error("Error marking notifications as read:", err);
    } finally {
      dispatch(setLoader(false));
    }
  };

  const handleStatusChange = async (
    notificationId: number,
    newStatus: boolean
  ) => {
    try {
      dispatch(setLoader(true));
      await dispatch(
        markNotificationAsread(
          { is_read: newStatus },
          notificationId.toString(),
          async (response) => {
            if (response.success) {
              await handleFetchAllNotificationDetails(
                dispatch,
                {
                  currentPage: currentPage,
                  sort: sortDirection,
                  sortColumn: sortField,
                  searchText: searchQuery,
                  isRead: readStatus,
                  perPage: itemsPerPage,
                  type: notificationType,
                  startDate,
                  endDate,
                },
                navigate,
                location
              );
              await fetchLatestNotificationList({});
            }
          }
        )
      );
    } catch (err) {
      console.error("Error updating notification status:", err);
    } finally {
      dispatch(setLoader(false));
    }
  };

  // Render methods
  const renderActions = (data: any) => (
    <div className="actions_wrap">
      <Tooltip title="View Notification Details">
        <button
          className="action_btn"
          onClick={() => dispatch(openModal({ type: "view", data }))}
        >
          <ThemeImage imageName="viewImage" />
        </button>
      </Tooltip>
      <Tooltip title={`Delete Notification`}>
        <button
          className="action_btn"
          onClick={() => handleSpeificDeleteNotification(data.id)}
        >
          <ThemeImage imageName="deleteImage" />
        </button>
      </Tooltip>
    </div>
  );

  const handleSpeificDeleteNotification = (id: number) => {
    setSelectedNotificationId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedNotificationId) {
      try {
        dispatch(setLoader(true));
        await dispatch(
          deleteSpecificNotification(
            {},
            selectedNotificationId.toString(),
            async (response) => {
              if (response.success) {
                await handleFetchAllNotificationDetails(
                  dispatch,
                  {
                    currentPage: currentPage,
                    sort: sortDirection,
                    sortColumn: sortField,
                    searchText: searchQuery,
                    isRead: readStatus,
                    perPage: itemsPerPage,
                    type: notificationType,
                    startDate,
                    endDate,
                  },
                  navigate,
                  location
                );
                setSelectedNotificationId(null);
                setShowDeleteModal(false);
                await fetchLatestNotificationList({});
              }
            }
          )
        );
      } catch (err) {
        console.error("Error updating notification status:", err);
      } finally {
        dispatch(setLoader(false));
      }
    }
  };

  const renderModalContent = () => {
    return (
      <div>
        <div className="px-0 report_detail container">
          <div className="row row-gap-3">
            <div className="col-md-6">
              <div className="report_inn">
                <p className="mb-1">
                  <b>Title</b>
                </p>
                <p className="txt">{selectedData?.title}</p>
              </div>
            </div>

            <div className="col-md-6">
              <div className="report_inn">
                <p className="mb-1">
                  <b>Type</b>
                </p>
                <p className="txt">{selectedData?.type}</p>
              </div>
            </div>

            <div className="col-md-6">
              <div className="report_inn">
                <p className="mb-1">
                  <b>Status</b>
                </p>
                <p className="txt">
                  <span
                    className={`status ${
                      selectedData?.is_read ? "complete" : "inprogress"
                    }`}
                  >
                    {selectedData?.is_read ? "Read" : "Un-Read"}
                  </span>
                </p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="report_inn">
                <p className="mb-1">
                  <b>Created On</b>
                </p>
                <p className="txt">
                  {moment(selectedData?.created_at).format("YYYY-MM-DD")}
                </p>
              </div>
            </div>
          </div>
          <div className="row row-gap-3 mt-3">
            <div className="col-md-12">
              <div className="report_inn">
                <p className="mb-1">
                  <b>Message</b>
                </p>
                <p
                  className="txt"
                  style={{ maxHeight: "100px", overflow: "auto" }}
                >
                  {selectedData?.message}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-between w-100 btn_wrap mt-3">
          <div className="btn_grp">
            <Button
              className="outlined-btn"
              onClick={() => dispatch(closeModal())}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // Helper function to format date to YYYY-MM-DD
  const formatDateToYYYYMMDD = (date: Dayjs | null): string => {
    return date ? date.format("YYYY-MM-DD") : "";
  };

  // Disabled date function for DatePicker
  const disabledDate = (current: Dayjs): boolean => {
    // Cannot select days after today
    return current && current.isAfter(dayjs().endOf("day"));
  };

  // Handle date range change
  const handleDateRangeChange = (
    dates: [Dayjs | null, Dayjs | null] | null
  ) => {
    if (dates && dates[0] && dates[1]) {
      const [start, end] = dates;
      const formattedStartDate = formatDateToYYYYMMDD(start);
      const formattedEndDate = formatDateToYYYYMMDD(end);

      handleFetchAllNotificationDetails(
        dispatch,
        {
          currentPage: 1,
          sort: sortDirection,
          sortColumn: sortField,
          searchText: searchQuery,
          isRead: readStatus,
          perPage: itemsPerPage,
          type: notificationType,
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        },
        navigate,
        location
      );
    } else {
      // Reset dates if cleared
      handleFetchAllNotificationDetails(
        dispatch,
        {
          currentPage: 1,
          sort: sortDirection,
          sortColumn: sortField,
          searchText: searchQuery,
          isRead: readStatus,
          perPage: itemsPerPage,
          type: notificationType,
          startDate: null,
          endDate: null,
        },
        navigate,
        location
      );
    }
  };

  // Prevent manual keyboard input in date fields
  const handleDateKeyDown = (e: React.KeyboardEvent) => {
    e.preventDefault();
  };

  const handleDeleteNotification = async () => {
    try {
      dispatch(setLoader(true));
      await dispatch(
        deleteNotification(
          {
            start_date: startDate,
            end_date: endDate,
          },
          async (response) => {
            if (response.success) {
              await handleFetchAllNotificationDetails(
                dispatch,
                {
                  currentPage: 1,
                  sort: sortDirection,
                  sortColumn: sortField,
                  searchText: searchQuery,
                  isRead: readStatus,
                  perPage: itemsPerPage,
                  type: notificationType,
                  startDate,
                  endDate,
                },
                navigate,
                location
              );
              setShowDeleteModal(false);
              await fetchLatestNotificationList({});
            }
          }
        )
      );
    } catch (err) {
      console.error("Error delete notifications:", err);
    } finally {
      dispatch(setLoader(false));
    }
  };

  return (
    <div className="col-lg-12">
      <div className="card shadow-sm rounded-3">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4 className="mb-0">
            <FontAwesomeIcon icon={faClipboardList} className="me-2" />
            Notification List
          </h4>
        </div>

        <div className="table_top">
          <div className="search_outer">
            <input
              placeholder="Search Notifications"
              onChange={(e) => handleSearchInputChange(e.target.value)}
              // style={{ width: 300 }}
              value={localSearchText}
            />
            <div className="info-icon">
              <Tooltip title="Search by Created On,Title, Type,Message">
                <FontAwesomeIcon icon={faInfoCircle} className="fa-fw" />
              </Tooltip>
            </div>
          </div>

          <div className="d-flex gap-2 flex-wrap align-items-center filter-parent">
            <div className="table_filter d-flex justify-content-center align-items-center">
              <button
                className="filled-btn"
                onClick={handleAllNotificationMarkAsRead}
              >
                Mark All Read
              </button>
            </div>

            <div className="table_filter d-flex justify-content-center align-items-center">
              <DatePicker.RangePicker
                format="YYYY-MM-DD"
                disabledDate={disabledDate}
                onChange={handleDateRangeChange}
                onKeyDown={handleDateKeyDown}
                value={
                  startDate && endDate
                    ? [dayjs(startDate), dayjs(endDate)]
                    : null
                }
                className="date-range-picker"
                placeholder={["Start Date", "End Date"]}
                allowClear={true}
              />
            </div>

            <div className="table_filter d-flex justify-content-center align-items-center">
              <Tooltip
                title={
                  !startDate || !endDate
                    ? "Please select date range first"
                    : "Delete notifications in selected date range"
                }
              >
                <button
                  className={
                    !startDate || !endDate
                      ? "disabled-btn"
                      : "btn btn-danger btn-delete"
                  }
                  onClick={() => setShowDeleteModal(true)}
                  disabled={!startDate || !endDate}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </Tooltip>
            </div>

            <div className="table_filter d-flex justify-content-center align-items-center">
              <span>Status: </span>
              <Dropdown onSelect={(key) => handleStatusFilter(key as string)}>
                <Dropdown.Toggle variant="success" id="status-filter">
                  {showSelectedStatus()}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item eventKey="">All</Dropdown.Item>
                  <Dropdown.Item eventKey="read">Read</Dropdown.Item>
                  <Dropdown.Item eventKey="unread">Unread</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>

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
            data={notificationRecords || []}
            sortColumn={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            onPageChange={handlePageChange}
            totalPages={totalPageCount}
            currentPage={currentPage}
            renderActions={renderActions}
            totalRecords={totalRecordCount}
          />
        </div>
      </div>
      <CommonModal
        show={isOpen}
        onHide={() => dispatch(closeModal())}
        title="View Notification"
      >
        {renderModalContent()}
      </CommonModal>
      <ConfirmationModal
        show={showDeleteModal}
        onHide={() => {
          setShowDeleteModal(false);
          setSelectedNotificationId(null);
        }}
        onConfirm={() =>
          selectedNotificationId
            ? handleConfirmDelete()
            : handleDeleteNotification()
        }
        title="Confirm Delete"
        message={
          selectedNotificationId
            ? "Are you sure you want to delete notification?"
            : "Are you sure you want to delete notification as per selected date range?"
        }
      />
    </div>
  );
};

export default NotificationList;

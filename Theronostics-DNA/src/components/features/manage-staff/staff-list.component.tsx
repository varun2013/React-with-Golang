import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faInfoCircle, faUser } from "@fortawesome/free-solid-svg-icons";
import CommonButton from "../../common/button/CommonButton";
import { closeModal, openModal } from "../../../redux/action";
import { Switch, Tooltip } from "antd";
import CommonTable from "../../common/table/CommonTable";
import { Column } from "../../../types/table.type";
import moment from "moment";
import ThemeImage from "../../common/icons/ThemeImage";
import {
  handleFetchAllStaffDetails,
  handleStaffCreation,
  handleStaffDeletion,
  handleStaffPasswordChange,
  handleStaffStatusChange,
  handleStaffUpdate,
} from "../../../pages/manage_staff/manage-staff.event";
import CommonDropdown from "../../common/dropdown/CommonDropdown";
import ConfirmationModal from "../../common/Modal/ConfirmationModal";
import CommonModal from "../../common/Modal/CommonModal";
import StaffForm from "./StaffForm";
import emailImage from "../../../assets/images/email.svg";
import passwordLockImage from "../../../assets/images/passwordLock.svg";
import {
  IFetchStaffDetailsParams,
  IStaffFormField,
  IStaffRecord,
} from "../../../types/manage-staff.types";
import StaffView from "./staff-view-modal.component";
import { useLocation, useNavigate } from "react-router-dom";

const StaffList: React.FC = () => {
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
    status,
    perPage,
    totalRecords,
  } = useAppSelector((state: RootState) => state.manageStaff);
  const { isOpen, modalType, selectedData } = useAppSelector(
    (state: RootState) => state.modal
  );

  const [localSearchText, setLocalSearchText] = useState(searchText);
  const [localStatus, setLocalStatus] = useState(status);
  const [localPerPage, setLocalPerPage] = useState(perPage);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);

    setLocalSearchText(searchParams.get("searchText") || "");
    const statusParam = searchParams.get("status");
    if (
      statusParam === "all" ||
      statusParam === "active" ||
      statusParam === "inactive"
    ) {
      setLocalStatus(statusParam);
    } else {
      setLocalStatus("all");
    }
    setLocalPerPage(Number(searchParams.get("perPage")) || 10);

    const initialParams: IFetchStaffDetailsParams = {
      currentPage: Number(searchParams.get("currentPage")) || 1,
      perPage: Number(searchParams.get("perPage")) || 10,
      sort: searchParams.get("sort") || "desc",
      sortColumn: searchParams.get("sortColumn") || "created_at",
      searchText: searchParams.get("searchText") || "",
      status: searchParams.get("status") || "all",
    };

    handleFetchAllStaffDetails(dispatch, initialParams, navigate, location);

    // eslint-disable-next-line
  }, [location.search]);

  const [formState, setFormState] = useState<Record<string, string>>({
    email: "",
    first_name: "",
    last_name: "",
  });

  const [errorState, setErrorState] = useState<Record<string, string>>({
    email: "",
    first_name: "",
    last_name: "",
  });

  const [formPasswordState, setFormPasswordState] = useState<
    Record<string, string>
  >({
    new_password: "",
    confirm_password: "",
  });

  const [errorPasswordState, setErrorPasswordState] = useState<
    Record<string, string>
  >({
    new_password: "",
    confirm_password: "",
  });
  const currentTheme = useAppSelector((state: RootState) => state.theme.theme);

  const columns: Column[] = [
    {
      key: "first_name",
      label: "First Name",
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
    { key: "last_name", label: "Last Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "created_at", label: "Created On", sortable: true },
    {
      key: "active_status",
      label: "Status",
      sortable: true,
      render: (value: boolean, item: IStaffRecord) => (
        <Switch
          checked={value}
          onChange={() => {
            const getData = {
              currentPage: page,
              sort,
              sortColumn,
              searchText,
              status,
              perPage,
            };
            handleStaffStatusChange(
              dispatch,
              item.id,
              !value,
              getData,
              navigate,
              location
            );
          }}
        />
      ),
    },
  ];

  const formattedRecords =
    records && records.length > 0
      ? records.map((user: any) => ({
          ...user,
          created_at: moment(user.created_at).format("YYYY-MM-DD"),
          last_name: user.last_name ? user.last_name : "N/A",
        }))
      : [];

  const userFormFields: IStaffFormField[] = [
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
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "Enter email",
      required: true,
      image: emailImage,
      maxLength: 255,
      validationRules: {
        type: "email",
        maxLength: 255,
        required: true,
      },
      colProps: { xs: 12, md: 6 },
    },
  ];

  const passwordFormFields: IStaffFormField[] = [
    {
      name: "new_password",
      label: "New Password",
      type: "password",
      placeholder: "Enter new password",
      required: true,
      minLength: 8,
      maxLength: 20,
      image: passwordLockImage,
      validationRules: {
        type: "password",
        minLength: 8,
        maxLength: 20,
        required: true,
      },
      passwordTooltipShow: true,
      colProps: { xs: 12, md: 6 },
    },

    {
      name: "confirm_password",
      label: "Confirm Password",
      type: "password",
      placeholder: "Enter confirm password",
      required: true,
      minLength: 8,
      maxLength: 20,
      image: passwordLockImage,
      validationRules: {
        type: "password",
        minLength: 8,
        maxLength: 20,
        required: true,
      },
      passwordTooltipShow: true,
      colProps: { xs: 12, md: 6 },
    },
  ];

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
    handleFetchAllStaffDetails(
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

  const handleStatusFilter = (value: "all" | "active" | "inactive") => {
    setLocalStatus(value); // now `value` is correctly typed

    handleFetchAllStaffDetails(
      dispatch,
      {
        currentPage: 1,
        sort,
        sortColumn,
        searchText: localSearchText,
        status: value,
        perPage,
      },
      navigate,
      location
    );
  };

  const handlePerPageFilter = (value: number) => {
    setLocalPerPage(Number(value));

    handleFetchAllStaffDetails(
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

    handleFetchAllStaffDetails(
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
    handleFetchAllStaffDetails(
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

  const handleModalOpen = (type: string, data: IStaffRecord | null) => {
    if (type === "add") {
      setFormState({
        email: "",
        first_name: "",
        last_name: "",
      });
      dispatch(openModal({ type: "add" }));
    } else {
      setFormState({
        email: data?.email ? data?.email : "",
        first_name: data?.first_name ? data?.first_name : "",
        last_name: data?.last_name ? data?.last_name : "",
      });
      dispatch(openModal({ type: "edit", data }));
    }
  };

  const renderActions = (data: any) => (
    <div className="actions_wrap">
      <Tooltip title={`View Staff Details`}>
        <button
          className="action_btn"
          onClick={() => dispatch(openModal({ type: "view", data }))}
        >
          <ThemeImage imageName="viewImage" />
        </button>
      </Tooltip>
      <Tooltip title={`Edit Staff Details`}>
        <button
          className="action_btn"
          onClick={() => handleModalOpen("edit", data)}
        >
          <ThemeImage imageName="editImage" />
        </button>
      </Tooltip>
      <Tooltip title={`Change Password`}>
        <button
          className="action_btn"
          onClick={() => dispatch(openModal({ type: "changePassword", data }))}
        >
          <ThemeImage imageName="lockImage" />
        </button>
      </Tooltip>
      <Tooltip title={`Delete Staff User`}>
        <button
          className="action_btn"
          onClick={() => dispatch(openModal({ type: "delete", data }))}
        >
          <ThemeImage imageName="deleteImage" />
        </button>
      </Tooltip>
    </div>
  );

  const handleUserCancel = () => {
    dispatch(closeModal());
    setFormState({
      first_name: "",
      last_name: "",
      email: "",
    });
    setErrorState({
      first_name: "",
      last_name: "",
      email: "",
    });
  };
  const isFormValid = () => {
    const isAnyFieldEmpty = userFormFields.some(
      (field: any) => field.required && !formState[field.name]
    );
    const hasErrors = Object.values(errorState).some(
      (error) => error && error.length > 0
    );
    return !isAnyFieldEmpty && !hasErrors;
  };

  const isFormPasswordValid = () => {
    const isAnyFieldEmpty = passwordFormFields.some(
      (field: any) => field.required && !formPasswordState[field.name]
    );
    const hasErrors = Object.values(errorPasswordState).some(
      (error) => error && error.length > 0
    );
    return !isAnyFieldEmpty && !hasErrors;
  };

  const handlePasswordCancel = () => {
    dispatch(closeModal());
    setFormPasswordState({
      new_password: "",
      confirm_password: "",
    });
    setErrorPasswordState({
      new_password: "",
      confirm_password: "",
    });
  };

  const renderModalContent = () => {
    switch (modalType) {
      case "add":
      case "edit":
        return (
          <StaffForm
            formState={formState}
            setFormState={setFormState}
            errorState={errorState}
            setErrorState={setErrorState}
            onSubmit={() => {
              const getData = {
                currentPage: page,
                sort,
                sortColumn,
                searchText,
                status,
                perPage,
              };
              modalType === "edit"
                ? handleStaffUpdate(
                    dispatch,
                    formState,
                    userFormFields,
                    selectedData.id,
                    setErrorState,
                    getData,
                    navigate,
                    location
                  )
                : handleStaffCreation(
                    dispatch,
                    formState,
                    userFormFields,
                    setErrorState,
                    getData,
                    navigate,
                    location
                  );
            }}
            isFormValid={isFormValid}
            fields={userFormFields}
            dispatch={dispatch}
            isEditModal={modalType === "edit" ? true : false}
            onCancel={handleUserCancel}
          />
        );
      case "view":
        return (
          <StaffView
            selectedData={selectedData}
            onDelete={() =>
              dispatch(openModal({ type: "delete", data: selectedData }))
            }
            onEdit={() => handleModalOpen("edit", selectedData)}
            onClose={() => dispatch(closeModal())}
          />
        );
      case "changePassword":
        return (
          <StaffForm
            formState={formPasswordState}
            setFormState={setFormPasswordState}
            errorState={errorPasswordState}
            setErrorState={setErrorPasswordState}
            onSubmit={() => {
              const getData = {
                currentPage: page,
                sort,
                sortColumn,
                searchText,
                status,
                perPage,
              };
              handleStaffPasswordChange(
                dispatch,
                formPasswordState,
                passwordFormFields,
                selectedData.id,
                setErrorPasswordState,
                getData,
                navigate,
                location
              );
            }}
            isFormValid={isFormPasswordValid}
            fields={passwordFormFields}
            dispatch={dispatch}
            isEditModal={false}
            onCancel={handlePasswordCancel}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="col-lg-12">
      <div className="card shadow-sm rounded-3">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4 className="mb-0">
            <ThemeImage
              imageName="staffMemberImage"
              alt="staffMemberImage"
              className={
                currentTheme === "dark"
                  ? "dark-icon-image me-2"
                  : "light-icon-image me-2"
              }
            />
            Staff Members
          </h4>
          <CommonButton
            type="button"
            className="filled-btn"
            text="Add"
            icon={<FontAwesomeIcon icon={faAdd} />}
            onClick={() => handleModalOpen("add", null)}
          />
        </div>

        <div className="table_top">
          <div className="search_outer">
            <input
              placeholder="Search staff members"
              onChange={(e) => handleSearchInputChange(e.target.value)}
              // style={{ width: 300 }}
              value={localSearchText}
            />
            <div className="info-icon">
              <Tooltip
                title={`Search by First Name, Last Name, Email, Created On`}
              >
                <FontAwesomeIcon icon={faInfoCircle} className="fa-fw" />
              </Tooltip>
            </div>
          </div>
          <div className="d-flex gap-2 align-items-center">
            <CommonDropdown
              label="Status"
              options={[
                { label: "All", value: "all" },
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
              ]}
              selectedValue={localStatus}
              onSelect={(value) => handleStatusFilter(value as any)}
            />
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
        <CommonModal
          show={isOpen && modalType !== "delete"}
          onHide={
            modalType === "changePassword"
              ? handlePasswordCancel
              : handleUserCancel
          }
          title={
            modalType === "add"
              ? "Add New Staff Member"
              : modalType === "edit"
              ? "Edit Staff Member"
              : modalType === "view"
              ? "View Staff Member"
              : modalType === "changePassword"
              ? "Change Password"
              : ""
          }
        >
          {renderModalContent()}
        </CommonModal>
        <ConfirmationModal
          show={modalType === "delete"}
          onHide={() => dispatch(closeModal())}
          onConfirm={() => {
            const getData = {
              currentPage: page,
              sort,
              sortColumn,
              searchText,
              status,
              perPage,
            };
            handleStaffDeletion(
              dispatch,
              selectedData.id,
              getData,
              navigate,
              location,
              records
            );
          }}
          title="Confirm Delete"
          message="Are you sure you want to delete this staff member?"
        />
      </div>
    </div>
  );
};

export default StaffList;

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";
import { Column } from "../../../types/table.type";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import {
  closeModal,
  createKitInfo,
  deleteKitInfo,
  openModal,
  setLoader,
  updateKitInfo,
} from "../../../redux/action";
import { handleFetchAllKitDetails } from "../../../pages/manage_inventory/manage-inventory.event";
import { Tooltip } from "antd";
import CommonDropdown from "../../common/dropdown/CommonDropdown";
import CommonTable from "../../common/table/CommonTable";
import {
  FetchKitDetailsParams,
  Kit,
} from "../../../types/manage-inventory.type";
import ThemeImage from "../../common/icons/ThemeImage";
import ConfirmationModal from "../../common/Modal/ConfirmationModal";
import CommonModal from "../../common/Modal/CommonModal";
import InventoryForm from "./InventoryForm";
import { validateForm } from "../../../utils/validation/validationUtils";
import KitViewModal from "./KitViewModal";
import { useLocation, useNavigate } from "react-router-dom";

const KitList = () => {
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
    type,
    perPage,
    totalRecords,
  } = useAppSelector((state: RootState) => state.manageInventory);
  const { isOpen, modalType, selectedData } = useAppSelector(
    (state: RootState) => state.modal
  );
  const currentTheme = useAppSelector((state: RootState) => state.theme.theme);

  const [localSearchText, setLocalSearchText] = useState(searchText);
  const [localType, setLocalType] = useState(type);
  const [localPerPage, setLocalPerPage] = useState(perPage);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);

    setLocalSearchText(searchParams.get("searchText") || "");
    setLocalType(searchParams.get("type") || "");
    setLocalPerPage(Number(searchParams.get("perPage")) || 10);

    const initialParams: FetchKitDetailsParams = {
      currentPage: Number(searchParams.get("currentPage")) || 1,
      perPage: Number(searchParams.get("perPage")) || 10,
      sort: searchParams.get("sort") || "desc",
      sortColumn: searchParams.get("sortColumn") || "created_at",
      searchText: searchParams.get("searchText") || "",
      type: searchParams.get("type") || "",
    };

    handleFetchAllKitDetails(dispatch, initialParams, navigate, location);

    // eslint-disable-next-line
  }, [location.search]);

  const [formState, setFormState] = useState<Record<string, string>>({
    type: "",
    quantity: "",
    supplier_name: "",
    supplier_contact_number: "",
    supplier_address: "",
  });
  const [errFormState, setErrFormState] = useState<Record<string, string>>({
    type: "",
    quantity: "",
    supplier_name: "",
    supplier_contact_number: "",
    supplier_address: "",
  });

  const columns: Column[] = [
    {
      key: "type",
      label: "Type",
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
    { key: "quantity", label: "Quantity", sortable: true },
    { key: "supplier_name", label: "Supplier Name", sortable: true },
    { key: "created_by", label: "Created By", sortable: true },
    { key: "created_at", label: "Created On", sortable: true },
  ];
  const formattedRecords =
    records && records.length > 0
      ? records.map((kit: any) => ({
          ...kit,
          created_at: moment(kit.created_at).format("YYYY-MM-DD"),
          created_by: `${kit.created_by.first_name} ${kit.created_by.last_name}`,
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
    handleFetchAllKitDetails(
      dispatch,
      {
        currentPage: 1,
        sort,
        sortColumn,
        searchText: value,
        type: localType,
        perPage,
      },
      navigate,
      location
    );
  };

  const handleStatusFilter = (value: string) => {
    setLocalType(value);
    handleFetchAllKitDetails(
      dispatch,
      {
        currentPage: 1,
        sort,
        sortColumn,
        searchText: localSearchText,
        type: value,
        perPage,
      },
      navigate,
      location
    );
  };

  const handlePerPageFilter = (value: number) => {
    setLocalPerPage(Number(value));
    handleFetchAllKitDetails(
      dispatch,
      {
        currentPage: 1,
        sort,
        sortColumn,
        searchText: localSearchText,
        type: localType,
        perPage: Number(value),
      },
      navigate,
      location
    );
  };

  const handleSort = (column: string) => {
    const newDirection = sort === "asc" ? "desc" : "asc";
    handleFetchAllKitDetails(
      dispatch,
      {
        currentPage: page,
        sort: newDirection,
        sortColumn: column,
        searchText: localSearchText,
        type: localType,
        perPage,
      },
      navigate,
      location
    );
  };

  const handlePageChange = (selectedItem: { selected: number }) => {
    handleFetchAllKitDetails(
      dispatch,
      {
        currentPage: selectedItem.selected + 1,
        sort,
        sortColumn,
        searchText: localSearchText,
        type: localType,
        perPage,
      },
      navigate,
      location
    );
  };

  const renderActions = (data: Kit) => (
    <div className="actions_wrap">
      <Tooltip title={`View Kits Details`}>
        <button
          className="action_btn"
          onClick={() => dispatch(openModal({ type: "view", data }))}
        >
          <ThemeImage imageName="viewImage" />
        </button>
      </Tooltip>
      <Tooltip title={`Edit Kits Details`}>
        <button
          className="action_btn"
          onClick={() => handleModalOpen("edit", data)}
        >
          <ThemeImage imageName="editImage" />
        </button>
      </Tooltip>
      <Tooltip title={`Delete Kit`}>
        <button
          className="action_btn"
          onClick={() => dispatch(openModal({ type: "delete", data }))}
        >
          <ThemeImage imageName="deleteImage" />
        </button>
      </Tooltip>
    </div>
  );

  const handleDelete = async (user_id: string) => {
    try {
      await dispatch(setLoader(true));
      await dispatch(closeModal());
      await dispatch(
        deleteKitInfo({
          user_id,
        })
      );
      await handleFetchAllKitDetails(
        dispatch,
        {
          currentPage: records && records.length > 1  ? page : page - 1,
          sort,
          sortColumn,
          searchText: localSearchText,
          type: localType,
          perPage,
        },
        navigate,
        location
      );
    } catch (err) {
      console.error("Error while delete user:", err);
    } finally {
      await dispatch(setLoader(false));
    }
  };

  const formFields = [
    {
      name: "type",
      label: "Kit Type",
      type: "select",
      placeholder: "Select kit type",
      required: true,
      validationRules: {
        type: "select",
        required: true,
      },
      options: [
        { label: "Blood", value: "blood" },
        { label: "Saliva", value: "saliva" },
      ],
      colProps: { xs: 12, md: 6 },
    },
    {
      name: "quantity",
      label: "Quantity (Number of Kits)",
      type: "text",
      placeholder: "Enter quantity",
      required: true,
      maxLength: 5,
      validationRules: { type: "number", maxLength: 5, required: true },
      colProps: { xs: 12, md: 6 },
    },
    {
      name: "supplier_name",
      label: "Supplier Name",
      type: "text",
      placeholder: "Enter supplier name",
      required: true,
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
      name: "supplier_contact_number",
      label: "Supplier Contact Number",
      type: "text",
      placeholder: "Enter supplier contact number",
      required: true,
      maxLength: 15,
      validationRules: {
        type: "phoneNumber",
        maxLength: 15,
        minLength: 10,
        required: true,
      },
      colProps: { xs: 12, md: 6 },
    },
    {
      name: "supplier_address",
      label: "Supplier Address",
      type: "textarea",
      placeholder: "Enter supplier address",
      maxLength: 100,
      required: false,
      validationRules: {
        type: "textarea",
        maxLength: 100,
        minLength: 5,
      },
      colProps: { xs: 12, md: 6 },
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
      await dispatch(createKitInfo(formState));
      await handleFetchAllKitDetails(
        dispatch,
        {
          currentPage: 1,
          sort : "desc",
          sortColumn : "created_at",
          searchText: "",
          type: "",
          perPage,
        },
        navigate,
        location
      );
      handleKitCancel();
    } catch (err) {
      console.error("Error while creating kit:", err);
    } finally {
      await dispatch(setLoader(false));
    }
  };

  const handleUpdateSubmit = async () => {
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
      const payload = {
        type: formState.type,
        supplier_name: formState.supplier_name,
        quantity: formState.quantity,
        supplier_address: formState.supplier_address,
        supplier_contact_number: formState.supplier_contact_number,
      };
      await dispatch(updateKitInfo(payload, selectedData.id));
      await handleFetchAllKitDetails(
        dispatch,
        {
          currentPage: page,
          sort,
          sortColumn,
          searchText: localSearchText,
          type: localType,
          perPage,
        },
        navigate,
        location
      );
      handleKitCancel();
    } catch (err) {
      console.error("Error while updating kit:", err);
    } finally {
      await dispatch(setLoader(false));
    }
  };

  const isFormValid = () => {
    const isAnyFieldEmpty = formFields.some(
      (field) => field.required && !formState[field.name]
    );
    const hasErrors = Object.values(errFormState).some(
      (error) => error && error.length > 0
    );
    return !isAnyFieldEmpty && !hasErrors;
  };

  const handleKitCancel = () => {
    dispatch(closeModal());
    setFormState({
      type: "",
      quantity: "",
      supplier_name: "",
      supplier_contact_number: "",
      supplier_address: "",
    });
    setErrFormState({
      type: "",
      quantity: "",
      supplier_name: "",
      supplier_contact_number: "",
      supplier_address: "",
    });
  };

  const handleModalOpen = (type: string, data: any) => {
    if (type === "add") {
      setFormState({
        type: "",
        quantity: "",
        supplier_name: "",
        supplier_contact_number: "",
        supplier_address: "",
      });
      setErrFormState({
        type: "",
        quantity: "",
        supplier_name: "",
        supplier_contact_number: "",
        supplier_address: "",
      });
      dispatch(openModal({ type: "add" }));
    } else {
      setFormState({
        type: data.type || "",
        quantity: data.quantity || "",
        supplier_name: data.supplier_name || "",
        supplier_contact_number: data.supplier_contact_number || "",
        supplier_address: data.supplier_address || "",
      });
      setErrFormState({
        type: "",
        quantity: "",
        supplier_name: "",
        supplier_contact_number: "",
        supplier_address: "",
      });
      dispatch(openModal({ type: "edit", data }));
    }
  };

  const renderModalContent = () => {
    switch (modalType) {
      case "add":
      case "edit":
        return (
          <InventoryForm
            formState={formState}
            setFormState={setFormState}
            errorState={errFormState}
            setErrorState={setErrFormState}
            onSubmit={() => {
              modalType === "edit" ? handleUpdateSubmit() : handleSubmit();
            }}
            isFormValid={isFormValid}
            fields={formFields}
            dispatch={dispatch}
            isEditModal={modalType === "edit" ? true : false}
            onCancel={handleKitCancel}
          />
        );
      case "view":
        return (
          <KitViewModal
            kitData={selectedData}
            onDelete={() =>
              dispatch(openModal({ type: "delete", data: selectedData }))
            }
            onEdit={() => handleModalOpen("edit", selectedData)}
            onClose={() => dispatch(closeModal())}
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
            {/* <FontAwesomeIcon icon={faBoxes} className="me-2" /> */}
            <ThemeImage
              imageName="kitListImage"
              alt="kitListImage"
              className={
                currentTheme === "dark"
                  ? "dark-icon-image me-2"
                  : "light-icon-image me-2"
              }
            />
            Kits List
          </h4>
          <button
            className="filled-btn"
            onClick={() => handleModalOpen("add", null)}
          >
            <FontAwesomeIcon icon={faAdd} className="me-2" />
            Add
          </button>
        </div>

        <div className="table_top">
          <div className="search_outer">
            <input
              placeholder="Search Kits"
              onChange={(e) => handleSearchInputChange(e.target.value)}
              // style={{ width: 300 }}
              value={localSearchText}
            />
            <div className="info-icon">
              <Tooltip
                title={`Search by Quantity, Supplier Name, Created By, Created On`}
              >
                <FontAwesomeIcon icon={faInfoCircle} className="fa-fw" />
              </Tooltip>
            </div>
          </div>
          <div className="d-flex gap-3 mt-2 mt-md-0">
            <CommonDropdown
              label="Kit Type"
              options={[
                { label: "All", value: "" },
                { label: "Blood", value: "blood" },
                { label: "Saliva", value: "saliva" },
              ]}
              selectedValue={localType}
              onSelect={(eventKey) => handleStatusFilter(eventKey as any)}
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
      </div>
      <CommonModal
        show={isOpen && modalType !== "delete"}
        onHide={handleKitCancel}
        title={
          modalType === "add"
            ? "Add New Kit"
            : modalType === "edit"
            ? "Edit Kit"
            : modalType === "view"
            ? "View Kit"
            : ""
        }
      >
        {renderModalContent()}
      </CommonModal>
      <ConfirmationModal
        show={modalType === "delete"}
        onHide={() => dispatch(closeModal())}
        onConfirm={() => handleDelete(selectedData.id)}
        title="Confirm Delete"
        message="Are you sure you want to delete this kit?"
      />
    </div>
  );
};

export default KitList;

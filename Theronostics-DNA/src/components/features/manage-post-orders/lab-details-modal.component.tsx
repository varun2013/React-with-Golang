import React, { useEffect, useState } from "react";
import { Dropdown, FormControl, Modal } from "react-bootstrap";
import { useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";
import CommonForm from "../../common/form/CommonForm";
import CommonButton from "../../common/button/CommonButton";
import { validateForm } from "../../../utils/validation/validationUtils";

interface LabDetailsModalProps {
  show: boolean;
  onHide: () => void;
  selectedKitData: any;
  setSelectedKitData: any;
  errSelectedKitData: any;
  setErrSelectedKitData: any;
  handleStatusChange: any;
}

const LabDetailsModal: React.FC<LabDetailsModalProps> = ({
  show,
  onHide,
  selectedKitData,
  setSelectedKitData,
  errSelectedKitData,
  setErrSelectedKitData,
  handleStatusChange,
}) => {
  const { records } = useAppSelector((state: RootState) => state.manageLabs);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(true);

  useEffect(() => {
    // Show form by default if no records
    setShowForm(records.length === 0);
  }, [records]);

  const fields = [
    {
      name: "lab_name",
      label: "Lab Name",
      type: "textarea",
      placeholder: "Enter lab name",
      required: true,
      maxLength: 255,
      minLength: 5,
      validationRules: {
        type: "textarea",
        maxLength: 255,
        minLength: 5,
        required: true,
      },
      colProps: { xs: 12, md: 6 },
    },
    {
      name: "lab_address",
      label: "Lab Address",
      type: "textarea",
      placeholder: "Enter lab address",
      required: true,
      maxLength: 255,
      minLength: 5,
      validationRules: {
        type: "textarea",
        maxLength: 255,
        minLength: 5,
        required: true,
      },
      colProps: { xs: 12, md: 6 },
    },
    {
      name: "nhi_number",
      label: "NHI number",
      type: "text",
      placeholder: "Enter NHI number",
      required: true,
      maxLength: 10,
      minLength: 10,
      validationRules: {
        type: "nhi_number",
        maxLength: 10,
        minLength: 10,
        required: true,
      },
      colProps: { xs: 12, md: 6 },
    },
  ];

  const handleLabSelect = (lab: any) => {
    if (lab.id === 0) {
      // Selected "Other"
      setSelectedKitData({
        ...selectedKitData,
        lab_name: null,
        lab_address: null,
        nhi_number: null,
        type: "new",
        lab_id: 0,
      });
      setShowForm(true);
    } else {
      // Selected existing lab
      setSelectedKitData({
        ...selectedKitData,
        lab_name: lab.lab_name,
        lab_address: lab.lab_address,
        nhi_number: lab.nhi_number,
        type: "old",
        lab_id: lab.id,
      });
      setShowForm(false);
    }
  };

  const isFormValid = (): boolean => {
    const isAnyFieldEmpty = fields.some(
      (field) => field.required && !selectedKitData[field.name]
    );

    const hasErrors = Object.values(errSelectedKitData).some(
      (error: any) => error && error.length > 0
    );

    return !isAnyFieldEmpty && !hasErrors;
  };

  const handleSubmit = () => {
    // Validate form
    const validationErrors = validateForm(selectedKitData, fields);

    if (Object.keys(validationErrors).length > 0) {
      setErrSelectedKitData((prevErrors: any) => ({
        ...prevErrors,
        ...validationErrors,
      }));
      return;
    }

    handleStatusChange(selectedKitData?.id, "Send", null);
  };

  const filteredRecords = records.filter((lab: any) =>
    lab.lab_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        backdrop="static"
        keyboard={false}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title className="modelTitle">Choose Lab</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <>
            {records.length > 0 && (
              <>
                <h5 className="mb-3">Select an Existing Lab</h5>
                <Dropdown className="mb-4">
                  <Dropdown.Toggle variant="secondary" id="lab-dropdown">
                    {selectedKitData.lab_name || "Select Lab"}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="w-100">
                    <FormControl
                      autoFocus
                      className="mx-3 my-2 w-auto"
                      placeholder="Search labs..."
                      onChange={(e) => setSearchTerm(e.target.value)}
                      value={searchTerm}
                    />
                    <Dropdown.Divider />
                    {filteredRecords.map((lab: any) => (
                      <Dropdown.Item
                        key={lab.id}
                        onClick={() => handleLabSelect(lab)}
                      >
                        {lab.lab_name}
                      </Dropdown.Item>
                    ))}
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={() => handleLabSelect({ id: 0 })}>
                      Other
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            )}

            {showForm && (
              <>
                <h5 className="mb-3">Enter New Lab Details</h5>
                <CommonForm
                  state={selectedKitData}
                  setState={setSelectedKitData}
                  errorState={errSelectedKitData}
                  setErrorState={setErrSelectedKitData}
                  fields={fields}
                  onSubmit={handleSubmit}
                />
              </>
            )}
            <div className="d-flex justify-content-end mt-3 gap-3">
              <CommonButton
                type="button"
                className="outlined-btn"
                text="Cancel"
                onClick={onHide}
              />
              <CommonButton
                type="submit"
                className={!isFormValid() ? "disabled-btn" : "filled-btn"}
                text="Send"
                onClick={handleSubmit}
                disabled={!isFormValid()}
              />
            </div>
          </>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default LabDetailsModal;

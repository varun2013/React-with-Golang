import React from "react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { IStaffViewProps } from "../../../types/manage-staff.types";

const StaffView: React.FC<IStaffViewProps> = ({
  selectedData,
  onDelete,
  onEdit,
  onClose,
}) => {
  return (
    <div>
      <div className="px-0 report_detail container">
        <div className="row row-gap-3">
          {[
            { label: "First Name", value: selectedData.first_name },
            { label: "Last Name", value: selectedData.last_name },
            { label: "Email", value: selectedData.email },
            {
              label: "Status",
              value: (
                <span
                  className={`status ${
                    selectedData.active_status ? "complete" : "inprogress"
                  }`}
                >
                  {selectedData.active_status ? "Active" : "Not Active"}
                </span>
              ),
            },
            {
              label: "Created On",
              value: moment(selectedData.created_at).format("YYYY-MM-DD"),
            },
          ].map((detail, index) => (
            <div key={index} className="col-md-6">
              <div className="report_inn">
                <p className="mb-1 form-label">{detail.label}</p>
                <p className="txt">{detail.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="d-flex justify-content-between w-100 btn_wrap mt-3">
        <Button
          variant="outline-danger"
          className="danger-btn"
          onClick={onDelete}
        >
          <FontAwesomeIcon icon={faTrash} /> Delete
        </Button>
        <div className="btn_grp">
          <Button variant="primary" className="filled-btn" onClick={onEdit}>
            <FontAwesomeIcon icon={faEdit} /> Edit
          </Button>
          <Button className="outlined-btn" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StaffView;

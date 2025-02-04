import React from "react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { Kit } from "../../../types/manage-inventory.type";

interface KitViewModalProps {
  kitData: Kit;
  onDelete: () => void;
  onEdit: () => void;
  onClose: () => void;
}

const KitViewModal: React.FC<KitViewModalProps> = ({
  kitData,
  onDelete,
  onEdit,
  onClose,
}) => {
  return (
    <div className="px-0 report_detail container">
      <div className="row row-gap-3">
        {[
          { label: "Kit Type", value: kitData?.type },
          { label: "Quantity", value: kitData?.quantity },
          { label: "Supplier Name", value: kitData?.supplier_name },
          {
            label: "Supplier Contact Number",
            value: kitData?.supplier_contact_number,
          },
        ].map(({ label, value }) => (
          <div key={label} className="col-md-6">
            <div className="report_inn">
              <p className="mb-1 form-label">
                {label}
              </p>
              <p className="txt">{value}</p>
            </div>
          </div>
        ))}
        <div className="col-md-12">
          <div className="report_inn">
            <p className="mb-1 form-label">
              Supplier Address
            </p>
            <p className="txt">{kitData?.supplier_address || "N/A"}</p>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-between w-100 btn_wrap mt-3">
        <Button className="danger-btn" onClick={onDelete}>
          <FontAwesomeIcon icon={faTrash} /> Delete
        </Button>
        <div className="btn_grp">
          <Button className="filled-btn" onClick={onEdit}>
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

export default KitViewModal;

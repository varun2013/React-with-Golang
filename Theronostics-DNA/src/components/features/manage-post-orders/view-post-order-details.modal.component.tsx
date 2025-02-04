import React from "react";
import { IPostOrderViewProps } from "../../../types/manage-post-order.type";
import { Badge, Button } from "react-bootstrap";
import { useAppDispatch } from "../../../redux/hooks";
import { closeModal } from "../../../redux/action";
import config from "../../../config/config";
import { Link } from "react-router-dom";

const ViewPostOrderModal: React.FC<IPostOrderViewProps> = ({
  selectedData,
}) => {
  const dispatch = useAppDispatch();

  // Function to get badge variant based on payment status
  const getBadgeVariant = (status: string) => {
    if (status) {
      switch (status.toLowerCase()) {
        case "not-received":
          return "warning";
        case "received":
          return "success";
        case "reject":
          return "danger";

        default:
          return "secondary";
      }
    }

    return "";
  };
  return (
    <>
      <div className="px-0 report_detail container">
        <div className="row row-gap-3">
          <div className="col-md-6">
            <div className="report_inn">
              <p className="mb-1">
                <b>QRCode/Barcode Number</b>
              </p>
              <p className="txt">{selectedData?.barcode_number}</p>
            </div>
          </div>

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
                <b>Customer Name</b>
              </p>
              <p className="txt">{selectedData?.customer_name}</p>
            </div>
          </div>

          <div className="col-md-6">
            <div className="report_inn">
              <p className="mb-1">
                <b>Customer Email</b>
              </p>
              <p className="txt">{selectedData?.customer_email}</p>
            </div>
          </div>
       
          <div className="col-md-6">
            <div className="report_inn">
              <p className="mb-1">
                <b>Patient Name</b>
              </p>
              <p className="txt">{selectedData?.patient_first_name + " " + selectedData?.patient_last_name}</p>
            </div>
          </div>

          <div className="col-md-6">
            <div className="report_inn">
              <p className="mb-1">
                <b>Patient Email</b>
              </p>
              <p className="txt">{selectedData?.patient_email}</p>
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="report_inn">
              <p className="mb-1">
                <b>Patient Age</b>
              </p>
              <p className="txt">{selectedData?.patient_age}</p>
            </div>
          </div>

          <div className="col-md-6">
            <div className="report_inn">
              <p className="mb-1">
                <b>Patient Gender</b>
              </p>
              <p className="txt">{selectedData?.patient_gender}</p>
            </div>
          </div>

          <div className="col-md-6">
            <div className="report_inn">
              <p className="mb-1">
                <b>Status</b>
              </p>
              <p className="txt">
                <Badge bg={getBadgeVariant(selectedData?.kit_status)}>
                  {selectedData?.kit_status}
                </Badge>
              </p>
            </div>
          </div>

          {selectedData?.kit_status === "Reject" && selectedData?.reason && (
            <div className="col-md-6">
              <div className="report_inn">
                <p className="mb-1">
                  <b>Reason of Rejection</b>
                </p>
                <p
                  className="txt"
                  style={{ maxHeight: "100px", overflow: "auto" }}
                >
                  {selectedData?.reason}
                </p>
              </div>
            </div>
          )}

          {selectedData?.kit_status === "Send" &&
            selectedData?.file_path && (
              <div className="col-md-6">
                <div className="report_inn">
                  <p className="mb-1">
                    <b>Lab Report</b>
                  </p>
                  <p className="txt">
                    <Link
                      target="_blank"
                      className="txt"
                      to={`${config.apiUrl}/${selectedData?.file_path}`}
                    >
                      Download Lab Report ({selectedData?.file_path})
                    </Link>
                  </p>
                </div>
              </div>
            )}

          {/* Created Date */}
          <div className="col-md-6">
            <div className="report_inn">
              <p className="mb-1">
                <b>Register On</b>
              </p>
              <p className="txt">{selectedData?.created_at}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-end w-100 btn_wrap mt-3">
        <Button className="outlined-btn" onClick={() => dispatch(closeModal())}>
          Cancel
        </Button>
      </div>
    </>
  );
};

export default ViewPostOrderModal;

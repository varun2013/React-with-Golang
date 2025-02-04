import React from "react";
import { useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";
import { Badge, Button, Dropdown, Modal } from "react-bootstrap";
import moment from "moment";
import { Link } from "react-router-dom";
import config from "../../../config/config";
import { decrypt } from "../../../utils/encryption/decryption";
import { Tooltip } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
interface OrderDetailsModalProps {
  show: boolean;
  onHide: () => void;
  handleDropdownChange: (newStatus: string) => void;
  handleKitStatusDropdownChange: (newStatus: string) => void;
  handleUploadReport: () => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  show,
  onHide,
  handleDropdownChange,
  handleKitStatusDropdownChange,
  handleUploadReport,
}) => {
  const { response } = useAppSelector((state: RootState) => state.globalSearch);

  const getBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
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
        return "success"; // Green for delivered
      case "not-received":
        return "warning";
      case "received":
        return "success";
      case "reject":
        return "danger";
      default:
        return "secondary";
    }
  };

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
          <Modal.Title className="modelTitle">Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="px-0 report_detail container">
            <div className="row ">
              <div className="col-md-12">
                <div className="report_inn">
                  <p className="mb-1 form-label">QRCode/Barcode Number</p>
                  <p className="txt">{response?.barcode_number}</p>
                </div>
              </div>
            </div>
            <hr />
            <div className="row row-gap-3">
              <div className="col-md-4 col-sm-6 col-12">
                <div className="report_inn">
                  <p className="mb-1 form-label">Order ID</p>
                  <p className="txt">{response?.order_number}</p>
                </div>
              </div>

              <div className="col-md-4 col-sm-6 col-12">
                <div className="report_inn">
                  <p className="mb-1 form-label">Order Date</p>
                  <p className="txt">
                    {moment(response?.order_created_at).format("YYYY-MM-DD")}
                  </p>
                </div>
              </div>

              <div className="col-md-4 col-sm-6 col-12">
                <div className="report_inn">
                  <p className="mb-1 form-label">Quantity</p>
                  <p className="txt">{response?.quantity}</p>
                </div>
              </div>

              {response?.type === "clinic" && (
                <div className="col-md-4 col-sm-6 col-12">
                  <div className="report_inn">
                    <p className="mb-1 form-label">Assigned Barcode</p>
                    <p className="txt">{response?.barcode_count}</p>
                  </div>
                </div>
              )}

              {response?.tracking_id && (
                <div className="col-md-4 col-sm-6 col-12">
                  <div className="report_inn">
                    <p className="mb-1 form-label">Tracking ID</p>
                    <p className="txt">{response?.tracking_id || "N/A"}</p>
                  </div>
                </div>
              )}

              <div className="col-md-4 col-sm-6 col-12">
                <div className="report_inn">
                  <p className="mb-1 form-label">Order Current Status</p>
                  {response?.order_status !== "Dispatched" && (
                    <Dropdown
                      onSelect={(eventKey: string | null) =>
                        handleDropdownChange(eventKey || "")
                      }
                    >
                      <Dropdown.Toggle
                        variant="secondary"
                        size="sm"
                        className={response?.order_status}
                      >
                        {response?.order_status}
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        {(response?.order_status === "Pending"
                          ? ["pending", "processing", "dispatched"]
                          : response?.order_status === "Processing"
                          ? ["processing", "dispatched"]
                          : ["dispatched"]
                        ).map((status) => (
                          <Dropdown.Item key={status} eventKey={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  )}
                  {response?.order_status === "Dispatched" && (
                    <p className="txt">
                      <Badge bg={getBadgeVariant(response?.order_status)}>
                        {response?.order_status}
                      </Badge>
                    </p>
                  )}
                </div>
              </div>

              {response?.kit_status && (
                <div className="col-md-4 col-sm-6 col-12">
                  <div className="report_inn">
                    <p className="mb-1 form-label">Current Kit Status</p>
                    {!["Reject", "Send"].includes(response?.kit_status) && (
                      <Dropdown
                        onSelect={(eventKey: string | null) =>
                          handleKitStatusDropdownChange(eventKey || "")
                        }
                      >
                        <Dropdown.Toggle
                          size="sm"
                          disabled={
                            response?.kit_status !== "Not-Received" &&
                            response?.kit_status !== "Received"
                          }
                          className={response?.kit_status
                            .toLowerCase()
                            .replace("-", "_")}
                        >
                          {response?.kit_status === "Send"
                            ? "Sent to lab"
                            : response?.kit_status}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          {(response?.kit_status === "Not-Received"
                            ? ["Not-Received", "Received", "Send", "Reject"]
                            : ["Received", "Send", "Reject"]
                          ).map((status) => (
                            <Dropdown.Item key={status} eventKey={status}>
                              {status === "Send"
                                ? "Send to lab"
                                : status.charAt(0).toUpperCase() +
                                  status.slice(1)}
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    )}
                    {["Reject", "Send"].includes(response?.kit_status) && (
                      <p className="txt">
                        <Badge bg={getBadgeVariant(response?.kit_status)}>
                          {response?.kit_status === "Send"
                            ? "Sent to lab"
                            : response?.kit_status}
                        </Badge>
                      </p>
                    )}
                  </div>
                </div>
              )}

              {response?.kit_status === "Send" && (
                <div className="col-md-4 col-sm-6 col-12">
                  <div className="report_inn">
                    <p className="mb-1 form-label">Upload Report</p>
                     
                      <div className="actions_wrap">
                        <Tooltip
                          title={
                            response?.kit_status === "Not-Received"
                              ? "Kit not received yet."
                              : response?.kit_status === "Reject"
                              ? "Kit rejected."
                              : `Upload Patient Lab Report`
                          }
                        >
                          <button
                            className={
                              response?.kit_status !== "Send"
                                ? "action-disabled-btn"
                                : "action_btn"
                            }
                            onClick={() => handleUploadReport()}
                            disabled={response?.kit_status !== "Send"}
                          >
                            <FontAwesomeIcon icon={faUpload} />
                          </button>
                        </Tooltip>
                      </div>
                  </div>
                </div>
              )}
            </div>
            <hr />
            <div className="row row-gap-3 mt-3">
              {/* Customer Details */}
              <div className="col-md-4 col-sm-6 col-12">
                <div className="report_inn">
                  <p className="mb-1 form-label">Customer Full Name</p>
                  <p className="txt">
                    {`${response?.first_name} ${response?.last_name}`}
                  </p>
                </div>
              </div>
              <div className="col-md-4 col-sm-6 col-12">
                <div className="report_inn">
                  <p className="mb-1 form-label">Contact Email</p>
                  <p className="txt">{response?.email}</p>
                </div>
              </div>
              <div className="col-md-4 col-sm-6 col-12">
                <div className="report_inn">
                  <p className="mb-1 form-label">Contact Number</p>
                  <p className="txt">{response?.phone_number}</p>
                </div>
              </div>
              <div className="col-md-4 col-sm-6 col-12">
                <div className="report_inn">
                  <p className="mb-1 form-label">Current Address</p>
                  <p className="txt">
                    {" "}
                    {response?.street_address},{response?.town_city},
                    {response?.region},{response?.country},{response?.postcode}
                  </p>
                </div>
              </div>
              <div className="col-md-4 col-sm-6 col-12">
                <div className="report_inn">
                  <p className="mb-1 form-label">Shipping Address</p>
                  <p className="txt">
                    {" "}
                    {response?.shipping_address},{response?.shipping_town_city},
                    {response?.shipping_region},{response?.shipping_country},
                    {response?.shipping_postcode}
                  </p>
                </div>
              </div>
              {response?.clinic_id && (
                <div className="col-md-4 col-sm-6 col-12">
                  <div className="report_inn">
                    <p className="mb-1 form-label">Clinic ID</p>
                    <p className="txt">{response?.clinic_id}</p>
                  </div>
                </div>
              )}
            </div>
            <hr />
            <div className="row row-gap-3 mt-3">
              {/* Product Details */}
              <div className="col-md-4 col-sm-6 col-12">
                <div className="report_inn">
                  <p className="mb-1 form-label">Product Name</p>
                  <p className="txt">{response?.product_name}</p>
                </div>
              </div>
              <div className="col-md-12 col-sm-6 col-12">
                <div className="report_inn">
                  <p className="mb-1 form-label">Product Description</p>
                  <p
                    className="txt"
                    style={{ maxHeight: "100px", overflow: "auto" }}
                  >
                    {response?.product_description}
                  </p>
                </div>
              </div>

              {/* Pricing Details */}
              {response?.product_price && (
                <div className="col-md-4 col-sm-6 col-12">
                  <div className="report_inn">
                    <p className="mb-1 form-label">Product Price($)</p>
                    <p className="txt">
                      {response?.product_price > 0
                        ? `$${response?.product_price.toFixed(2)}`
                        : "0.00"}
                    </p>
                  </div>
                </div>
              )}
              {response?.product_gst_price && (
                <div className="col-md-4 col-sm-6 col-12">
                  <div className="report_inn">
                    <p className="mb-1 form-label">GST Price($)</p>
                    <p className="txt">
                      {response?.product_gst_price > 0
                        ? `$${response?.product_gst_price.toFixed(2)}`
                        : "0.00"}
                    </p>
                  </div>
                </div>
              )}
              <div className="col-md-4 col-sm-6 col-12">
                <div className="report_inn">
                  <p className="mb-1 form-label">Product Discount(%)</p>
                  <p className="txt">
                    {response?.product_discount === 0
                      ? 0
                      : response?.product_discount + "%"}
                  </p>
                </div>
              </div>

              {/* Order Quantity and Total */}

              {response?.total_price && (
                <div className="col-md-4 col-sm-6 col-12">
                  <div className="report_inn">
                    <p className="mb-1 form-label">Total Price</p>
                    <p className="txt">
                      {`$${response?.total_price.toFixed(2)}`}
                    </p>
                  </div>
                </div>
              )}

              <div className="col-md-4 col-sm-6 col-12">
                <div className="report_inn">
                  <p className="mb-1 form-label">Transaction ID</p>
                  <p className="txt">{response?.transaction_id || "N/A"}</p>
                </div>
              </div>

              <div className="col-md-4 col-sm-6 col-12">
                <div className="report_inn">
                  <p className="mb-1 form-label">Payment Status</p>
                  <p className="txt">
                    {response?.payment_status && (
                      <Badge bg={getBadgeVariant(response.payment_status)}>
                        {response.payment_status}
                      </Badge>
                    )}
                  </p>
                </div>
              </div>

              {response?.payment_status === "Completed" && (
                <div className="col-md-4 col-sm-6 col-12">
                  <div className="report_inn">
                    <p className="mb-1 form-label">Invoice</p>
                    <Link
                      target="_blank"
                      className="txt"
                      to={`${config.apiUrl}/${response?.invoice_link}`}
                    >
                      Download Invoice ({response?.invoice_id})
                    </Link>
                  </div>
                </div>
              )}
            </div>
            {response?.patient_first_name && <hr />}
            <div className="row row-gap-3 mt-3">
              {response?.patient_first_name && (
                <div className="col-md-4 col-sm-6 col-12">
                  <div className="report_inn">
                    <p className="mb-1 form-label">Patient Name</p>
                    <p className="txt">
                      {decrypt(response?.patient_first_name) +
                        " " +
                        decrypt(response?.patient_last_name)}
                    </p>
                  </div>
                </div>
              )}
              {response?.patient_email && (
                <div className="col-md-4 col-sm-6 col-12">
                  <div className="report_inn">
                    <p className="mb-1 form-label">Patient Email</p>
                    <p className="txt">{decrypt(response?.patient_email)}</p>
                  </div>
                </div>
              )}
              {response?.patient_age && (
                <div className="col-md-4 col-sm-6 col-12">
                  <div className="report_inn">
                    <p className="mb-1 form-label">Patient Age</p>
                    <p className="txt">{decrypt(response?.patient_age)}</p>
                  </div>
                </div>
              )}
              {response?.patient_gender && (
                <div className="col-md-4 col-sm-6 col-12">
                  <div className="report_inn">
                    <p className="mb-1 form-label">Patient Gender</p>
                    <p className="txt">
                      {decrypt(response?.patient_gender)
                        .charAt(0)
                        .toUpperCase() +
                        decrypt(response?.patient_gender)
                          .slice(1)
                          .toLowerCase()}
                    </p>
                  </div>
                </div>
              )}

              {response?.kit_status === "Reject" && response?.reason && (
                <div className="col-md-4 col-sm-6 col-12">
                  <div className="report_inn">
                    <p className="mb-1 form-label">Reason of Rejection</p>
                    <p
                      className="txt"
                      style={{ maxHeight: "100px", overflow: "auto" }}
                    >
                      {response?.reason}
                    </p>
                  </div>
                </div>
              )}

              {response?.kit_status === "Send" && response?.file_path && (
                <div className="col-md-4 col-sm-6 col-12">
                  <div className="report_inn">
                    <p className="mb-1 form-label">Lab Report</p>
                    <p className="txt">
                      <Link
                        target="_blank"
                        className="txt"
                        to={`${config.apiUrl}/${response?.file_path}`}
                      >
                        Download Lab Report ({response?.file_path})
                      </Link>
                    </p>
                  </div>
                </div>
              )}

              {/* Created Date */}
              {response?.kit_registration_created_at &&
                response?.patient_first_name && (
                  <div className="col-md-4 col-sm-6 col-12">
                    <div className="report_inn">
                      <p className="mb-1 form-label">Kit Register On</p>
                      <p className="txt">
                        {moment(response?.kit_registration_created_at).format(
                          "YYYY-MM-DD"
                        )}
                      </p>
                    </div>
                  </div>
                )}
            </div>
          </div>
          <div className="d-flex justify-content-end w-100 btn_wrap mt-3">
            <Button className="outlined-btn" onClick={() => onHide()}>
              Cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default OrderDetailsModal;

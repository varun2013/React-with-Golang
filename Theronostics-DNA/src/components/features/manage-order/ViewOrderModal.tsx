import React from "react";
import { Link } from "react-router-dom";
import { Button, Badge } from "react-bootstrap";
import moment from "moment";
import { getBadgeVariant } from "../../../pages/manage_order/orderEvents";
import config from "../../../config/config";

interface ViewOrderModalProps {
  selectedData?: any; // Consider creating a more specific interface
  onClose: () => void;
}

const ViewOrderModal: React.FC<ViewOrderModalProps> = ({
  selectedData,
  onClose,
}) => {
  if (!selectedData) return null;

  return (
    <div>
      <div className="px-0 report_detail container">
        <div className="row row-gap-3">
          {/* Order Details */}

          <div className="col-md-6">
            <div className="report_inn">
              <p className="mb-1 form-label">Order ID</p>
              <p className="txt">{selectedData?.order_number}</p>
            </div>
          </div>

          <div className="col-md-6">
            <div className="report_inn">
              <p className="mb-1 form-label">Order Status</p>
              <p className="txt">
                <Badge bg={getBadgeVariant(selectedData?.order_status)}>
                  {selectedData?.order_status}
                </Badge>
              </p>
            </div>
          </div>

          <div className="col-md-6">
            <div className="report_inn">
              <p className="mb-1 form-label">Order Date</p>
              <p className="txt">
                {moment(selectedData?.created_at).format("YYYY-MM-DD")}
              </p>
            </div>
          </div>

          <div className="col-md-6">
            <div className="report_inn">
              <p className="mb-1 form-label">Quantity</p>
              <p className="txt">{selectedData?.quantity}</p>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="col-md-6">
            <div className="report_inn">
              <p className="mb-1 form-label">Transaction ID</p>
              <p className="txt">
                {selectedData?.payments[0]?.transaction_id || "N/A"}
              </p>
            </div>
          </div>

          <div className="col-md-6">
            <div className="report_inn">
              <p className="mb-1 form-label">Payment Status</p>
              <p className="txt">
                {selectedData?.payment_status && (
                  <Badge bg={getBadgeVariant(selectedData.payment_status)}>
                    {selectedData.payment_status}
                  </Badge>
                )}
              </p>
            </div>
          </div>


          {selectedData?.barcode_numbers && (
            <div className="col-md-6">
              <div className="report_inn">
                <p className="mb-1 form-label">Barcode(s) Assigned To Kit(s)</p>

                <div
                  className="txt"
                  style={{
                    maxHeight: "100px",
                    overflow: "auto",
                    lineHeight: "1.8",
                  }}
                >
                  {selectedData?.barcode_numbers
                    .split(",")
                    .map((b: string, index: number) => (
                      <div key={index} style={{ marginBottom: "8px" }}>
                        <span>{index + 1}. </span>
                        <span>{b}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
          {/* Invoice Download */}
          {selectedData?.payment_status === "Completed" && (
            <div className="col-md-6">
              <div className="report_inn">
                <p className="mb-1 form-label">Invoice</p>
                <Link
                  target="_blank"
                  className="txt"
                  to={`${config.apiUrl}/${selectedData?.payments[0]?.invoices[0]?.invoice_link}`}
                >
                  Download Invoice (
                  {selectedData?.payments[0]?.invoices[0]?.invoice_id})
                </Link>
              </div>
            </div>
          )}
          {selectedData?.tracking_id && (
            <div className="col-md-6">
              <div className="report_inn">
                <p className="mb-1 form-label">Tracking ID</p>
                <p className="txt">{selectedData?.tracking_id || "N/A"}</p>
              </div>
            </div>
          )}

        </div>

        <div className="row row-gap-3 mt-3">
          {/* Customer Details */}
          <div className="col-md-6">
            <div className="report_inn">
              <p className="mb-1 form-label">Full Name</p>
              <p className="txt">
                {`${selectedData?.customer?.first_name} ${selectedData?.customer?.last_name}`}
              </p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="report_inn">
              <p className="mb-1 form-label">Contact Email</p>
              <p className="txt">{selectedData?.customer?.email}</p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="report_inn">
              <p className="mb-1 form-label">Current Address</p>
              <p className="txt">
                {" "}
                {selectedData?.customer?.street_address},
                {selectedData?.customer?.town_city},
                {selectedData?.customer?.region},
                {selectedData?.customer?.country},
                {selectedData?.customer?.postcode}
              </p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="report_inn">
              <p className="mb-1 form-label">Shipping Address</p>
              <p className="txt">
                {" "}
                {selectedData?.customer?.shipping_address},
                {selectedData?.customer?.shipping_town_city},
                {selectedData?.customer?.shipping_region},
                {selectedData?.customer?.shipping_country},
                {selectedData?.customer?.shipping_postcode}
              </p>
            </div>
          </div>
          {selectedData?.customer?.clinic_id && (
            <div className="col-md-6">
              <div className="report_inn">
                <p className="mb-1 form-label">Clinic ID</p>
                <p className="txt">{selectedData?.customer?.clinic_id}</p>
              </div>
            </div>
          )}
        </div>
        <div className="row row-gap-3 mt-3">
          {/* Product Details */}
          <div className="col-md-6">
            <div className="report_inn">
              <p className="mb-1 form-label">Product Name</p>
              <p className="txt">{selectedData?.product_name}</p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="report_inn">
              <p className="mb-1 form-label">Product Description</p>
              <p
                className="txt"
                style={{ maxHeight: "100px", overflow: "auto" }}
              >
                {selectedData?.product_description}
              </p>
            </div>
          </div>

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
              <p className="mb-1 form-label">Total Price</p>
              <p className="txt">
                {`$${selectedData?.total_price.toFixed(2)}`}
              </p>
            </div>
          </div>

          {/* Payment and Date Details */}
        </div>
      </div>
      <div className="d-flex justify-content-between w-100 btn_wrap mt-3">
        <div className="btn_grp">
          <Button className="outlined-btn" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ViewOrderModal;

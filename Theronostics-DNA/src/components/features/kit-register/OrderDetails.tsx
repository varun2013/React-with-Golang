import React from "react";
import { OrderDetailsProps } from "../../../types/kit-register.type";
import CommonButton from "../../common/button/CommonButton";

export const OrderDetails: React.FC<OrderDetailsProps> = ({
  orderData,
  setPatientFormShow,
  patientFormShow,
}) => {
  return (
    <div className="card mt-4">
      <div className="card-header order-detail-header text-white">
        <h5 className="mb-0">Order Details</h5>
      </div>
      <div className="card-body">
        <div className="row row-gap-3">
          <div className="col-md-4">
            <img
              src={orderData.product_image}
              alt={orderData.product_name}
              className="img-fluid rounded mb-3"
            />
          </div>
          <div className="col-md-8">
            <h4 className="mb-3">{orderData.product_name}</h4>
            <div className="row row-gap-3">
              <div className="col-6">
                <p className="m-0 d-flex gap-1 flex-column flex-lg-row ">
                  <strong>Order Number:</strong> {orderData.order_number}
                </p>
              </div>
              <div className="col-6">
                <p className="m-0 d-flex gap-1 flex-column flex-lg-row">
                  <strong>Customer:</strong> {orderData.first_name}{" "}
                  {orderData.last_name}
                </p>
              </div>
              <div className="col-6">
                <p className="m-0 d-flex gap-1 flex-column flex-lg-row">
                  <strong>Email:</strong> {orderData.email}
                </p>
              </div>
              <div className="col-6">
                <p className="m-0">
                  <strong>Phone Number:</strong> {orderData.phone_number}
                </p>
              </div>
              {orderData.clinic_id && (
                <div className="col-6">
                  <p className="m-0 d-flex gap-1 flex-column flex-lg-row">
                    <strong>Clinic ID:</strong> {orderData.clinic_id}
                  </p>
                </div>
              )}
              <div className="col-6">
                <p className="m-0 d-flex gap-1 flex-column flex-lg-row">
                  <strong>Town/City:</strong> {orderData.town_city}
                </p>
              </div>
              <div className="col-6">
                <p className="m-0 d-flex gap-1 flex-column flex-lg-row">
                  <strong>Region:</strong> {orderData.region}
                </p>
              </div>
              <div className="col-6">
                <p className="m-0 d-flex gap-1 flex-column flex-lg-row">
                  <strong>Country:</strong> {orderData.country}
                </p>
              </div>
              <div className="col-6">
                <p className="m-0 d-flex gap-1 flex-column flex-lg-row">
                  <strong>Postcode:</strong> {orderData.postcode}
                </p>
              </div>
              {/* <div className="col-6">
                <p className="m-0">
                  <strong>Product Price:</strong> $
                  {orderData.product_price.toFixed(2)}
                </p>
              </div>
              <div className="col-6">
                <p className="m-0">
                  <strong>GST:</strong> $
                  {orderData.product_gst_price.toFixed(2)}
                </p>
              </div>
              <div className="col-6">
                <p className="m-0">
                  <strong>Discount %:</strong> $
                  {orderData.product_discount.toFixed(2)}
                </p>
              </div>
              <div className="col-6">
                <p className="m-0">
                  <strong>Quantity:</strong> {orderData.quantity}
                </p>
              </div> */}
              <div className="col-6">
                <p className="m-0 d-flex gap-1 flex-column flex-lg-row">
                  <strong>Street Address:</strong> {orderData.street_address}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-end m-3">
        <CommonButton
          type="button"
          className="filled-btn"
          text={
            patientFormShow
              ? "Hide Patient Form"
              : "Click here to fill out the patient form."
          }
          onClick={() => setPatientFormShow(!patientFormShow)}
        />
      </div>
    </div>
  );
};

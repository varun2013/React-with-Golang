import React from "react";
import CommonForm from "../../common/form/CommonForm";
import { Form } from "react-bootstrap";

const ShippingForm: React.FC<any> = ({
  formValues,
  setFormValues,
  errFormValues,
  setErrFormValues,
  onSubmit,
  shippingFields,
  isShippingAddressSame,
  setIsShippingAddressSame,
}) => {
  // Handle checkbox toggle
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setIsShippingAddressSame(checked);
    if (checked) {
      // If checked, copy the current address to the shipping address
      setFormValues((prev: any) => ({
        ...prev,
        shipping_country: prev.country,
        shipping_address: prev.street_address,
        shipping_town_city: prev.town_city,
        shipping_region: prev.region,
        shipping_postcode: prev.postcode,
      }));
    } else {
      // If unchecked, clear the shipping address
      setFormValues((prev: any) => ({
        ...prev,
        shipping_country: "",
        shipping_address: "",
        shipping_town_city: "",
        shipping_region: "",
        shipping_postcode: "",
      }));
    }
  };

  return (
    <>
      <div className="billingg-form">
        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            id="sameAddress"
            label="Shipping address is the same as your current address"
            onChange={handleCheckboxChange}
            value={isShippingAddressSame}
          />
        </Form.Group>

        <CommonForm
          state={formValues}
          setState={setFormValues}
          errorState={errFormValues}
          setErrorState={setErrFormValues}
          fields={shippingFields}
          onSubmit={onSubmit}
        />
      </div>
    </>
  );
};

export default ShippingForm;

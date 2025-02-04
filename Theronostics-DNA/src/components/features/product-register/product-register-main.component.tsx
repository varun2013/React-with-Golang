import React, { useEffect, useState } from "react";
import { ProductBreadcrumb } from "./ProductBreadcrumb";
import { MAIN_SECTION_APP_URL } from "../../../constants/appUrl";
import { ProductInfo } from "./ProductInfo";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";
import {
  BillingDetails,
  OrderSummary,
} from "../../../types/product-register.type";
import BillingForm from "./BillingForm";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import emailImage from "../../../assets/images/email.svg";
import { OrderSummaryTable } from "./OrderSummaryTable";
import { CheckoutButton } from "./CheckoutButton";
import { validateForm } from "../../../utils/validation/validationUtils";
import { orderPaymentData, setLoader } from "../../../redux/action";
import { SuccessMessageInterface } from "../../../types/redux.type";
import Loader from "../../common/loader/Loader";
import ShippingForm from "./ShippingForm";

const ProductRegisterForm = () => {
  const dispatch = useAppDispatch();
  const {
    productName,
    productDescription,
    productImage,
    productPrice,
    productGstPrice,
  } = useAppSelector((state: RootState) => state.manageProduct);
  const loading = useAppSelector((state: RootState) => state.loader.loader);

  const [formValues, setFormValues] = useState<any>({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    country: "",
    street_address: "",
    town_city: "",
    region: "",
    postcode: "",
    quantity: "",
    type: "customer",
    shipping_country: "",
    shipping_address: "",
    shipping_town_city: "",
    shipping_region: "",
    shipping_postcode: "",
    clinic_id: "",
  });

  const [errFormValues, setErrFormValues] = useState<
    Record<keyof BillingDetails, string>
  >({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    country: "",
    street_address: "",
    town_city: "",
    region: "",
    postcode: "",
    quantity: "",
    type: "",
    shipping_country: "",
    shipping_address: "",
    shipping_town_city: "",
    shipping_region: "",
    shipping_postcode: "",
    clinic_id: "",
  });
  const [isPageDisabled, setIsDisabledPage] = useState(false);
  const [isShippingAddressSame, setIsShippingAddressSame] = useState(false);

  const clinicField = [
    {
      name: "quantity",
      label: "Quantity (Number of Kits)",
      type: "text",
      placeholder: "Enter quantity",
      required: true,
      maxLength: 5,
      validationRules: {
        type: "clinicOrderQuantity",
        maxLength: 5,
        required: true,
      },
      colProps: { xs: 12, md: 6 },
    },
    {
      name: "clinic_id",
      label: "Clinic ID",
      type: "text",
      required: formValues.type === "clinic",
      placeholder: "Enter your clinic ID",
      maxLength: 100,
      validationRules: {
        type: "textarea",
        maxLength: 100,
        minLength: 5,
        required: formValues.type === "clinic",
      },
      colProps: { xs: 12, md: 6 },
    },
  ];

  const billingFields = [
    {
      name: "type",
      label: "Customer Type",
      type: "radio",
      placeholder: "Choose type",
      required: true,
      defaultValue: "customer",
      options: [
        { label: "Self", value: "customer" },
        { label: "Clinic", value: "clinic" },
      ],
      colProps: { xs: 12, md: 12 },
    },
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
      placeholder: "Enter your email",
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
    {
      name: "phone_number",
      label: "Phone Number",
      type: "text",
      placeholder: "Enter your phone number",
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
      name: "country",
      label: "Country",
      type: "text",
      placeholder: "Enter your country",
      required: true,
      maxLength: 50,
      minLength: 3,
      validationRules: {
        type: "nameWithSpace",
        maxLength: 50,
        minLength: 3,
        required: true,
      },
      colProps: { xs: 12, md: 6 },
    },
    {
      name: "town_city",
      label: "Town/City",
      type: "text",
      placeholder: "Enter your town/city",
      required: true,
      maxLength: 100,
      minLength: 5,
      validationRules: {
        type: "nameWithSpace",
        maxLength: 100,
        minLength: 5,
        required: true,
      },
      colProps: { xs: 12, md: 6 },
    },
    {
      name: "region",
      label: "Region",
      type: "text",
      placeholder: "Enter your region",
      required: true,
      maxLength: 100,
      minLength: 5,
      validationRules: {
        type: "nameWithSpace",
        maxLength: 100,
        minLength: 5,
        required: true,
      },
      colProps: { xs: 12, md: 6 },
    },
    {
      name: "postcode",
      label: "Postcode",
      type: "text",
      placeholder: "Enter your postcode",
      required: true,
      maxLength: 20,
      minLength: 3,
      validationRules: {
        type: "alphanumericWithSpace",
        maxLength: 20,
        minLength: 3,
        required: true,
      },
      colProps: { xs: 12, md: 6 },
    },
    {
      name: "street_address",
      label: "Street Address",
      type: "textarea",
      required: true,
      placeholder: "Enter your street address",
      maxLength: 255,
      validationRules: {
        type: "textarea",
        maxLength: 255,
        minLength: 5,
        required: true,
      },
      colProps: { xs: 12, md: 6 },
    },
  ];

  const shippingFields = [
    {
      name: "shipping_country",
      label: "Country",
      type: "text",
      placeholder: "Enter your country",
      required: true,
      maxLength: 50,
      minLength: 3,
      validationRules: {
        type: "nameWithSpace",
        maxLength: 50,
        minLength: 3,
        required: true,
      },
      colProps: { xs: 12, md: 6 },
    },
    {
      name: "shipping_town_city",
      label: "Town/City",
      type: "text",
      placeholder: "Enter your town/city",
      required: true,
      maxLength: 100,
      minLength: 5,
      validationRules: {
        type: "nameWithSpace",
        maxLength: 100,
        minLength: 5,
        required: true,
      },
      colProps: { xs: 12, md: 6 },
    },
    {
      name: "shipping_region",
      label: "Region",
      type: "text",
      placeholder: "Enter your region",
      required: true,
      maxLength: 100,
      minLength: 5,
      validationRules: {
        type: "nameWithSpace",
        maxLength: 100,
        minLength: 5,
        required: true,
      },
      colProps: { xs: 12, md: 6 },
    },
    {
      name: "shipping_postcode",
      label: "Postcode",
      type: "text",
      placeholder: "Enter your postcode",
      required: true,
      maxLength: 20,
      minLength: 3,
      validationRules: {
        type: "alphanumericWithSpace",
        maxLength: 20,
        minLength: 3,
        required: true,
      },
      colProps: { xs: 12, md: 6 },
    },
    {
      name: "shipping_address",
      label: "Shipping Address",
      type: "textarea",
      required: true,
      placeholder: "Enter your shipping address",
      maxLength: 255,
      validationRules: {
        type: "textarea",
        maxLength: 255,
        minLength: 5,
        required: true,
      },
      colProps: { xs: 12, md: 6 },
    },
  ];

  const isFormValid = () => {
    const validateFields = (fields: any[]) =>
      fields.some(
        (field) =>
          field.required && !formValues[field.name as keyof BillingDetails]
      );

    const hasErrors = Object.values(errFormValues).some(
      (error) => !!error && error.trim().length > 0
    );

    // Billing fields validation
    const isBillingInvalid = validateFields(billingFields);

    // Clinic fields validation if type is clinic
    const isClinicInvalid =
      formValues.type === "clinic" && validateFields(clinicField);

    // Shipping fields validation if shipping address is not the same
    const isShippingInvalid = validateFields(shippingFields);

    return !(
      isBillingInvalid ||
      isClinicInvalid ||
      isShippingInvalid ||
      hasErrors
    );
  };

  const handleSubmit = async () => {
    // Combine validation errors for all relevant fields
    const validationErrors: any = {
      ...validateForm(formValues, billingFields),
      ...(formValues.type === "clinic"
        ? validateForm(formValues, clinicField)
        : {}),
      ...validateForm(formValues, shippingFields),
    };

    if (Object.keys(validationErrors).length > 0) {
      setErrFormValues((prevErrors) => ({
        ...prevErrors,
        ...validationErrors,
      }));
      return;
    }

    const orderSummary: OrderSummary = {
      ...formValues,
      product_name: productName,
      product_description: productDescription,
      product_image: productImage,
      product_price: productPrice,
      product_gst_price: productGstPrice,
      quantity: formValues.quantity ? Number(formValues.quantity) : 0,
    };

    try {
      await dispatch(setLoader(true));
      await dispatch(
        orderPaymentData(
          orderSummary,
          async (response: SuccessMessageInterface) => {
            if (response.success) {
              setIsDisabledPage(true);
              window.location.href = response.data.payment_url;
            }
          }
        )
      );
    } catch (err) {
      console.error("Error creating user:", err);
    } finally {
      await dispatch(setLoader(false));
    }
  };

  // Sync shipping address with billing address if `isShippingAddressSame` is true
  useEffect(() => {
    if (isShippingAddressSame) {
      setFormValues((prev: any) => ({
        ...prev,
        shipping_country: prev.country,
        shipping_address: prev.street_address,
        shipping_town_city: prev.town_city,
        shipping_region: prev.region,
        shipping_postcode: prev.postcode,
      }));
      setErrFormValues({
        ...errFormValues,
        shipping_country: "",
        shipping_address: "",
        shipping_town_city: "",
        shipping_region: "",
        shipping_postcode: "",
      });
    }
    // eslint-disable-next-line
  }, [
    isShippingAddressSame,
    formValues.country,
    formValues.street_address,
    formValues.town_city,
    formValues.region,
    formValues.postcode,
  ]);

  useEffect(() => {
    setFormValues({
      ...formValues,
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      country: "",
      street_address: "",
      town_city: "",
      region: "",
      postcode: "",
      quantity: formValues.type === "customer" ? "1" : "",
      shipping_country: "",
      shipping_address: "",
      shipping_town_city: "",
      shipping_region: "",
      shipping_postcode: "",
      clinic_id: "",
    });
    setErrFormValues({
      ...errFormValues,
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      country: "",
      street_address: "",
      town_city: "",
      region: "",
      postcode: "",
      quantity: "",
      type: "",
      shipping_country: "",
      shipping_address: "",
      shipping_town_city: "",
      shipping_region: "",
      shipping_postcode: "",
      clinic_id: "",
    });
    // eslint-disable-next-line
  }, [formValues.type]);

  return (
    <>
      <ProductBreadcrumb backUrl={MAIN_SECTION_APP_URL} />
      <ProductInfo
        name={productName}
        description={productDescription}
        price={productPrice}
        image={productImage}
        gstPrice={productGstPrice}
      />

      <div className="container mt-5 mb-5">
        <div className="row row-gap-3">
          <div className="col-lg-12">
            <p className="product-detail-heading">Billing Details</p>
            <hr className="black-line" />
            <BillingForm
              formValues={formValues}
              setFormValues={setFormValues}
              errFormValues={errFormValues}
              setErrFormValues={setErrFormValues}
              onSubmit={handleSubmit}
              billingFields={billingFields}
              clinicField={clinicField}
            />
          </div>
        </div>
      </div>

      <div className="container mt-5 mb-5">
        <div className="row row-gap-3">
          <div className="col-lg-12">
            <p className="product-detail-heading">Shipping Address</p>
            <hr className="black-line" />

            <ShippingForm
              formValues={formValues}
              setFormValues={setFormValues}
              errFormValues={errFormValues}
              setErrFormValues={setErrFormValues}
              onSubmit={handleSubmit}
              shippingFields={shippingFields}
              isShippingAddressSame={isShippingAddressSame}
              setIsShippingAddressSame={setIsShippingAddressSame}
            />
          </div>
        </div>
      </div>

      <section className="paypal-div">
        <div className="container">
          <div className="row row-gap-3">
            <div className="col-lg-12">
              <p className="product-detail-heading">Your order</p>
              <hr className="black-line" />
            </div>
            <div className="col-lg-12">
              <div className="bg-gray" />
              <OrderSummaryTable
                productName={productName}
                productPrice={productPrice}
                productGstPrice={productGstPrice}
                formValues={formValues}
              />
              <CheckoutButton
                loading={loading}
                disabled={!isFormValid()}
                onCheckout={handleSubmit}
              />
            </div>
          </div>
        </div>
      </section>
      {isPageDisabled && <Loader />}
    </>
  );
};

export default ProductRegisterForm;

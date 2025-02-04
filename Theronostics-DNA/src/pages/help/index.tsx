import React from "react";
import CommonButton from "../../components/common/button/CommonButton";
import { KIT_REGISTER_APP_URL } from "../../constants/appUrl";
import help1ImageURL from "../../assets/images/help1.jpg";
import help2ImageURL from "../../assets/images/help2.jpg";
import help3ImageURL from "../../assets/images/help3.jpg";
import help4ImageURL from "../../assets/images/help4.jpg";
import help5ImageURL from "../../assets/images/help5.jpg";
import help6ImageURL from "../../assets/images/help6.jpg";
import help7ImageURL from "../../assets/images/help7.jpg";
import help8ImageURL from "../../assets/images/help8.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const HelpPage: React.FC = () => {
  const steps = [
    {
      title: "Start Your Kit Registration",
      description:
        "Begin your journey by navigating to the Kit Registration page. Our user-friendly interface will guide you through the process step by step.",
      action: () => window.open(KIT_REGISTER_APP_URL, "_blank"),
      image: help1ImageURL,
    },
    {
      title: "Select QRCode/Barcode Entry Method",
      description:
        "Choose between manual QRCode/Barcode entry or using our integrated QRCode/Barcode scanner. This flexibility ensures a smooth experience tailored to your preference.",
      image: help2ImageURL,
    },
    {
      title: "Manual QRCode/Barcode Input",
      description:
        "If you choose manual entry, carefully input the 30-character barcode. Accuracy is key to ensuring seamless processing of your kit registration.",
      image: help3ImageURL,
    },
    {
      title: "QRCode/Barcode Scanning",
      description:
        "Opt for scanning? Our intuitive scanner will help you capture the QRCode/Barcode quickly and accurately. Position the QRCode/Barcode clearly within the scanning frame.",
      image: help4ImageURL,
    },
    {
      title: "QRCode/Barcode Reference",
      description:
        "To help you identify the correct QRCode/Barcode, here's an example of the standard 30-character QRCode/Barcode format we require.",
      image: help5ImageURL,
    },
    {
      title: "Verify Your QRCode/Barcode",
      description:
        "After entering or scanning, click the 'Verify' button. Our system will instantly validate your QRCode/Barcode and retrieve the associated order details.",
      image: help6ImageURL,
    },
    {
      title: "Patient Details Form",
      description:
        "Upon successful verification, you'll be prompted to complete the patient details form. Please provide accurate and comprehensive information.",
      image: help7ImageURL,
    },
    {
      title: "Confirmation",
      image: help8ImageURL,
      description:
        "After submitting the form, you'll receive a confirmation email. This email serves as a record of your kit registration and provides important next steps.",
    },
  ];

  const renderStepContent = (step: (typeof steps)[number], index: number) => (
    <div key={index} className="col-lg-4 col-md-4">
      <div className="help-box">
        <div className="image-box">
          {step.image && (
            <img
              src={step.image}
              alt={`Step ${index + 1}`}
              className="w-100 h-100"
            />
          )}
        </div>
        <div className="content-box items-center mt-4">
          <span>0{index + 1}</span>
          <h5 className="font-semibold d-flex items-center gap-3 justify-content-between">
            {step.title}
            {step.action && (
              <div className="proceed-button">
                <CommonButton
                  type="button"
                  text="Proceed"
                  className="w-full ms-auto p-0"
                  onClick={step.action}
                />
                <FontAwesomeIcon icon={faArrowRight} />
              </div>
            )}
          </h5>

          <p className="text-gray-600 mb-4">{step.description}</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <section>
        <div className="">
          <div className="heading-bg">
            <h1> Kit Registration Guide</h1>
          </div>
        </div>
      </section>
      <div className="container mt-4 mb-4">
        <div className="row row-gap-3">{steps.map(renderStepContent)}</div>
      </div>
    </>
  );
};

export default HelpPage;

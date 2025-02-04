import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks";
import { paymentSuccessData, setLoader } from "../../redux/action";
import { useEffect, useState } from "react";
import crossImage from "../../assets/images/cancel.svg";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { MAIN_SECTION_APP_URL } from "../../constants/appUrl";
import { SuccessMessageInterface } from "../../types/redux.type";
const PaymentStatus = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const loading = useSelector((state: RootState) => state.loader.loader);
  const [isPaymentSuccess, setIsSuccessPayment] = useState(false);
  let apiHitted = false;
  const verifyPayment = async () => {
    // Get URL parameters
    const paymentId = searchParams.get("payment_id");
    const action = searchParams.get("action");
    const token = searchParams.get("token");
    const payerId = searchParams.get("PayerID");

    // Check if all required parameters exist
    if (!paymentId || !action) {
      navigate(MAIN_SECTION_APP_URL);
      return;
    }

    // Prepare data for API
    const paymentData = {
      payment_id: paymentId,
      action: action,
      token: token,
      payer_id: payerId,
    };

    try {
      await dispatch(setLoader(true));
      await dispatch(
        paymentSuccessData(
          paymentData,
          async (response: SuccessMessageInterface) => {
            setIsSuccessPayment(
              response.data.status === "completed" ? true : false
            );
            // Remove URL parameters after successful verification
          }
        )
      );
    } catch (err) {
      setIsSuccessPayment(false);
    } finally {
      setSearchParams({});
      await dispatch(setLoader(false));
    }
  };

  useEffect(() => {
    if (!apiHitted) {
      verifyPayment();
      // eslint-disable-next-line
      apiHitted = true;
    }
    // eslint-disable-next-line
  }, []);
  return (
    <section style={{minHeight : loading ? "500px" : ""}}>
      {!loading && (
        <div className="container">
          <div className="row row-gap-3">
            <div className="col-lg-5 col-md-8 mx-auto">
              <div
                className={`order-confirmed-box ${
                  isPaymentSuccess ? "" : " order-canceled-box"
                }`}
              >
                <div
                  className={`tick-icon ${
                    isPaymentSuccess ? "" : "cancel-icon"
                  }`}
                >
                  {isPaymentSuccess ? (
                    <svg
                      width="52"
                      height="40"
                      viewBox="0 0 52 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M51.1743 4.14173L22.514 39.977L0 21.2131L4.24793 16.1156L21.5582 30.5386L45.9971 0L51.1743 4.14173Z"
                        fill="white"
                      />
                    </svg>
                  ) : (
                    <img src={crossImage} alt="cancel"></img>
                  )}
                </div>
                {isPaymentSuccess ? (
                  <>
                    {" "}
                    <h3>Your payment is done.</h3>
                    <p>
                      Please check your email to get the invoices and order
                      confirmation.
                    </p>
                  </>
                ) : (
                  <>
                    {" "}
                    <h3>Your payment is not done.</h3>
                    <p>
                      There is some issue occured while perform the payment.
                    </p>
                  </>
                )}

                <Link to={MAIN_SECTION_APP_URL} className="filled-btn">
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PaymentStatus;

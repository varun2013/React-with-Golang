import React from "react";
import { useAppDispatch } from "../../redux/hooks";
import { Link, useNavigate } from "react-router-dom";
import { encryptAndDispatchProductData, setLoader } from "../../redux/action";
import { SuccessMessageInterface } from "../../types/redux.type";
import { PRODUCT_DETAILS_APP_URL } from "../../constants/appUrl";
import product1 from "../../assets/images/product-01.jpg";
import { relatedProduct } from "../../constants/relatedProduct";

const ProductDetail = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleEncryptProduct = async () => {
    try {
      await dispatch(setLoader(true));
      const payLoad = {
        image:
          "https://www.theranostics.co.nz/wp-content/uploads/2022/03/plavix-300x300.jpg",
        description:
          "Most drugs are only effective in 20-30% of the people who take them. This is because everyone is different and medications can be absorbed and metabolised in varying ways. In some circumstances medication can even be harmful due to adverse reactions. People sometimes forget to take medication and this may be due to memory or distrust of their pills.",
        name: "Personalise your medication",
        price: 860.0,
        gst_price: 36.21,
      };
      await dispatch(
        encryptAndDispatchProductData(
          payLoad,
          async (response: SuccessMessageInterface) => {
            if (response?.success) {
              await dispatch(setLoader(true));
              navigate(`${PRODUCT_DETAILS_APP_URL}`, {
                state: { data: response.data },
                replace: true,
              });
            }
          }
        )
      );
    } catch (err) {
      console.error("Error while fetching website data:", err);
    } finally {
      await dispatch(setLoader(false));
    }
  };

  return (
    <div>
      <section className="product-single-main">
        <div className="container">
          <div className="row row-gap-3">
            <div className="col-lg-5">
              <div className="product-img">
                <img src={product1} className="img-fluid" alt="" />
              </div>
              <div className="d-flex justify-content-between mt-3 px-2">
                <div className="product-img-variant">
                  <img src={product1} className="img-fluid" alt="" />
                </div>
                <div className="product-img-variant">
                  <img src={product1} className="img-fluid" alt="" />
                </div>
                <div className="product-img-variant">
                  <img src={product1} className="img-fluid" alt="" />
                </div>
                <div className="product-img-variant">
                  <img src={product1} className="img-fluid" alt="" />
                </div>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="product-description">
                <h2 className="mt-4 mt-lg-0">Personalise your medication</h2>
                <p>
                  Category: <Link to="#">Personalise your medication</Link>
                </p>
                <p>
                  Most drugs are only effective in 20-30% of the people who take
                  them. This is because everyone is different and medications
                  can be absorbed and metabolised in varying ways. In some
                  circumstances medication can even be harmful due to adverse
                  reactions. People sometimes forget to take medication and this
                  may be due to memory or distrust of their pills.
                </p>
                <p>
                  Knowing your medication is working and not likely to harm you
                  is likely to help people understand their medicines and
                  themselves better. These tests will tell you whether your
                  medicines are working, what dose you should be taking and
                  whether there is a risk of side effects occurring.
                </p>
                <h3>$600.72</h3>
                <div className="d-flex gap-3">
                  <button
                    className="filled-btn"
                    type="button"
                    onClick={handleEncryptProduct}
                  >
                    Buy now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="related-products-heading">
        <div className="container">
          <div className="row row-gap-3">
            <h3>Related Products</h3>
          </div>
        </div>
        <div className="related-prod-list">
          <div className="container">
            <div className="row row-gap-3">
              {relatedProduct.map((product, index) => (
                <div className="col-lg-3 col-md-6" key={index}>
                  <div className="cover-related-prod">
                    <div className="related-prod">
                      <img src={product?.image} alt="" className="img-fluid" />
                    </div>
                    <p>{product.title}</p>
                    <h4>{product.priceInUSD}</h4>
                    <button type="button" className="filled-btn">
                      Buy now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;

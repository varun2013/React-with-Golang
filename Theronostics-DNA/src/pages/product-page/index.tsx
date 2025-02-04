import { Link } from "react-router-dom";
import { productMenu } from "../../constants/productUrls";
import { SINGLE_PRODUCT_APP_URL } from "../../constants/appUrl";

const Product = () => {
  return (
    <div>
      <section>
        <div className="">
          <div className="heading-bg">
            <h1>Product Catalog</h1>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="row row-gap-3">
            {productMenu.map((product, index) => (
              <div className="col-lg-3 col-md-6" key={index}>
                <div className="product">
                  <Link to={SINGLE_PRODUCT_APP_URL}>
                    <div className="product-box">
                      <img src={product.image} alt="" className="img-fluid" />
                    </div>
                    <div className="product-caption">
                      <h4>{product.title}</h4>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Product;

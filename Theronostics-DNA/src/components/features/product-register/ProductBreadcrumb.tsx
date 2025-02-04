// components/product/ProductBreadcrumb.tsx
import { Link } from "react-router-dom";
import Back from "../../../assets/images/back-arrow.svg"

interface ProductBreadcrumbProps {
  backUrl: string;
}

export const ProductBreadcrumb: React.FC<ProductBreadcrumbProps> = ({ backUrl }) => {
  return (
    <section className="breadcrum">
      <div className="container">
        <div className="row row-gap-3">
          <div className="col-lg-12">
            <Link to={backUrl} className="breadcrum-btn">
              <span>
                <img src={Back} alt="" className="img-fluid me-1" />
              </span>
              Back to Catalog
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
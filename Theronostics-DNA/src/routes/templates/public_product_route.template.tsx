import React from "react";
import { ProductPublicTemplateProps } from "../../types/route.type";
import { useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import ProductHeader from "../../components/layouts/public_product/productHeader.component";
import ProductFooter from "../../components/layouts/public_product/productFooter.component";
import Loader from "../../components/common/loader/Loader";

const ProductPublicTemplate: React.FC<ProductPublicTemplateProps> = ({
  children,
}) => {
  const loading = useAppSelector((state: RootState) => state.loader.loader);

  return (
    <>
      {" "}
      <div className="content-main">
        <div className="body-content">
          <ProductHeader />
          {children}
        </div>
        <div>
          <ProductFooter />
          {/* Loader */}
          {loading && <Loader />}
        </div>
      </div>
    </>
  );
};

export default ProductPublicTemplate;

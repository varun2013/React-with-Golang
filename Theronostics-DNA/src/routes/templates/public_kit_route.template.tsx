import React from "react";
import { ProductPublicTemplateProps } from "../../types/route.type";
import { useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import Loader from "../../components/common/loader/Loader";
import KitRegisterHeader from "../../components/layouts/kit_register/KitRegisterHeader.component";
import KitRegisterFooter from "../../components/layouts/kit_register/KitRegisterFooter.component";

const KitPublicTemplate: React.FC<ProductPublicTemplateProps> = ({
  children,
}) => {
  const loading = useAppSelector((state: RootState) => state.loader.loader);

  return (
    <>
      {" "}
      <div className="content-main">
        <div className="body-content">
          <KitRegisterHeader />
          {children}
        </div>
        <div>
          <KitRegisterFooter />
          {/* Loader */}
          {loading && <Loader />}
        </div>
      </div>
    </>
  );
};

export default KitPublicTemplate;

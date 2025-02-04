import { useEffect } from "react";
import { useAppDispatch } from "../../redux/hooks";
import { useLocation, useNavigate } from "react-router-dom";
import {
  fetchQuantityDiscountList,
  setLoader,
  verifyAndDispatchProductData,
} from "../../redux/action";
import { SuccessMessageInterface } from "../../types/redux.type";
import { MAIN_SECTION_APP_URL } from "../../constants/appUrl";
import ProductRegisterForm from "../../components/features/product-register/product-register-main.component";

const ProductRegister = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const location = useLocation();
  const decryptData = location?.state?.data;
  const verifyProductDetails = async (values: any) => {
    try {
      await dispatch(setLoader(true));
      await dispatch(
        verifyAndDispatchProductData(
          { data: values },
          async (response: SuccessMessageInterface) => {
            if (response.success) {
              await dispatch(setLoader(false));
              await dispatch(fetchQuantityDiscountList());
            } else {
              navigate(MAIN_SECTION_APP_URL);
            }
          }
        )
      );
    } catch (err) {
      console.error("Error fetching website data:", err);
    } finally {
      await dispatch(setLoader(false));
    }
  };
  useEffect(() => {
    if (decryptData) {
      verifyProductDetails(decryptData);
    } else {
      navigate(MAIN_SECTION_APP_URL);
    }
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <ProductRegisterForm />
    </>
  );
};

export default ProductRegister;

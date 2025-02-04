import { validateForm } from "../../../utils/validation/validationUtils";
import { loginUser, setLoader } from "../../../redux/action";
import { SuccessMessageInterface } from "../../../types/redux.type";
import { MANAGE_INVENTORY_APP_URL } from "../../../constants/appUrl";
import { LoginSubmitParams } from "../../../types/login.types";

export const handleLoginSubmit = async ({
  loginState,
  dispatch,
  navigate,
  setErrLoginState,
  fields,
}: LoginSubmitParams) => {
  // Validate form
  const validationErrors = validateForm(loginState, fields);

  if (Object.keys(validationErrors).length > 0) {
    setErrLoginState((prevErrors) => ({
      ...prevErrors,
      ...validationErrors,
    }));
    return;
  }

  try {
    await dispatch(setLoader(true));
    await dispatch(
      loginUser(loginState, async (response: SuccessMessageInterface) => {
        await dispatch(setLoader(false));
        if (response.success) {
          await dispatch(setLoader(true));
          navigate(MANAGE_INVENTORY_APP_URL);
        }
      })
    );
  } catch (err) {
    console.error("Error fetching website data:", err);
  } finally {
    await dispatch(setLoader(false));
  }
};

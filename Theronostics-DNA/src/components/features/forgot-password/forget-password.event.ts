import { LOGIN_APP_URL } from "../../../constants/appUrl";
import { forgetPassword, setLoader } from "../../../redux/action";
import { ForgotPasswordSubmitParams } from "../../../types/forgot-password.type";
import { SuccessMessageInterface } from "../../../types/redux.type";
import { validateForm } from "../../../utils/validation/validationUtils";

export const handleForgotPasswordSubmit = async ({
  formState,
  dispatch,
  navigate,
  setErrorState,
  fields,
}: ForgotPasswordSubmitParams) => {
  const validationErrors = validateForm(formState, fields);

  if (Object.keys(validationErrors).length > 0) {
    setErrorState((prevErrors) => ({ ...prevErrors, ...validationErrors }));
    return;
  }

  try {
    await dispatch(setLoader(true));
    await dispatch(
      forgetPassword(formState, async (response: SuccessMessageInterface) => {
        await dispatch(setLoader(false));
        if (response.success) {
          navigate(LOGIN_APP_URL);
        }
      })
    );
  } catch (err) {
    console.error("Error fetching website data:", err);
  } finally {
    await dispatch(setLoader(false));
  }
};

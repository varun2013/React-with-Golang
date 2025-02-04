import { LOGIN_APP_URL } from "../../../constants/appUrl";
import { resetPassword, setAuthUser, setLoader } from "../../../redux/action";
import { ResetPasswordSubmitParams } from "../../../types/manage-profile.type";
import { SuccessMessageInterface } from "../../../types/redux.type";
import { clearLocalStorageData } from "../../../utils/storage/localStorageUtils";
import { validateForm } from "../../../utils/validation/validationUtils";

export const handleResetPasswordSubmit = async ({
  formState,
  dispatch,
  navigate,
  setErrorState,
  fields,
}: ResetPasswordSubmitParams) => {
  const validationErrors = validateForm(formState, fields);

  if (Object.keys(validationErrors).length > 0) {
    setErrorState((prevErrors) => ({ ...prevErrors, ...validationErrors }));
    return;
  }

  try {
    await dispatch(setLoader(true));
    await dispatch(
      resetPassword(
        {
          old_password: formState.old_password,
          new_password: formState.new_password,
        },
        async (response: SuccessMessageInterface) => {
          await dispatch(setLoader(false));
          if (response.success) {
            await clearLocalStorageData("token");
            navigate(LOGIN_APP_URL);
            await dispatch(setAuthUser(null));
          }
        }
      )
    );
  } catch (err) {
    console.error("Error reset password:", err);
  } finally {
    await dispatch(setLoader(false));
  }
};

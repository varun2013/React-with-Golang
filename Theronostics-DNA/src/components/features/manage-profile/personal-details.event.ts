import { setLoader, updateUserDetails } from "../../../redux/action";
import { PersonalDetailsSubmitParams } from "../../../types/manage-profile.type";
import { validateForm } from "../../../utils/validation/validationUtils";

export const handleUpdateProfileSubmit = async ({
  formState,
  dispatch,
  setErrorState,
  setIsEditing,
  fields,
}: PersonalDetailsSubmitParams) => {
  const validationErrors = validateForm(formState, fields);

  if (Object.keys(validationErrors).length > 0) {
    setErrorState((prevErrors) => ({ ...prevErrors, ...validationErrors }));
    return;
  }

  try {
    await dispatch(setLoader(true));
    await dispatch(updateUserDetails(formState));
    setIsEditing(false);
  } catch (err) {
    console.error("Error updating user details:", err);
  } finally {
    await dispatch(setLoader(false));
  }
};

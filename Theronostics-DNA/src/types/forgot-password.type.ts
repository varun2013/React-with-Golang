import { NavigateFunction } from "react-router-dom";
import { AppDispatch } from "../redux/store";
import { InputField } from "./formInput.type";

export interface ForgotPasswordState {
  [key: string]: string;
  email: string;
}

export interface ForgotPasswordErrorState {
  [key: string]: string;
  email: string;
  general?: any;
}

export interface ForgotPasswordField {
  name: string;
  label: string;
  type: string;
  placeholder: string;
  required: boolean;
  image?: string;
  maxLength?: number;
  minLength?: number;
  validationRules: {
    type: string;
    maxLength?: number;
    minLength?: number;
    required: boolean;
  };
}

export interface ForgotPasswordSubmitParams {
  formState: ForgotPasswordState;
  dispatch: AppDispatch;
  navigate: NavigateFunction;
  setErrorState: React.Dispatch<React.SetStateAction<ForgotPasswordErrorState>>;
  fields: InputField[];
}

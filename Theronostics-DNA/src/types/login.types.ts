import { NavigateFunction } from "react-router-dom";
import { AppDispatch } from "../redux/store";
import { InputField } from "./formInput.type";

export interface LoginState {
  [key: string]: string;
  email: string;
  password: string;
}

export interface LoginErrorState {
  [key: string]: string;
  email: string;
  password: string;
  general?: any;
}

export interface LoginField {
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
  passwordTooltipShow?: boolean;
}

export interface LoginSubmitParams {
  loginState: LoginState;
  dispatch: AppDispatch;
  navigate: NavigateFunction;
  setErrLoginState: React.Dispatch<React.SetStateAction<LoginErrorState>>;
  fields: InputField[];
}

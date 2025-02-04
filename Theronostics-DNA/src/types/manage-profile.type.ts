import { NavigateFunction } from "react-router-dom";
import { AppDispatch } from "../redux/store";
import { InputField } from "./formInput.type";

export interface PersonalDetailsState {
  [key: string]: string;
  first_name: string;
  last_name: string;
  general?: any;
}

export interface PersonalDetailsErrorState {
  [key: string]: string;
  first_name: string;
  last_name: string;
  general?: any;
}

export interface PersonalDetailsField {
  name: string;
  label: string;
  type: string;
  placeholder: string;
  required: boolean;
  image?: string;
  favImage?: any;
  maxLength?: number;
  minLength?: number;
  validationRules: {
    type: string;
    maxLength?: number;
    minLength?: number;
    required: boolean;
  };
}

export interface PersonalDetailsSubmitParams {
  formState: PersonalDetailsState;
  dispatch: AppDispatch;
  setErrorState: React.Dispatch<
    React.SetStateAction<PersonalDetailsErrorState>
  >;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  fields: InputField[];
}

export interface ResetPasswordState {
  [key: string]: string;
  old_password: string;
  new_password: string;
  confirm_password: string;
}

export interface ResetPasswordErrorState {
  [key: string]: string;
  old_password: string;
  new_password: string;
  confirm_password: string;
  general?: any;
}

export interface ResetPasswordField {
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

export interface ResetPasswordSubmitParams {
  formState: ResetPasswordState;
  dispatch: AppDispatch;
  navigate: NavigateFunction;
  setErrorState: React.Dispatch<React.SetStateAction<ResetPasswordErrorState>>;
  fields: InputField[];
}

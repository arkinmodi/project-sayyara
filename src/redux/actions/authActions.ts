import { AuthDialogType } from "src/types/auth";
import AuthType from "../types/authTypes";

interface IAuthActionBase {
  type: AuthType;
}

export interface IAuthActionSetIsLoggedIn extends IAuthActionBase {
  payload: { isLoggedIn: boolean };
}

export interface IAuthActionCreateLogin extends IAuthActionBase {
  payload: { csrfToken: string; email: string; password: string };
}

export interface IAuthActionCreateCustomerSignUp extends IAuthActionBase {
  payload: {
    csrfToken: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    licensePlate: string;
    vin: string;
    vehicleMake: string;
    vehicleModel: string;
    vehicleYear: number;
  };
}

export interface IAuthActionCreateShopEmployeeSignUp extends IAuthActionBase {
  payload: {
    csrfToken: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    shopId: string;
  };
}

export interface IAuthActionCreateShopOwnerSignUp extends IAuthActionBase {
  payload: {
    csrfToken: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    shopAddress: string;
    shopCity: string;
    shopPostalCode: string;
    shopProvince: string;
    stopPhoneNumber: string;
  };
}

export interface IAuthActionSetIsAuthDialogOpen extends IAuthActionBase {
  payload: { isAuthPopoutOpen: boolean; authDialogType: AuthDialogType };
}

export type IAuthAction =
  | IAuthActionCreateLogin
  | IAuthActionCreateCustomerSignUp
  | IAuthActionCreateShopEmployeeSignUp
  | IAuthActionCreateShopOwnerSignUp
  | IAuthActionSetIsLoggedIn
  | IAuthActionSetIsAuthDialogOpen;

export const createLogin = (payload: IAuthActionCreateLogin["payload"]) => ({
  type: AuthType.CREATE_LOGIN,
  payload,
});

export const createCustomerSignUp = (
  payload: IAuthActionCreateCustomerSignUp["payload"]
) => ({
  type: AuthType.CREATE_CUSTOMER_SIGN_UP,
  payload,
});

export const createShopEmployeeSignUp = (
  payload: IAuthActionCreateShopEmployeeSignUp["payload"]
) => ({
  type: AuthType.CREATE_SHOP_EMPLOYEE_SIGN_UP,
  payload,
});

export const createShopOwnerSignup = (
  payload: IAuthActionCreateShopOwnerSignUp["payload"]
) => ({
  type: AuthType.CREATE_SHOP_OWNER_SIGN_UP,
  payload,
});

export const setIsAuthPopoutOpen = (
  payload: IAuthActionSetIsAuthDialogOpen["payload"]
) => ({
  type: AuthType.SET_IS_AUTH_DIALOG_OPEN,
  payload,
});

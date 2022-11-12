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

export interface IAuthActionCreateSignUp extends IAuthActionBase {
  payload: {
    callbackUrl: string | string[];
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    type: string;
  };
}

export type IAuthAction =
  | IAuthActionCreateLogin
  | IAuthActionCreateSignUp
  | IAuthActionSetIsLoggedIn;

export const createLogin = (payload: IAuthActionCreateSignUp["payload"]) => ({
  type: AuthType.CREATE_LOGIN,
  payload,
});

export const createSignUp = (payload: IAuthActionCreateSignUp["payload"]) => ({
  type: AuthType.CREATE_SIGN_UP,
  payload,
});

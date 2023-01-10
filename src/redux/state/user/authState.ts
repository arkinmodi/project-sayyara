import { AuthDialogType } from "src/types/auth";

export interface IAuthState {
  isLoggedIn: boolean;
  authDialogState: {
    isAuthDialogOpen: boolean;
    authDialogType: AuthDialogType;
  };
}

export const initialAuthState: IAuthState = {
  isLoggedIn: false,
  authDialogState: {
    isAuthDialogOpen: false,
    authDialogType: AuthDialogType.CUSTOMER,
  },
};

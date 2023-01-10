import { UserType } from "@prisma/client";
import { AuthDialogType } from "src/types/auth";

export interface IAuthState {
  isLoggedIn: boolean;
  userType: UserType | undefined;
  authDialogState: {
    isAuthDialogOpen: boolean;
    authDialogType: AuthDialogType;
  };
}

export const initialAuthState: IAuthState = {
  isLoggedIn: false,
  userType: undefined,
  authDialogState: {
    isAuthDialogOpen: false,
    authDialogType: AuthDialogType.CUSTOMER,
  },
};

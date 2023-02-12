import { UserType } from "@prisma/client";
import { AuthDialogType } from "src/types/auth";
import { IVehicle } from "src/types/vehicle";

export interface IAuthState {
  isLoggedIn: boolean;
  showInvalidLoginToast: boolean;
  session: {
    id: string | null;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    userType: UserType | null;
    shopId: string | null;
  };
  authDialogState: {
    isAuthDialogOpen: boolean;
    authDialogType: AuthDialogType;
  };
  vehicle: IVehicle | null;
}

export const initialAuthState: IAuthState = {
  isLoggedIn: false,
  showInvalidLoginToast: false,
  session: {
    id: null,
    email: null,
    firstName: null,
    lastName: null,
    userType: null,
    shopId: null,
  },
  authDialogState: {
    isAuthDialogOpen: false,
    authDialogType: AuthDialogType.CUSTOMER,
  },
  vehicle: null,
};

import { createSelector } from "reselect";
import { IAuthState } from "../state/user/authState";
import { RootState } from "../store";

const getAuthState = (state: RootState): IAuthState => state.auth;

const getIsLoggedIn = createSelector(
  getAuthState,
  (authState) => authState.isLoggedIn
);

/**
 * Auth Dialog Selectors
 */
const getAuthDialogIsOpen = createSelector(
  getAuthState,
  (authState) => authState.authDialogState.isAuthDialogOpen
);

const getAuthDialogType = createSelector(
  getAuthState,
  (authState) => authState.authDialogState.authDialogType
);

export const AuthSelectors = {
  getIsLoggedIn,
  getAuthDialogIsOpen,
  getAuthDialogType,
};

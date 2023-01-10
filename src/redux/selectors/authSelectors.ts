import { createSelector } from "reselect";
import { IAuthState } from "../state/user/authState";
import { RootState } from "../store";

const getAuthState = (state: RootState): IAuthState => state.auth;

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

/**
 * Session Selectors
 */
const getUserType = createSelector(
  getAuthState,
  (authState) => authState.userType
);

const getIsLoggedIn = createSelector(
  getAuthState,
  (authState) => authState.isLoggedIn
);

export const AuthSelectors = {
  getIsLoggedIn,
  getUserType,
  getAuthDialogIsOpen,
  getAuthDialogType,
};

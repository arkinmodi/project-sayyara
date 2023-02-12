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
 * Invalid login toast
 */
const getShowInvalidLoginToast = createSelector(
  getAuthState,
  (authState) => authState.showInvalidLoginToast
);

/**
 * Session Selectors
 */
const getUserId = createSelector(
  getAuthState,
  (authState) => authState.session.id
);

const getFirstName = createSelector(
  getAuthState,
  (authState) => authState.session.firstName
);

const getLastName = createSelector(
  getAuthState,
  (authState) => authState.session.lastName
);

const getEmail = createSelector(
  getAuthState,
  (authState) => authState.session.email
);

const getUserType = createSelector(
  getAuthState,
  (authState) => authState.session.userType
);

const getShopId = createSelector(
  getAuthState,
  (authState) => authState.session.shopId
);

const getIsLoggedIn = createSelector(
  getAuthState,
  (authState) => authState.isLoggedIn
);

const getVehicleInfo = createSelector(
  getAuthState,
  (authState) => authState.vehicle
);

export const AuthSelectors = {
  getIsLoggedIn,
  getUserId,
  getFirstName,
  getLastName,
  getEmail,
  getUserType,
  getShopId,
  getAuthDialogIsOpen,
  getAuthDialogType,
  getShowInvalidLoginToast,
  getVehicleInfo,
};

import { createSelector } from "reselect";
import { IAuthState } from "../state/user/authState";
import { RootState } from "../store";

const getAuthState = (state: RootState): IAuthState => state.auth;

const getIsLoggedIn = createSelector(
  getAuthState,
  (authState) => authState.isLoggedIn
);

export const AuthSelectors = {
  getIsLoggedIn,
};

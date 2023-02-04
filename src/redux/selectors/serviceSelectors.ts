import { createSelector } from "reselect";
import { IServiceState } from "../state/user/serviceState";
import { RootState } from "../store";

const getServiceState = (state: RootState): IServiceState | null =>
  state.shop.services;

const getService = createSelector(
  getServiceState,
  (serviceState) => serviceState?.services
);

export const ServiceSelectors = {
  getService,
};

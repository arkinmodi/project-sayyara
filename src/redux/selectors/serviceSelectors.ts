import { IServiceState } from "@redux/state/user/servicesState";
import { createSelector } from "reselect";
import { IService } from "src/types/service";

const getBasicServicesState = (state: IService): IServiceState =>
  state.basicServices;

const getBasicServices = createSelector(
  getBasicServicesState,
  (appointmentsState) => appointmentsState.appointments
);

export const ServiceSelectors = {
  getBasicServices,
  getCustomServices,
};

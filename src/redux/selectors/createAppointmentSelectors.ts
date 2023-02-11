import { ICreateAppointmentState } from "@redux/state/user/createAppointmentState";
import { RootState } from "@redux/store";
import { createSelector } from "reselect";

const getCreateAppointmentsState = (
  state: RootState
): ICreateAppointmentState => state.createAppointments;

const getService = createSelector(
  getCreateAppointmentsState,
  (createAppointmentsState) => createAppointmentsState.service
);

export const AppointmentSelectors = {
  getService,
};

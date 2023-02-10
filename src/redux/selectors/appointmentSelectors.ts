import { createSelector } from "reselect";
import { IAppointmentsState } from "../state/user/appointmentState";
import { RootState } from "../store";

const getAppointmentsState = (state: RootState): IAppointmentsState =>
  state.appointments;

const getCustomerAppointmentsState = (state: RootState): IAppointmentsState =>
  state.appointments;

const getAppointments = createSelector(
  getAppointmentsState,
  (appointmentsState) => appointmentsState.appointments
);

export const AppointmentSelectors = {
  getAppointments,
};

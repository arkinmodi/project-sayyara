import { List } from "reselect/es/types";
import { AppointmentStatus, IAppointment } from "../../types/appointment";
import AppointmentTypes from "../types/appointmentTypes";

interface IAppointmentActionBase {
  type: AppointmentTypes;
}

export interface IAppointmentActionSetAppointmentStatus
  extends IAppointmentActionBase {
  payload: { id: string; status: AppointmentStatus };
}

export interface IAppointmentActionReadAppointments
  extends IAppointmentActionBase {
  payload: void;
}

export interface IAppointmentActionSetAppointments
  extends IAppointmentActionBase {
  payload: { appointments: IAppointment[] };
}

export type IAppointmentAction =
  | IAppointmentActionSetAppointmentStatus
  | IAppointmentActionReadAppointments
  | IAppointmentActionSetAppointments;

export const readAppointments = (payload: void) => ({
  type: AppointmentTypes.READ_APPOINTMENTS,
  payload,
});

export const setAppointments = (
  payload: IAppointmentActionSetAppointments["payload"]
) => ({
  type: AppointmentTypes.SET_APPOINTMENT_STATUS,
  payload,
});

export const setAppointmentsStatus = (payload: AppointmentStatus) => ({
  type: AppointmentTypes.SET_APPOINTMENT_STATUS,
  payload,
});

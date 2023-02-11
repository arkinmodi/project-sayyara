import { ServiceType } from "src/types/service";
import {
  AppointmentStatus,
  ICustomerAppointment,
} from "../../types/appointment";
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
  payload: { id: string };
}

export interface IAppointmentActionSetAppointments
  extends IAppointmentActionBase {
  payload: { appointments: { id: string; appointments: ICustomerAppointment } };
}

export interface IAppointmentActionCreateAppointment
  extends IAppointmentActionBase {
  payload: { serviceType: ServiceType; startTime: string; endTime: string };
}

export type IAppointmentAction =
  | IAppointmentActionSetAppointmentStatus
  | IAppointmentActionReadAppointments
  | IAppointmentActionCreateAppointment;

export const readAppointments = (
  payload: IAppointmentActionReadAppointments["payload"]
) => ({
  type: AppointmentTypes.READ_APPOINTMENTS,
  payload,
});

export const setAppointmentStatus = (
  payload: IAppointmentActionSetAppointmentStatus["payload"]
) => ({
  type: AppointmentTypes.SET_APPOINTMENT_STATUS,
  payload,
});

export const createAppointment = (
  payload: IAppointmentActionCreateAppointment["payload"]
) => ({
  type: AppointmentTypes.CREATE_APPOINTMENT,
  payload,
});

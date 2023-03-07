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

export interface IAppointmentActionSetCancelAppointment
  extends IAppointmentActionBase {
  payload: { id: string; reason: string };
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
  payload: {
    shopId: string;
    customerId: string;
    serviceId: string;
    vehicleId: string;
    quoteId?: string;
    price: number;
    status: AppointmentStatus;
    startTime: string;
    endTime: string;
  };
}

export type IAppointmentAction =
  | IAppointmentActionSetAppointmentStatus
  | IAppointmentActionReadAppointments
  | IAppointmentActionSetCancelAppointment
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

export const setCancelAppointment = (
  payload: IAppointmentActionSetCancelAppointment["payload"]
) => ({
  type: AppointmentTypes.SET_CANCEL_APPOINTMENT,
  payload,
});

export const createAppointment = (
  payload: IAppointmentActionCreateAppointment["payload"]
) => ({
  type: AppointmentTypes.CREATE_APPOINTMENT,
  payload,
});

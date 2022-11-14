import AppointmentTypes from "../types/appointmentTypes";

interface IAppointmentActionBase {
    type: AppointmentTypes;
}

export interface IAppointmentActionCreateAppointment extends IAppointmentActionBase {
    payload: {types: string[], date: string}
}

export const createAppointment = (payload: IAppointmentActionCreateAppointment["payload"]) => ({
    type: AppointmentTypes.CREATE_APPOINTMENT,
    payload,
});
import { IAppointment, ICustomerAppointment } from "src/types/appointment";

export interface IAppointmentsState {
  appointments: IAppointment[];
  customerAppointments: ICustomerAppointment[];
}

export const initialAppointmentsState: IAppointmentsState = {
  appointments: [],
  customerAppointments: [],
};

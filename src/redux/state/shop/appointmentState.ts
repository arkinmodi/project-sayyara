import { ICustomerAppointment } from "src/types/appointment";

export interface IAppointmentsState {
  appointments: { [key: string]: ICustomerAppointment };
}

export const initialAppointmentsState: IAppointmentsState = {
  appointments: {},
};

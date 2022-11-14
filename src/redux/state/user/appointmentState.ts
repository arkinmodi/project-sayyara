import { IAppointment } from "src/types/appointment";

export interface IAppointmentsState {
  appointments: IAppointment[];
}

export const initialAppointmentsState: IAppointmentsState = {
  appointments: [],
};

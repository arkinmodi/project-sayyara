import { IService } from "src/types/service";

export interface ICreateAppointmentState {
  service: IService | null;
}

export const initialCreateAppointmentState: ICreateAppointmentState = {
  service: null,
};

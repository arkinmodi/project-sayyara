import { IService } from "src/types/service";

export interface IServiceState {
  basicServices: IService[];
  customServices: IService[];
}

export const initialAppointmentsState: IServiceState = {
  basicServices: [],
  customServices: [],
};

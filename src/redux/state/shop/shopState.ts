import { IAppointment } from "src/types/appointment";
import { IEmployee } from "src/types/employee";
import { IService } from "src/types/service";

export interface IShopState {
  employees: IEmployee[] | null;
  services: IService[] | null;
  appointments: IAppointment[] | null;
}

export const initialShopState: IShopState = {
  employees: null,
  services: null,
  appointments: null,
};

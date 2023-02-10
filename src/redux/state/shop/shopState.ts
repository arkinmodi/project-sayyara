import { IEmployee } from "src/types/employee";
import { IService } from "src/types/service";

export interface IShopState {
  employees: IEmployee[] | null;
  services: IService[] | null;
}

export const initialShopState: IShopState = {
  employees: null,
  services: null,
};

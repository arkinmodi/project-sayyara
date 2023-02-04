import { IEmployee } from "src/types/employee";
import { IServiceState } from "../user/serviceState";

export interface IShopState {
  employees: IEmployee[] | null;
  services: IServiceState | null;
}

export const initialShopState: IShopState = {
  employees: null,
  services: null,
};

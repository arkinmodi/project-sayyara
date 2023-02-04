import { IEmployee } from "src/types/employee";

export interface IShopState {
  employees: IEmployee[] | null;
}

export const initialShopState: IShopState = {
  employees: null,
};

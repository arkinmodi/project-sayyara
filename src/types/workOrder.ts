import { ICustomer } from "./customer";
import { IEmployee } from "./employee";
import { IVehicle } from "./vehicle";

export interface IWorkOrder {
  id: string;
  create_time: Date;
  update_time: Date;
  title: string;
  body: string;
  shop_id: string;
  customer_id: string;
  customer: ICustomer;
  vehicle_id: string;
  vehicle: IVehicle;
  employee_id: string | null;
  employee: IEmployee | null;
}

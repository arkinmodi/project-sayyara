import { ICustomer } from "./customer";
import { IEmployee } from "./employee";
import { IVehicle } from "./vehicle";

export interface IWorkOrder {
  id: string;
  createTime: Date;
  updateTime: Date;
  status: WorkOrderStatus;
  title: string;
  body: string;
  shopId: string;
  customerId: string;
  customer: ICustomer;
  vehicleId: string;
  vehicle: IVehicle;
  employeeId: string | null;
  employee: IEmployee | null;
}

export enum WorkOrderStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

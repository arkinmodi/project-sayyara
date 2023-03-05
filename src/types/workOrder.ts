import { IAppointment } from "./appointment";
import { ICustomer } from "./customer";
import { IEmployee } from "./employee";
import { IVehicle } from "./vehicle";

export interface IWorkOrder {
  id: string;
  createTime: Date;
  updateTime: Date;
  appointment: IAppointment | null;
  title: string;
  body: string;
  shopId: string;
  customerId: string;
  customer: ICustomer;
  vehicleId: string;
  vehicle: IVehicle;
  employeeId: string | null;
  employee: IEmployee | null;
  cancellationReason: string | null;
}

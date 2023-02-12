import { ICustomer } from "./customer";
import { IVehicle } from "./vehicle";

export interface IAppointment {
  id: string;
  startTime: Date;
  endTime: Date;
  shopId: string;
  customer: ICustomer;
  quoteId: string | null;
  serviceName: string;
  price: Number;
  status: AppointmentStatus;
  workOrderId: string;
  vehicle: IVehicle;
}

export interface IAppointmentTimes {
  startTime: Date;
  endTime: Date;
}

export enum AppointmentStatus {
  PENDING_APPROVAL = "PENDING_APPROVAL",
  ACCEPTED = "ACCEPTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  REJECTED = "REJECTED",
}

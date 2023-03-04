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
  price: number;
  status: AppointmentStatus;
  workOrderId: string;
  vehicle: IVehicle;
}

export interface IAppointmentTimes {
  startTime: Date;
  endTime: Date;
}

export interface ICustomerAppointment {
  id: string;
  startTime: Date;
  endTime: Date;
  shopName: string;
  shopAddress: string;
  quoteId: string | null;
  workOrderId: string;
  serviceName: string;
  price: number;
  status: AppointmentStatus;
  vehicle: IVehicle;
}

export enum AppointmentStatus {
  PENDING_APPROVAL = "PENDING_APPROVAL",
  ACCEPTED = "ACCEPTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED",
}

import { ICustomer } from "./customer";
import { IVehicle } from "./vehicle";

export interface IAppointment {
  id: string;
  startTime: Date;
  endTime: Date;
  shopId: string | null;
  customer: ICustomer | null;
  quoteId: string | null;
  serviceType: string;
  price: Number | null;
  status: AppointmentStatus;
  workOrderId: string;
  vehicle: IVehicle | null;
}

export enum AppointmentStatus {
  PENDING_APPROVAL = "PENDING_APPROVAL",
  ACCEPTED = "ACCEPTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  REJECTED = "REJECTED",
}

export interface IAppointment {
  id: String;
  startTime: Date;
  endTime: Date;
  shopId: String;
  customerId: String;
  quoteId: String;
  serviceType: String;
  price: Number;
  status: AppointmentStatus;
  vehicleMake: String;
  vehicleModel: String;
  vehicleManufactureYear: Number;
}

export enum AppointmentStatus {
  PENDING_APPROVAL = "PENDING_APPROVAL",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

export enum AppointmentProgress {
  REQUESTED = "REQUESTED",
  SCHEDULED = "SCHEDULED",
  IN_PROGRESS = "IN PROGRESS",
  COMPLETED = "COMPLETED",
}

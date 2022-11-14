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
}

export enum AppointmentStatus {
  PENDING_APPROVAL = "PENDING_APPROVAL",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

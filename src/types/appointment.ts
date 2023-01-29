export interface IAppointment {
  id: String;
  startTime: Date;
  endTime: Date;
  shopId: String;
  customerFirstName: String;
  customerLastName: String;
  customerPhoneNumber: String;
  quoteId: String;
  serviceType: String;
  price: Number;
  status: AppointmentStatus;
  workOrderId: String;
  vehicleMake: String;
  vehicleModel: String;
  vehicleManufactureYear: Number;
}

export enum AppointmentStatus {
  PENDING_APPROVAL = "PENDING_APPROVAL",
  ACCEPTED = "ACCEPTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  REJECTED = "REJECTED",
}

export interface IAppointment {
    id: String,
    start_time: Date,
    end_time: Date,
    shop_id: String,
    customer_id: String,
    quote_id: String,
    service_type: String,
    price: Number,
    status: AppointmentStatus
}

export enum AppointmentStatus {
    PENDING_APPROVAL,
    ACCEPTED,
    REJECTED
}
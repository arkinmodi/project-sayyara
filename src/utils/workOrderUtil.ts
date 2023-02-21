import { AppointmentStatus } from "@prisma/client";
import { IAppointment } from "src/types/appointment";
import { IEmployee } from "src/types/employee";
import { IWorkOrder } from "src/types/workOrder";

export const getWorkOrderById = async (
  id: string
): Promise<
  | { success: true; data: IWorkOrder }
  | { success: false; data: { message: string } }
> => {
  return fetch(`/api/work-order/${id}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then(async (res) => {
    if (res.ok) {
      const data = await res.json().then((data): IWorkOrder => {
        const employee: IEmployee | null =
          data.employee !== null
            ? {
                id: data.employee.id,
                firstName: data.employee.first_name,
                lastName: data.employee.last_name,
                phoneNumber: data.employee.phone_number,
                email: data.employee.email,
                type: data.employee.type,
                status: data.employee.status,
              }
            : null;

        const appointment: IAppointment | null =
          data.appointment !== null
            ? {
                id: data.appointment.id,
                startTime: new Date(data.appointment.start_time),
                endTime: new Date(data.appointment.end_time),
                shopId: data.appointment.shop_id,
                customer: data.appointment.customer_id,
                quoteId: data.appointment.quote_id,
                serviceName: data.appointment.service_id,
                price: data.appointment.price,
                status: data.appointment.status,
                workOrderId: data.appointment.work_order_id,
                vehicle: data.appointment.vehicle_id,
              }
            : null;

        return {
          id: data.id,
          createTime: new Date(data.create_time),
          updateTime: new Date(data.update_time),
          title: data.title,
          customerId: data.customer_id,
          vehicleId: data.vehicle_id,
          employeeId: data.employee_id,
          body: data.body,
          shopId: data.shop_id,
          customer: {
            id: data.customer.id,
            first_name: data.customer.first_name,
            last_name: data.customer.last_name,
            phone_number: data.customer.phone_number,
            email: data.customer.email,
          },
          vehicle: {
            id: data.vehicle.id,
            make: data.vehicle.make,
            model: data.vehicle.model,
            year: data.vehicle.year,
            vin: data.vehicle.vin,
            license_plate: data.vehicle.license_plate,
          },
          employee,
          appointment,
        };
      });

      return {
        data,
        success: true,
      };
    } else {
      return {
        data: (await res.json()) as { message: string },
        success: false,
      };
    }
  });
};

export type PatchWorkOrderByIdBody = {
  title?: string;
  body?: string;
  employee_id?: string;
  employee_email?: string;
};

export const patchWorkOrderById = async (
  id: string,
  patch: PatchWorkOrderByIdBody
): Promise<
  | { success: true; data: IWorkOrder }
  | { success: false; data: { message: string } }
> => {
  return fetch(`/api/work-order/${id}`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(patch),
  }).then(async (res) => {
    if (res.ok) {
      return getWorkOrderById(id);
    } else {
      const data = (await res.json()) as { message: string };
      data.message = JSON.stringify(data.message);
      return {
        success: false,
        data,
      };
    }
  });
};

export type PatchAppointmentByIdBody = {
  status?: AppointmentStatus;
};

export const patchAppointmentById = async (
  workOrderId: string,
  appointmentId: string,
  patch: PatchAppointmentByIdBody
): Promise<
  | { success: true; data: IWorkOrder }
  | { success: false; data: { message: string } }
> => {
  return fetch(`/api/appointment/${appointmentId}`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(patch),
  }).then(async (res) => {
    if (res.ok) {
      return getWorkOrderById(workOrderId);
    } else {
      const data = (await res.json()) as { message: string };
      data.message = JSON.stringify(data.message);
      return {
        success: false,
        data,
      };
    }
  });
};

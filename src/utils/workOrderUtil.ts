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
                firstName: data.employee.firstName,
                lastName: data.employee.lastName,
                phoneNumber: data.employee.phoneNumber,
                email: data.employee.email,
                type: data.employee.type,
                status: data.employee.status,
              }
            : null;

        const appointment: IAppointment | null =
          data.appointment !== null
            ? {
                id: data.appointment.id,
                startTime: new Date(data.appointment.startTime),
                endTime: new Date(data.appointment.endTime),
                shopId: data.appointment.shopId,
                customer: data.appointment.customerId,
                quoteId: data.appointment.quoteId,
                serviceName: data.appointment.serviceId,
                price: data.appointment.price,
                status: data.appointment.status,
                workOrderId: data.appointment.workOrderId,
                vehicle: data.appointment.vehicleId,
                cancellationReason: data.appointment.cancellationReason,
              }
            : null;

        return {
          id: data.id,
          createTime: new Date(data.createTime),
          updateTime: new Date(data.updateTime),
          title: data.title,
          customerId: data.customerId,
          vehicleId: data.vehicleId,
          employeeId: data.employeeId,
          body: data.body,
          shopId: data.shopId,
          cancellationReason: data.cancellationReason,
          customer: {
            id: data.customer.id,
            firstName: data.customer.firstName,
            lastName: data.customer.lastName,
            phoneNumber: data.customer.phoneNumber,
            email: data.customer.email,
          },
          vehicle: {
            id: data.vehicle.id,
            make: data.vehicle.make,
            model: data.vehicle.model,
            year: data.vehicle.year,
            vin: data.vehicle.vin,
            licensePlate: data.vehicle.licensePlate,
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
  employeeId?: string;
  employeeEmail?: string;
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

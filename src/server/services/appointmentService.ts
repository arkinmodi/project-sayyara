import { AppointmentStatus, prisma, ServiceType } from "@server/db/client";
import { z } from "zod";

export const createAppointmentSchema = z.object({
  quote_id: z.string().optional(),
  vehicle_id: z.string(),
  service_type: z.nativeEnum(ServiceType),
  price: z.number().min(0).optional(),
  employee_id: z.string().optional(),
  customer_id: z.string(),
  start_time: z.date(),
  end_time: z.date(),
  shop_id: z.string(),
});
export type CreateAppointmentType = z.infer<typeof createAppointmentSchema>;

export const createAppointment = async (appointment: CreateAppointmentType) => {
  const now = new Date();

  if (
    appointment.start_time > appointment.end_time ||
    appointment.start_time < now ||
    appointment.end_time < now
  ) {
    return Promise.reject("Invalid start time and/or end time.");
  }

  const quote = appointment.quote_id
    ? { quote: { connect: { id: appointment.quote_id } } }
    : { quote: {} };

  const employee = appointment.employee_id
    ? { employee: { connect: { id: appointment.employee_id } } }
    : { employee: {} };

  return await prisma.appointment.create({
    data: {
      status: "PENDING_APPROVAL",
      start_time: appointment.start_time,
      end_time: appointment.end_time,
      price: appointment.price,
      service_type: appointment.service_type,
      work_order: { create: { create_time: now, update_time: now } },
      vehicle: { connect: { id: appointment.vehicle_id } },
      customer: { connect: { id: appointment.customer_id } },
      shop: { connect: { id: appointment.shop_id } },
      ...quote,
      ...employee,
    },
  });
};

export const getAppointmentById = async (id: string) => {
  return await prisma.appointment.findUnique({ where: { id } });
};

export const updateAppointmentSchema = z.object({
  quote_id: z.string().optional(),
  work_order_id: z.string().optional(),
  vehicle_id: z.string().optional(),
  service_type: z.nativeEnum(ServiceType).optional(),
  price: z.number().min(0).optional(),
  employee_id: z.string().optional(),
  customer_id: z.string().optional(),
  status: z.nativeEnum(AppointmentStatus).optional(),
  start_time: z.date().optional(),
  end_time: z.date().optional(),
});
export type UpdateAppointmentType = z.infer<typeof updateAppointmentSchema>;

export const updateAppointmentById = async (
  id: string,
  patch: UpdateAppointmentType
) => {
  const appointment = await prisma.appointment.findUnique({ where: { id } });
  if (!appointment) return Promise.reject("Appointment not found.");

  const now = new Date();
  if (
    (patch.start_time && patch.start_time < now) ||
    (patch.end_time && patch.end_time < now) ||
    (patch.start_time && patch.end_time && patch.start_time > patch.end_time)
  ) {
    return Promise.reject("Invalid start time and/or end time.");
  }

  if (
    appointment.status === "PENDING_APPROVAL" &&
    patch.status === "ACCEPTED"
  ) {
    acceptAppointment(id);
  }

  return await prisma.appointment.update({ where: { id }, data: patch });
};

const acceptAppointment = async (id: string) => {
  const acceptedAppointment = await prisma.appointment.findUnique({
    where: { id },
  });
  if (!acceptedAppointment) return Promise.reject("Appointment not found.");

  await prisma.appointment.update({
    where: { id },
    data: {
      status: "ACCEPTED",
    },
  });

  // Reject all other appointments conflicting
  await prisma.appointment.updateMany({
    where: {
      AND: [
        { start_time: { gte: acceptedAppointment.start_time } },
        { end_time: { lte: acceptedAppointment.start_time } },
      ],
      NOT: [
        { id: { equals: acceptedAppointment.id } },
        { status: { equals: "REJECTED" } },
      ],
    },
    data: {
      status: "REJECTED",
    },
  });

  await prisma.appointment.updateMany({
    where: {
      AND: [
        { start_time: { gte: acceptedAppointment.end_time } },
        { end_time: { lte: acceptedAppointment.end_time } },
      ],
      NOT: [
        { id: { equals: acceptedAppointment.id } },
        { status: { equals: "REJECTED" } },
      ],
    },
    data: {
      status: "REJECTED",
    },
  });
};

export const deleteAppointment = async (id: string) => {
  return await prisma.appointment.delete({ where: { id } });
};

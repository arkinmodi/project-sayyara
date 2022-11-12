import {
  Appointment,
  AppointmentStatus,
  prisma,
  ServiceType,
} from "@server/db/client";
import { z } from "zod";

export const createAppointmentSchema = z.object({
  quote_id: z.string().optional(),
  service_type: z.nativeEnum(ServiceType),
  price: z.number().min(0).optional(),
  employee_id: z.string().optional(),
  start_time: z.preprocess((arg) => {
    if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
  }, z.date()),
  end_time: z.preprocess((arg) => {
    if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
  }, z.date()),

  // TODO: make these required
  vehicle_id: z.string().optional(),
  customer_id: z.string().optional(),
  shop_id: z.string().optional(),
});
export type CreateAppointmentType = z.infer<typeof createAppointmentSchema>;

export const createAppointment = async (appointment: CreateAppointmentType) => {
  const now = new Date();

  // TODO: Do we want to only accept events that are in the future?
  // Ensure start occurs before end
  if (
    appointment.start_time > appointment.end_time
    // || appointment.start_time < now ||
    // appointment.end_time < now
  ) {
    return Promise.reject("Invalid start time and/or end time.");
  }

  const quote = appointment.quote_id
    ? { quote: { connect: { id: appointment.quote_id } } }
    : { quote: {} };

  const employee = appointment.employee_id
    ? { employee: { connect: { id: appointment.employee_id } } }
    : { employee: {} };

  const vehicle = appointment.vehicle_id
    ? { vehicle: { connect: { id: appointment.vehicle_id } } }
    : { vehicle: {} };

  const customer = appointment.customer_id
    ? { customer: { connect: { id: appointment.customer_id } } }
    : { customer: {} };

  const shop = appointment.shop_id
    ? { shop: { connect: { id: appointment.shop_id } } }
    : { shop: {} };

  return await prisma.appointment.create({
    data: {
      status: AppointmentStatus.PENDING_APPROVAL,
      start_time: appointment.start_time,
      end_time: appointment.end_time,
      price: appointment.price,
      service_type: appointment.service_type,
      work_order: { create: { create_time: now, update_time: now } },
      // vehicle: { connect: { id: appointment.vehicle_id } },
      ...vehicle,
      // customer: { connect: { id: appointment.customer_id } },
      ...customer,
      // shop: { connect: { id: appointment.shop_id } },
      ...shop,
      ...quote,
      ...employee,
    },
  });
};

export const getAllAppointment = async () => {
  return await prisma.appointment.findMany({});
};

export const getAppointmentById = async (id: string) => {
  return await prisma.appointment.findUnique({ where: { id } });
};

export const getAppointmentByShopId = async (shopId: string) => {
  return await prisma.appointment.findMany({ where: { shop_id: shopId } });
};

export const updateAppointmentSchema = z.object({
  quote_id: z.string().optional(),
  work_order_id: z.string().optional(),
  vehicle_id: z.string().optional(),
  service_type: z.nativeEnum(ServiceType).optional(),
  price: z.number().min(0).optional(),
  employee_id: z.string().optional(),
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
    await acceptAppointment(appointment);
  }

  const workOrderUpdate = patch.work_order_id
    ? { work_order: { connect: { id: patch.work_order_id } } }
    : {};

  const vehicleUpdate = patch.vehicle_id
    ? { vehicle: { connect: { id: patch.vehicle_id } } }
    : {};

  const employeeUpdate = patch.employee_id
    ? { employee: { connect: { id: patch.employee_id } } }
    : {};

  return await prisma.appointment.update({
    where: { id },
    data: {
      service_type: patch.service_type,
      price: patch.price,
      status: patch.status,
      start_time: patch.start_time,
      end_time: patch.end_time,
      ...workOrderUpdate,
      ...vehicleUpdate,
      ...employeeUpdate,
    },
  });
};

const acceptAppointment = async (appointment: Appointment) => {
  await prisma.$transaction([
    prisma.appointment.update({
      where: { id: appointment.id },
      data: {
        status: AppointmentStatus.ACCEPTED,
      },
    }),

    // Reject all other appointments conflicting
    prisma.appointment.updateMany({
      where: {
        OR: [
          {
            start_time: {
              gte: appointment.start_time,
              lt: appointment.end_time,
            },
          },
          {
            end_time: {
              gt: appointment.start_time,
              lte: appointment.end_time,
            },
          },
        ],
        NOT: [
          { id: { equals: appointment.id } },
          { status: { equals: AppointmentStatus.REJECTED } },
        ],
      },
      data: {
        status: AppointmentStatus.REJECTED,
      },
    }),

    prisma.appointment.updateMany({
      where: {
        AND: [
          { start_time: { lte: appointment.start_time } },
          { end_time: { gte: appointment.end_time } },
        ],
        NOT: [
          { id: { equals: appointment.id } },
          { status: { equals: AppointmentStatus.REJECTED } },
        ],
      },
      data: {
        status: AppointmentStatus.REJECTED,
      },
    }),
  ]);
};

export const deleteAppointment = async (id: string) => {
  return await prisma.appointment.delete({ where: { id } });
};

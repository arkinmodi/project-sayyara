import { Appointment, AppointmentStatus, prisma } from "@server/db/client";
import { z } from "zod";

export const createAppointmentSchema = z.object({
  quote_id: z.string().optional(),
  price: z.number().min(0),
  employee_id: z.string().optional(),
  start_time: z.preprocess((arg) => {
    if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
  }, z.date()),
  end_time: z.preprocess((arg) => {
    if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
  }, z.date()),
  vehicle_id: z.string(),
  customer_id: z.string(),
  shop_id: z.string(),
  service_id: z.string(),
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

  return await prisma.appointment.create({
    data: {
      start_time: appointment.start_time,
      end_time: appointment.end_time,
      price: appointment.price,
      work_order: {
        create: {
          create_time: now,
          update_time: now,
          title: "New Work Order",
          body: "",
          customer: { connect: { id: appointment.customer_id } },
          vehicle: { connect: { id: appointment.vehicle_id } },
          shop: { connect: { id: appointment.shop_id } },
        },
      },
      vehicle: { connect: { id: appointment.vehicle_id } },
      customer: { connect: { id: appointment.customer_id } },
      shop: { connect: { id: appointment.shop_id } },
      service: { connect: { id: appointment.service_id } },
      ...quote,
      ...employee,
    },
  });
};

export const getAllAppointments = async () => {
  return await prisma.appointment.findMany({});
};

export const getAppointmentById = async (id: string) => {
  return await prisma.appointment.findUnique({ where: { id } });
};

export const getAppointmentsByShopId = async (shop_id: string) => {
  return await prisma.appointment.findMany({ where: { shop_id } });
};

export const getAvailabilitiesByShopId = async (
  shop_id: string,
  start_date: Date,
  end_date: Date
) => {
  return await prisma.appointment.findMany({
    where: {
      AND: [
        { shop_id: { equals: shop_id } },
        { start_time: { gte: start_date } },
        { end_time: { lte: end_date } },
      ],
    },
    orderBy: { start_time: "asc" },
  });
};

export const getAppointmentsByCustomerId = async (customer_id: string) => {
  return await prisma.appointment.findMany({ where: { customer_id } });
};

export const updateAppointmentSchema = z.object({
  quote_id: z.string().optional(),
  work_order_id: z.string().optional(),
  vehicle_id: z.string().optional(),
  price: z.number().min(0).optional(),
  employee_id: z.string().optional(),
  status: z.nativeEnum(AppointmentStatus).optional(),
  start_time: z.date().optional(),
  end_time: z.date().optional(),
  cancellation_reason: z.string().optional(),
});

export type UpdateAppointmentType = z.infer<typeof updateAppointmentSchema>;

export const updateAppointmentById = async (
  id: string,
  patch: UpdateAppointmentType
) => {
  const appointment = await getAppointmentById(id);
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
      price: patch.price,
      status: patch.status,
      start_time: patch.start_time,
      end_time: patch.end_time,
      cancellation_reason: patch.cancellation_reason,
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
        status: "ACCEPTED",
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
          { status: { equals: "REJECTED" } },
        ],
      },
      data: {
        status: "REJECTED",
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
          { status: { equals: "REJECTED" } },
        ],
      },
      data: {
        status: "REJECTED",
      },
    }),
  ]);
};

export const deleteAppointment = async (id: string) => {
  return await prisma.appointment.delete({ where: { id } });
};

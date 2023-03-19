import exclude from "@server/common/excludeField";
import { Appointment, AppointmentStatus, prisma } from "@server/db/client";
import { getServiceById } from "@server/services/serviceService";
import { z } from "zod";

export const createAppointmentSchema = z.object({
  quoteId: z.string().optional(),
  price: z.number().min(0),
  employeeId: z.string().optional(),
  startTime: z.preprocess((arg) => {
    if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
  }, z.date()),
  endTime: z.preprocess((arg) => {
    if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
  }, z.date()),
  vehicleId: z.string(),
  customerId: z.string(),
  shopId: z.string(),
  serviceId: z.string(),
});

export type CreateAppointmentType = z.infer<typeof createAppointmentSchema>;

export const createAppointment = async (appointment: CreateAppointmentType) => {
  const service = await getServiceById(appointment.serviceId);

  const now = new Date();

  // TODO: Do we want to only accept events that are in the future?
  // Ensure start occurs before end
  if (
    appointment.startTime > appointment.endTime
    // || appointment.startTime < now ||
    // appointment.endTime < now
  ) {
    return Promise.reject("Invalid start time and/or end time.");
  }

  const quote = appointment.quoteId
    ? { quote: { connect: { id: appointment.quoteId } } }
    : { quote: {} };

  const employee = appointment.employeeId
    ? { employee: { connect: { id: appointment.employeeId } } }
    : { employee: {} };

  return await prisma.appointment.create({
    data: {
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      price: appointment.price,
      workOrder: {
        create: {
          createTime: now,
          updateTime: now,
          title: service.name,
          body: "",
          customer: { connect: { id: appointment.customerId } },
          vehicle: { connect: { id: appointment.vehicleId } },
          shop: { connect: { id: appointment.shopId } },
        },
      },
      vehicle: { connect: { id: appointment.vehicleId } },
      customer: { connect: { id: appointment.customerId } },
      shop: { connect: { id: appointment.shopId } },
      service: { connect: { id: appointment.serviceId } },
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

export const getAppointmentsByShopId = async (shopId: string) => {
  const appointments = await prisma.appointment.findMany({
    where: { shopId },
    include: {
      vehicle: true,
      customer: true,
      service: true,
    },
  });

  appointments.forEach((ap) => exclude(ap.customer, ["password"]));
  return appointments;
};

export const getAvailabilitiesByShopId = async (
  shopId: string,
  startDate: Date,
  endDate: Date
) => {
  return await prisma.appointment.findMany({
    where: {
      AND: [
        { shopId: { equals: shopId } },
        { startTime: { gte: startDate } },
        { endTime: { lte: endDate } },
      ],
    },
    orderBy: { startTime: "asc" },
    select: {
      startTime: true,
      endTime: true,
      status: true,
    },
  });
};

export const getAppointmentsByCustomerId = async (customerId: string) => {
  return await prisma.appointment.findMany({
    where: { customerId },
    include: {
      shop: true,
      service: true,
    },
  });
};

export const updateAppointmentSchema = z.object({
  quoteId: z.string().optional(),
  workOrderId: z.string().optional(),
  vehicleId: z.string().optional(),
  price: z.number().min(0).optional(),
  employeeId: z.string().optional(),
  status: z.nativeEnum(AppointmentStatus).optional(),
  startTime: z.preprocess((arg) => {
    if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
  }, z.date().optional()),
  endTime: z.preprocess((arg) => {
    if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
  }, z.date().optional()),
  cancellationReason: z.string().optional(),
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
    (patch.startTime && patch.startTime < now) ||
    (patch.endTime && patch.endTime < now) ||
    (patch.startTime && patch.endTime && patch.startTime > patch.endTime)
  ) {
    return Promise.reject("Invalid start time and/or end time.");
  }

  if (
    appointment.status === "PENDING_APPROVAL" &&
    patch.status === "ACCEPTED"
  ) {
    await acceptAppointment(appointment);
  }

  const workOrderUpdate = patch.workOrderId
    ? { workOrder: { connect: { id: patch.workOrderId } } }
    : {};

  const vehicleUpdate = patch.vehicleId
    ? { vehicle: { connect: { id: patch.vehicleId } } }
    : {};

  const employeeUpdate = patch.employeeId
    ? { employee: { connect: { id: patch.employeeId } } }
    : {};

  return await prisma.appointment.update({
    where: { id },
    data: {
      price: patch.price,
      status: patch.status,
      startTime: patch.startTime,
      endTime: patch.endTime,
      cancellationReason: patch.cancellationReason,
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
            startTime: {
              gte: appointment.startTime,
              lt: appointment.endTime,
            },
          },
          {
            endTime: {
              gt: appointment.startTime,
              lte: appointment.endTime,
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
          { startTime: { lte: appointment.startTime } },
          { endTime: { gte: appointment.endTime } },
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

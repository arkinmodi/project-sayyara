import { getServerAuthSession } from "@server/common/getServerAuthSession";
import { Appointment, UserType } from "@server/db/client";
import {
  deleteAppointment,
  getAppointmentById,
  updateAppointmentById,
  updateAppointmentSchema,
} from "@server/services/appointmentService";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";

const appointmentByIdHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { id } = req.query;
  if (typeof id !== "string") {
    res.status(400).json({ message: "Invalid Appointment ID." });
    return;
  }

  const session = await getServerAuthSession({ req, res });
  if (!session) {
    res.status(403).json({ message: "Forbidden." });
    return;
  }

  let appointment: Appointment | null;

  switch (req.method) {
    case "GET":
      appointment = await getAppointmentById(id);
      if (appointment) {
        if (isAuthorized(session, appointment)) {
          res.status(200).json(appointment);
        } else {
          res.status(403).json({ message: "Forbidden." });
        }
      } else {
        res.status(404).json({ message: "Appointment not found." });
      }
      break;

    case "PATCH":
      const patch = updateAppointmentSchema.safeParse(req.body);
      if (!patch.success) {
        res.status(400).json({ message: patch.error.issues });
        return;
      }

      appointment = await getAppointmentById(id);
      if (appointment && !isAuthorized(session, appointment)) {
        res.status(403).json({ message: "Forbidden." });
        return;
      }

      appointment = await updateAppointmentById(id, patch.data).catch(
        (reason) => {
          if (reason === "Appointment not found.") res.status(404);
          else res.status(500);
          res.json({ message: reason });
          return null;
        }
      );
      if (appointment) res.status(200).json(appointment);
      break;

    case "DELETE":
      appointment = await getAppointmentById(id);
      if (appointment && !isAuthorized(session, appointment)) {
        res.status(403).json({ message: "Forbidden." });
        return;
      }

      await deleteAppointment(id);
      res.status(204);
      break;

    default:
      res.status(405).json({ message: "Method not allowed." });
  }
};

const isAuthorized = (session: Session, appointment: Appointment) => {
  return !(
    session.user.type === UserType.CUSTOMER &&
    session.user.id !== appointment.customer_id
  );
};

export default appointmentByIdHandler;

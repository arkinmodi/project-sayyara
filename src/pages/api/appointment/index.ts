import { getServerAuthSession } from "@server/common/getServerAuthSession";
import {
  createAppointment,
  createAppointmentSchema,
} from "@server/services/appointmentService";
import { NextApiRequest, NextApiResponse } from "next";

const appointmentHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const session = await getServerAuthSession({ req, res });
  if (!session) {
    res.status(403).json({ message: "Forbidden." });
    return;
  }

  switch (req.method) {
    case "POST":
      const result = createAppointmentSchema.safeParse(req.body);
      if (!result.success) {
        res.status(400).json({ message: result.error.issues });
        return;
      }

      const newAppointment = await createAppointment(result.data).catch(
        (reason) => {
          if (reason === "Invalid start time and/or end time.") res.status(400);
          else res.status(500);
          return null;
        }
      );

      if (newAppointment) res.status(201).json(newAppointment);
      break;

    default:
      res.status(405).json({ message: "Method not allowed." });
      break;
  }
};

export default appointmentHandler;

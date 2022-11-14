import { getServerAuthSession } from "@server/common/getServerAuthSession";
import {
  createAppointment,
  createAppointmentSchema,
  getAllAppointment,
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

      const newAppointment = await createAppointment(result.data);
      res.status(201).json(newAppointment);
      break;

    // TODO: Remove this GET method when shops are setup
    case "GET":
      const appointments = await getAllAppointment();
      res.status(200).json(appointments);
      break;

    default:
      res.status(405).json({ message: "Method not allowed." });
      break;
  }
};

export default appointmentHandler;

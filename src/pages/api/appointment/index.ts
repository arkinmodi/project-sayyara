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

  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed." });
    return;
  }

  const result = createAppointmentSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ message: result.error.issues });
    return;
  }

  const newAppointment = await createAppointment(result.data);
  res.status(201).json(newAppointment);
};

export default appointmentHandler;

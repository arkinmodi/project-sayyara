import { getServerAuthSession } from "@server/common/getServerAuthSession";
import { getAppointmentByShopId } from "@server/services/appointmentService";
import { NextApiRequest, NextApiResponse } from "next";

const appointmentByShopIdHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed." });
    return;
  }

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

  const appointment = await getAppointmentByShopId(id);

  // todo: if the caller is a customer, appointment's response should hide unnecessary information

  res.status(200).json(appointment);
};

export default appointmentByShopIdHandler;

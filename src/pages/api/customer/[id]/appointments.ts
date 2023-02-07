import { getServerAuthSession } from "@server/common/getServerAuthSession";
import { getAppointmentsByCustomerId } from "@server/services/appointmentService";
import { NextApiRequest, NextApiResponse } from "next";

const appointmentByCustomerIdHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed." });
    return;
  }

  const { id } = req.query;
  if (typeof id !== "string") {
    res.status(400).json({ message: "Invalid Customer ID." });
    return;
  }

  const session = await getServerAuthSession({ req, res });
  if (!session || session.user.id !== id) {
    res.status(403).json({ message: "Forbidden." });
    return;
  }

  const appointment = await getAppointmentsByCustomerId(id);
  res.status(200).json(appointment);
};

export default appointmentByCustomerIdHandler;

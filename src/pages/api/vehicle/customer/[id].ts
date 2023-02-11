import { getServerAuthSession } from "@server/common/getServerAuthSession";
import { getVehicleByCustomerId } from "@server/services/vehicleService";
import { NextApiRequest, NextApiResponse } from "next";
import type { Session } from "next-auth";

const vehicleByCustomerIdHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { id } = req.query;
  if (typeof id !== "string") {
    res.status(400).json({ message: "Invalid Customer ID." });
    return;
  }

  const session = await getServerAuthSession({ req, res });
  if (!session) {
    res.status(403).json({ message: "Forbidden." });
    return;
  }

  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed." });
    return;
  }

  const vehicle = await getVehicleByCustomerId(id);
  if (vehicle) {
    if (isAuthorized(session)) {
      res.status(200).json(vehicle);
    } else {
      res.status(403).json({ message: "Forbidden." });
    }
  } else {
    res.status(404).json({ message: "Vehicle not found." });
  }
};

const isAuthorized = (session: Session) => {
  return session.user.type === "CUSTOMER";
};

export default vehicleByCustomerIdHandler;

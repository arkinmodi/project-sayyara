import { getServerAuthSession } from "@server/common/getServerAuthSession";
import { Vehicle } from "@server/db/client";
import { getVehicleById } from "@server/services/vehicleService";
import { NextApiRequest, NextApiResponse } from "next";
import type { Session } from "next-auth";

const vehicleByIdHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { id } = req.query;
  if (typeof id !== "string") {
    res.status(400).json({ message: "Invalid Vehicle ID." });
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

  const vehicle = await getVehicleById(id);
  if (vehicle) {
    if (isAuthorized(session, vehicle)) {
      res.status(200).json(vehicle);
    } else {
      res.status(403).json({ message: "Forbidden." });
    }
  } else {
    res.status(404).json({ message: "Vehicle not found." });
  }
};

const isAuthorized = (session: Session, vehicle: Vehicle) => {
  return (
    session.user.type !== "CUSTOMER" || session.user.id === vehicle.customerId
  );
};

export default vehicleByIdHandler;

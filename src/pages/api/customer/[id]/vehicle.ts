import { getServerAuthSession } from "@server/common/getServerAuthSession";
import { Vehicle } from "@server/db/client";
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

  const vehicles = await getVehicleByCustomerId(id);
  if (vehicles) {
    if (isAuthorized(session, vehicles)) {
      res.status(200).json(vehicles);
    } else {
      res.status(403).json({ message: "Forbidden." });
    }
  } else {
    res.status(404).json({ message: "Vehicle not found." });
  }
};

const isAuthorized = (session: Session, vehicles: Vehicle[]) => {
  return (
    session.user.type === "CUSTOMER" &&
    vehicles.every((vehicle) => {
      return session.user.id === vehicle.customerId;
    })
  );
};

export default vehicleByCustomerIdHandler;

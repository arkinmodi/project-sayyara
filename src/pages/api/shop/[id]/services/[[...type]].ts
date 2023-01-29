import { getServerAuthSession } from "@server/common/getServerAuthSession";
import { Service, ServiceType } from "@server/db/client";
import {
  getCannedServicesByShopId,
  getCustomServicesByShopId,
  getServicesByShopId,
} from "@server/services/serviceService";
import { NextApiRequest, NextApiResponse } from "next";

const serviceByShopIdHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { id, type } = req.query;
  if (typeof id !== "string") {
    res.status(400).json({ message: "Invalid Shop ID." });
    return;
  }

  if (type !== undefined && (typeof type === "string" || type.length > 1)) {
    res.status(400).json({ message: "Invalid Service Type." });
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

  let services: Service[];

  if (type === undefined || type[0] === undefined) {
    services = await getServicesByShopId(id);
  } else if (type[0].toUpperCase() === ServiceType.CANNED) {
    services = await getCannedServicesByShopId(id);
  } else if (type[0].toUpperCase() === ServiceType.CUSTOM) {
    services = await getCustomServicesByShopId(id);
  } else {
    res.status(400).json({ message: "Invalid Service Type." });
    return;
  }
  res.status(200).json(services);
};

export default serviceByShopIdHandler;

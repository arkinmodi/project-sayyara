import { getServerAuthSession } from "@server/common/getServerAuthSession";
import { Service } from "@server/db/client";
import {
  deleteService,
  getServiceById,
  updateServiceById,
  updateServiceSchema,
} from "@server/services/serviceService";
import { NextApiRequest, NextApiResponse } from "next";

const serviceByIdHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { id } = req.query;
  if (typeof id !== "string") {
    res.status(400).json({ message: "Invalid Service ID." });
    return;
  }

  const session = await getServerAuthSession({ req, res });
  if (!session) {
    res.status(403).json({ message: "Forbidden." });
    return;
  }

  let service: Service | null;

  switch (req.method) {
    case "GET":
      service = await getServiceById(id);
      if (service) {
        res.status(200).json(service);
      } else {
        res.status(404).json({ message: "Service not found." });
      }
      break;

    case "PATCH":
      const patch = updateServiceSchema.safeParse(req.body);
      if (!patch.success) {
        res.status(400).json({ message: patch.error.issues });
        return;
      }

      service = await getServiceById(id);
      if (service && session.user.type !== "SHOP_OWNER") {
        res.status(403).json({ message: "Forbidden." });
        return;
      }

      service = await updateServiceById(id, patch.data).catch((reason) => {
        if (reason === "Service not found.") res.status(404);
        else res.status(500);
        res.json({ message: reason });
        return null;
      });
      if (service) res.status(200).json(service);
      break;

    case "DELETE":
      service = await getServiceById(id);
      if (service && session.user.type !== "SHOP_OWNER") {
        res.status(403).json({ message: "Forbidden." });
        return;
      }

      await deleteService(id);
      res.status(204);
      break;

    default:
      res.status(405).json({ message: "Method not allowed." });
  }
};

export default serviceByIdHandler;

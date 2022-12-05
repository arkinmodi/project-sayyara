import { getServerAuthSession } from "@server/common/getServerAuthSession";
import {
  createService,
  createServiceSchema,
} from "@server/services/serviceService";
import { NextApiRequest, NextApiResponse } from "next";

const serviceHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed." });
    return;
  }

  const session = await getServerAuthSession({ req, res });
  if (!session) {
    res.status(403).json({ message: "Forbidden." });
    return;
  }

  // TODO: what do we do about duplicates?

  const result = createServiceSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ message: result.error.issues });
    return;
  }

  const newService = await createService(result.data);
  res.status(201).json(newService);
};

export default serviceHandler;

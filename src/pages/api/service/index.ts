import { getServerAuthSession } from "@server/common/getServerAuthSession";
import {
  createService,
  createServiceSchema,
} from "@server/services/serviceService";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";

const serviceHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed." });
    return;
  }

  const result = createServiceSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ message: result.error.issues });
    return;
  }

  const session = await getServerAuthSession({ req, res });
  if (!session || !isAuthorized(session, result.data.shopId)) {
    res.status(403).json({ message: "Forbidden." });
    return;
  }

  const newService = await createService(result.data);
  res.status(201).json(newService);
};

const isAuthorized = (session: Session, shopId: string) => {
  return session.user.shopId == shopId;
};

export default serviceHandler;

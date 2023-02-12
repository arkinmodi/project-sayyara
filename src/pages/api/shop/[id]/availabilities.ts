import { getAvailabilitiesByShopId } from "@server/services/appointmentService";
import { NextApiRequest, NextApiResponse } from "next";

const availabilitiesByShopIdHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed." });
    return;
  }

  const { id, start, end } = req.query;
  if (typeof id !== "string") {
    res.status(400).json({ message: "Invalid Shop ID." });
    return;
  }

  if (typeof start !== "string" || typeof end !== "string") {
    res.status(400).json({ message: "Invalid dates." });
    return;
  }

  // const session = await getServerAuthSession({ req, res });
  // if (!session) {
  //   res.status(403).json({ message: "Forbidden." });
  //   return;
  // }

  const availabilities = await getAvailabilitiesByShopId(
    id,
    new Date(start),
    new Date(end)
  );

  res.status(200).json(availabilities);
};

export default availabilitiesByShopIdHandler;

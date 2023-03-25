import {
  getShopsByName,
  getShopsByService,
} from "@server/services/shopService";
import { NextApiRequest, NextApiResponse } from "next";

const shopLookupHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed." });
    return;
  }

  const { name, shop } = req.query;

  if (typeof name !== "string" || typeof shop !== "string") {
    res.status(400).json({ message: "Invalid input." });
    return;
  }

  if (shop === "true") {
    const result = await getShopsByName(name);
    res.status(200).json(result);
  } else {
    const result = await getShopsByService(name);
    res.status(200).json(result);
  }
};

export default shopLookupHandler;

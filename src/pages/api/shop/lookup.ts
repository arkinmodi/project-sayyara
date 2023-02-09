import { getFilteredShops } from "@server/services/shopService";
import { NextApiRequest, NextApiResponse } from "next";

const shopLookupHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed." });
    return;
  }

  const { shopName, serviceName } = req.query;

  if (typeof shopName !== "string" || typeof serviceName !== "string") {
    res.status(400).json({ message: "Invalid inputs." });
    return;
  } else {
    const result = await getFilteredShops(shopName, serviceName);
    res.status(200).json(result);
  }
};

export default shopLookupHandler;

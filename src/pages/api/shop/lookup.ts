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

  const { searchStr, searchByShop } = req.query;

  if (typeof searchStr !== "string" || typeof searchByShop !== "string") {
    res.status(400).json({ message: "Invalid input." });
    return;
  }

  if (searchByShop === "true") {
    const result = await getShopsByName(searchStr);
    res.status(200).json(result);
  } else {
    const result = await getShopsByService(searchStr);
    res.status(200).json(result);
  }
};

export default shopLookupHandler;

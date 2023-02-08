import { getServerAuthSession } from "@server/common/getServerAuthSession";
import {
  getShopById,
  updateShopById,
  updateShopSchema,
} from "@server/services/shopService";
import { NextApiRequest, NextApiResponse } from "next";

const shopByIdHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  if (typeof id !== "string") {
    res.status(400).json({ message: "Invalid Shop ID." });
    return;
  }

  const session = await getServerAuthSession({ req, res });

  let shop;

  switch (req.method) {
    case "GET":
      shop = await getShopById(id);
      if (shop) {
        res.status(200).json(shop);
      } else {
        res.status(404).json({ message: "Shop not found." });
      }
      break;

    case "PATCH":
      if (!session) {
        res.status(403).json({ message: "Forbidden." });
        return;
      }

      const patch = updateShopSchema.safeParse(req.body);
      if (!patch.success) {
        res.status(400).json({ message: patch.error.issues });
        return;
      }

      shop = await getShopById(id);

      if (!shop) {
        res.status(404).json({ message: "Shop not found." });
        return;
      }

      if (session.user.type !== "SHOP_OWNER") {
        res.status(403).json({ message: "Forbidden." });
        return;
      }

      shop = await updateShopById(id, patch.data).catch((reason) => {
        if (reason === "Shop not found.") res.status(404);
        else res.status(500);
        res.json({ message: reason });
        return null;
      });
      if (shop) res.status(200).json(shop);
      break;

    default:
      res.status(405).json({ message: "Method not allowed." });
  }
};

export default shopByIdHandler;

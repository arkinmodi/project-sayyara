import { getServerAuthSession } from "@server/common/getServerAuthSession";
import { createQuote, createQuoteSchema } from "@server/services/quoteService";
import { NextApiRequest, NextApiResponse } from "next";
import type { Session } from "next-auth";

const quoteHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerAuthSession({ req, res });
  if (!session) {
    res.status(403).json({ message: "Forbidden." });
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed." });
    return;
  }

  const result = createQuoteSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ message: result.error.issues });
    return;
  }

  if (
    !(await isAuthorized(session, result.data.customer_id, result.data.shop_id))
  ) {
    res.status(403).json({ message: "Forbidden." });
    return;
  }

  const newQuote = await createQuote(result.data);
  res.status(201).json(newQuote);
};

// TODO: enable this when shop profiles can be fetched
const isAuthorized = async (
  session: Session,
  customerId: string,
  shopId: string
) => {
  return true;

  // if (session.user.type === "CUSTOMER") return session.user.id === customerId;

  // const shop = await getShopByEmployeeId(session.user.id);
  // OR
  // const shop = await getShopByEmployeeEmail(session.user.email);

  // return shop.id === shopId;
};

export default quoteHandler;

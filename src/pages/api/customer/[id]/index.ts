import { getServerAuthSession } from "@server/common/getServerAuthSession";
import { Customer } from "@server/db/client";
import { getCustomerById } from "@server/services/userService";
import { NextApiRequest, NextApiResponse } from "next";
import type { Session } from "next-auth";

const customerByIdHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { id } = req.query;
  if (typeof id !== "string") {
    res.status(400).json({ message: "Invalid Customer ID." });
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

  const customer = await getCustomerById(id);
  if (customer) {
    if (isAuthorized(session, customer)) {
      res.status(200).json({
        id: customer.id,
        createTime: customer.createTime,
        updateTime: customer.updateTime,
        firstName: customer.firstName,
        lastName: customer.lastName,
        phoneNumber: customer.phoneNumber,
        email: customer.email,
      });
    } else {
      res.status(403).json({ message: "Forbidden." });
    }
  } else {
    res.status(404).json({ message: "Customer not found." });
  }
};

const isAuthorized = (session: Session, customer: Customer) => {
  return session.user.type !== "CUSTOMER" || session.user.id === customer.id;
};

export default customerByIdHandler;

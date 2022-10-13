import { NextApiRequest, NextApiResponse } from "next";

import {
  createUser,
  getUser,
  registrationSchema,
} from "@server/services/userService";

const registrationHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed." });
  }

  const result = registrationSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ message: result.error });
    return;
  }

  const existingUser = await getUser(result.data.email);
  if (existingUser) {
    res
      .status(409)
      .json({ message: "User with email address already exists." });
  } else {
    await createUser(result.data);
    res.redirect(req.body.callbackUrl ?? "/");
  }
};

export default registrationHandler;

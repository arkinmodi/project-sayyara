import { NextApiRequest, NextApiResponse } from "next";

import {
  createUser,
  getUser,
  registrationSchema,
} from "@server/service/userService";

const registerController = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const data = registrationSchema.parse(req.body);

  const existingUser = await getUser(data.email);
  if (existingUser) {
    res
      .status(409)
      .json({ message: "User with email address already exists." });
  } else {
    await createUser(data);
    res.redirect(req.body.callbackUrl ?? "/");
  }
};

export default registerController;

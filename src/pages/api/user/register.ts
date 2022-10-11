import { NextApiRequest, NextApiResponse } from "next";

import { registerSchema, register, getUser } from "@server/service/userService";

const registerController = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const data = registerSchema.parse(req.body);

  const existingUser = await getUser(data.email);
  if (existingUser) {
    res
      .status(409)
      .json({ message: "User with email address already exists." });
  } else {
    await register(data);
    res.redirect(data.callBackUrl ?? "/");
  }
};

export default registerController;

import {
  createEmployee,
  createEmployeeSchema,
  getUserByEmail,
} from "@server/services/userService";
import { NextApiRequest, NextApiResponse } from "next";

const registerEmployeeHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed." });
    return;
  }

  const result = createEmployeeSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ message: result.error.issues });
    return;
  }

  const existingUser = await getUserByEmail(result.data.email);
  if (existingUser) {
    res
      .status(409)
      .json({ message: "User with email address already exists." });
  } else {
    await createEmployee(result.data);
    res.redirect(302, req.body.callbackUrl ?? "/");
  }
};

export default registerEmployeeHandler;

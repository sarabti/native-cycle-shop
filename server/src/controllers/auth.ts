import type { RequestHandler } from "express";
import { sendErrorRes } from "src/utils/helper";

export const createNewUser: RequestHandler = async (req, res) => {
  // Read incoming data like: name, email, password
  const { email, password, name } = req.body;

  // Validate if the data is ok or not
  if (!name) return sendErrorRes(res, "Name is missing!", 422);
  if (!email) return sendErrorRes(res, "Email is missing!", 422);
  if (!password) return sendErrorRes(res, "Password is missing!", 422);

  res.json({ message: "Please check your inbox." });
};

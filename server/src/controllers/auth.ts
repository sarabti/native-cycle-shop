import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import UserModel from "src/models/user";
import { sendErrorRes } from "src/utils/helper";
import crypto from "crypto";
import AuthVerificationTokenModal from "src/models/authVerificationToken";
import mail from "src/utils/mail";
const VERIFICATION_LINK = process.env.VERIFICATION_LINK;

export const createNewUser: RequestHandler = async (req, res) => {
  // Read incoming data like: name, email, password
  const { email, password, name } = req.body;

  // Validate if the data is ok or not
  if (!name) return sendErrorRes(res, "Name is missing!", 422);
  if (!email) return sendErrorRes(res, "Email is missing!", 422);
  if (!password) return sendErrorRes(res, "Password is missing!", 422);

  const existingUser = await UserModel.findOne({ email });
  // Send error if email exists otherwise create new account and save user inside DB.
  if (existingUser)
    return sendErrorRes(
      res,
      "Unauthorized request, email is already in use!",
      401,
    );

  const user = await UserModel.create({ name, email, password });

  // Generate and Store verification token.
  const token = crypto.randomBytes(36).toString("hex");
  await AuthVerificationTokenModal.create({ owner: user._id, token });

  // Send verification link with token to register email.
  const link = `${VERIFICATION_LINK}?id=${user._id}&token=${token}`;

  await mail.sendVerification(user.email, link);

  res.json({ message: "Please check your inbox." });
};

export const verifyEmail: RequestHandler = async (req, res) => {
  const { id, token } = req.body;

  // Find the token inside DB(using owner id).
  const authToken = await AuthVerificationTokenModal.findOne({ owner: id });
  // Send error if token not found.
  if (!authToken) return sendErrorRes(res, "Unauthorized request!", 403);

  const isMatched = await authToken.compareToken(token);

  // // If not valid send error otherwise update user is verified.
  if (!isMatched)
    return sendErrorRes(res, "Unauthorized request, invalid token!", 403);
  await UserModel.findByIdAndUpdate(id, { verified: true });

  // Remove token from database.
  await AuthVerificationTokenModal.findByIdAndDelete(authToken._id);

  res.json({ message: "Thanks for joining us, your email is now verified." });
};

export const signIn: RequestHandler = async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });
  // Send error if user not found.
  if (!user) return sendErrorRes(res, "Email/Password is incorrect.", 403);

  // Check if the password is valid or not (because pass is in encrypted form).
  const isMatched = await user.comparePassword(password);

  if (!isMatched) return sendErrorRes(res, "Email/Password is incorrect.", 403);

  const payload = { id: user._id };

  const accessToken = jwt.sign(payload, "veryverysecret", {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign(payload, "veryverysecret");

  if (!user.tokens) user.tokens = [refreshToken];
  else user.tokens.push(refreshToken);

  await user.save();

  res.json({
    profile: {
      id: user._id,
      email: user.email,
      name: user.name,
      verified: user.verified,
      avatar: user.avatar?.url,
    },
    tokens: { refresh: refreshToken, access: accessToken },
  });
};
